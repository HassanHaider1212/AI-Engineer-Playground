# LangChain Models & Semantic Search

A LangChain-based project covering **embeddings**, **chat models**, **LLMs**, and **prompts**. Includes semantic search with cosine similarity, Streamlit UIs, and conversation demos. Supports OpenAI and Hugging Face (cloud and local).

## Features

- **Embeddings**: OpenAI (`text-embedding-3-large`) and Hugging Face (sentence-transformers) for documents and queries
- **Semantic search**: Cosine similarity for ranking and retrieval
- **Chat models**: OpenAI and Hugging Face chat with message-based APIs
- **LLMs**: Direct LLM invocation (e.g. OpenAI `gpt-3.5-turbo-instruct`)
- **Prompts**: `PromptTemplate`, research-paper summarizer UI (Streamlit), chatbot with conversation history, template save/load (JSON)

## Project structure

```
LangChainModels/
├── EmbeddedModels/
│   ├── 1.embedding_openAI.py          # OpenAI embeddings (query + documents)
│   ├── 2.embedding_huggingFaceLocal.py # Local Hugging Face embeddings
│   └── documentSimilarityApp.py       # Semantic search demo (query → embeddings → similarity → result)
├── ChatModels/
│   ├── 1.chatModel_openAI.py          # OpenAI chat (single invoke)
│   ├── 2.chatModel_huggingFace.py     # Hugging Face chat (cloud)
│   └── 3.chatModel_huggingFaceLocal.py # Hugging Face chat (local)
├── LLMS/
│   └── 1.llm_Demo.py                  # OpenAI LLM (e.g. gpt-3.5-turbo-instruct)
├── Prompts/
│   ├── 1.prompts_UI.py                # Research Tool – Streamlit UI + PromptTemplate (paper, style, length)
│   ├── chatbot.py                     # CLI chatbot with conversation history (HumanMessage/AIMessage/SystemMessage)
│   ├── messages.py                    # Simple message list demo (System + Human → invoke → AIMessage)
│   └── promptGenerator.py             # PromptTemplate for research summary, saves to template.json
├── template.json                      # Saved prompt template (from promptGenerator)
├── requirements.txt
├── .env                                # OPENAI_API_KEY (and optional HF keys)
└── README.md
```

## Setup

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/YOUR_USERNAME/LangChainModels.git
   cd LangChainModels
   pip install -r requirements.txt
   ```

2. **Environment**

   Create a `.env` in the project root:

   ```
   OPENAI_API_KEY=your_key_here
   ```

   For Hugging Face cloud models, add `HUGGINGFACEHUB_API_TOKEN` if needed.

3. **Run examples**

   - **Semantic search (documents + query):**
     ```bash
     python EmbeddedModels/documentSimilarityApp.py
     ```

   - **Research Tool (Streamlit UI):**
     ```bash
     streamlit run Prompts/1.prompts_UI.py
     ```

   - **CLI chatbot (conversation loop, type `exit` to quit):**
     ```bash
     python Prompts/chatbot.py
     ```

   - **Simple messages demo:**
     ```bash
     python Prompts/messages.py
     ```

   - **Save prompt template to JSON:**
     ```bash
     python Prompts/promptGenerator.py
     ```

   - **OpenAI chat (single question):**
     ```bash
     python ChatModels/1.chatModel_openAI.py
     ```

   - **OpenAI LLM:**
     ```bash
     python LLMS/1.llm_Demo.py
     ```

   - **OpenAI embeddings:**
     ```bash
     python EmbeddedModels/1.embedding_openAI.py
     ```

   - **Local Hugging Face embeddings:**
     ```bash
     python EmbeddedModels/2.embedding_huggingFaceLocal.py
     ```

## Tech stack

- **LangChain** (core, OpenAI, Hugging Face)
- **Streamlit** (Research Tool UI)
- **python-dotenv** (environment variables)
- **scikit-learn** (cosine similarity)
- **Python 3.x**

## License

MIT
