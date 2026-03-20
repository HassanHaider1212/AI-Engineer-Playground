from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
#from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.prompts import PromptTemplate

load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="deepseek-ai/DeepSeek-V3.2", #By default, this model does not give structured output.
    task="text-generation"
)

model = ChatHuggingFace(llm=llm)
#model = ChatOpenAI()

#1st prompt template -> Detailed Report
template1 = PromptTemplate(
    template = 'Write a detailed report on {topic}',
    input_variables=["topic"]
)

#2nd prompt template -> Summary
template2 = PromptTemplate(
    template = 'Write a 5 line summary on the following text. /n {text}',
    input_variables=["text"]
)

prompt1 = template1.invoke({"topic": "black hole"})
result1 = model.invoke(prompt1)

prompt2 = template2.invoke({"text": result1.content})
result2 = model.invoke(prompt2)

print(result2.content)

