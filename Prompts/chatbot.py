from langchain_openai import ChatOpenAI
from dotenv import load_dotenv

load_dotenv()

model = ChatOpenAI()

conversation_history = []

while True:
    user_input = input("You: ")
    conversation_history.append(user_input)
    if user_input.lower() == "exit":
        break
    result = model.invoke(conversation_history)
    conversation_history.append(result.content)
    print("Bot: ", result.content)

print(conversation_history)

#now, issue is which message is from user and which message is from bot. maintain in a dictionary.