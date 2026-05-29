from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain_community.vectorstores import Chroma
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.chains import ConversationalRetrievalChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate
from typing import List, Dict, Tuple
import os
from app.core.config import settings

class RAGService:
    def __init__(self):
        self.embeddings = None
        self.llm = None
        self.text_splitter = RecursiveCharacterTextSplitter(
            chunk_size=1000,
            chunk_overlap=200,
            length_function=len,
        )
        
        self.prompt_template = "You are a helpful AI assistant for a business.\n\nUse ONLY the provided context to answer the user's question.\nIf you cannot find the answer in the context, politely say: \"I don't have that information right now. Let me connect you with a human representative who can help you better.\"\n\nIf the user shows intent to book, purchase, or needs human assistance, ask for their:\n- Name\n- Email\n- Phone number\n\nContext:\n{context}\n\nChat History:\n{chat_history}\n\nUser Question:\n{question}\n\nHelpful Answer:"

    def _get_embeddings(self):
        if self.embeddings is None:
            self.embeddings = OpenAIEmbeddings(openai_api_key=settings.OPENAI_API_KEY)
        return self.embeddings

    def _get_llm(self):
        if self.llm is None:
            self.llm = ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.7,
                openai_api_key=settings.OPENAI_API_KEY
            )
        return self.llm

    def create_vector_store(self, bot_id: str, documents: List[str]) -> Chroma:
        texts = []
        for doc in documents:
            chunks = self.text_splitter.split_text(doc)
            texts.extend(chunks)
        
        persist_directory = os.path.join(settings.CHROMA_PERSIST_DIR, bot_id)
        
        vectorstore = Chroma.from_texts(
            texts=texts,
            embedding=self._get_embeddings(),
            persist_directory=persist_directory,
            collection_name=f"bot_{bot_id}"
        )
        
        return vectorstore

    def get_vector_store(self, bot_id: str) -> Chroma:
        persist_directory = os.path.join(settings.CHROMA_PERSIST_DIR, bot_id)
        
        if not os.path.exists(persist_directory):
            return None
        
        vectorstore = Chroma(
            persist_directory=persist_directory,
            embedding_function=self._get_embeddings(),
            collection_name=f"bot_{bot_id}"
        )
        
        return vectorstore

    def get_response(self, bot_id: str, question: str, chat_history: List[Tuple[str, str]] = None) -> Dict:
        vectorstore = self.get_vector_store(bot_id)
        
        if not vectorstore:
            return {
                "answer": "This bot hasn't been trained yet. Please upload documents first.",
                "sources": []
            }
        
        prompt = PromptTemplate(
            template=self.prompt_template,
            input_variables=["context", "chat_history", "question"]
        )
        
        memory = ConversationBufferMemory(
            memory_key="chat_history",
            return_messages=True,
            output_key="answer"
        )
        
        if chat_history:
            for human, ai in chat_history:
                memory.save_context({"input": human}, {"output": ai})
        
        qa_chain = ConversationalRetrievalChain.from_llm(
            llm=self._get_llm(),
            retriever=vectorstore.as_retriever(search_kwargs={"k": 3}),
            memory=memory,
            return_source_documents=True,
            combine_docs_chain_kwargs={"prompt": prompt}
        )
        
        result = qa_chain({"question": question})
        
        sources = [doc.page_content[:200] for doc in result.get("source_documents", [])]
        
        return {
            "answer": result["answer"],
            "sources": sources
        }

    def delete_vector_store(self, bot_id: str):
        persist_directory = os.path.join(settings.CHROMA_PERSIST_DIR, bot_id)
        if os.path.exists(persist_directory):
            import shutil
            shutil.rmtree(persist_directory)

rag_service = RAGService()
