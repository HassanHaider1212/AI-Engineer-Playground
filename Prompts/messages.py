from langchain_core.messages import HumanMessage, AIMessage, SystemMessage
from langchain_openai import ChatOpenAI
from dotenv import load_dotenv


load_dotenv()
model = ChatOpenAI()

messages = [
    SystemMessage(content="You are a helpful assistant that can answer questions and help with tasks."),
    HumanMessage(content="What is the capital of Pakistan?")
]

result = model.invoke(messages)
messages.append(AIMessage(content=result.content))
print(messages)