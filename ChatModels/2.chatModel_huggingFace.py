from langchain_huggingface import ChatHuggingFace, HuggingFaceEndpoint
from dotenv import load_dotenv

load_dotenv()

llm = HuggingFaceEndpoint(
    repo_id="zai-org/GLM-5",
    task="text-generation"
)

chat_model = ChatHuggingFace(llm=llm)

result = chat_model.invoke("What is the capital of Pakistan?")
print(result)