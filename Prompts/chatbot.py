from langchain_openai import ChatOpenAI
from dotenv import load_dotenv
from langchain_core.messages import HumanMessage, AIMessage, SystemMessage

load_dotenv()

model = ChatOpenAI()

conversation_history = [
    SystemMessage(content="You are a helpful assistant that can answer questions and help with tasks."),
]

while True:
    user_input = input("You: ")
    conversation_history.append(HumanMessage(content=user_input))
    if user_input.lower() == "exit":
        break
    result = model.invoke(conversation_history)
    conversation_history.append(AIMessage(content=result.content))
    print("Bot: ", result.content)

print(conversation_history)
