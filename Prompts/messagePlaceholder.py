from langchain_core.prompts import messagePlaceholder, ChatPromptTemplate

#chat template
ch
chat_template = ChatPromptTemplate([
    ("system", "You are a helpful customer support agent"),
    messagePlaceholder(variable_name="chat_history"),
    ("human", "{query}")
])
#load chat history
chat_history = []
with open("chatHistory.txt", "r") as file:
    chat_history.extend(file.readlines())

#create prompt
prompt = chat_template.invoke({
    "chat_history": chat_history,
    "query": "where is my refund? "
})

print(prompt)
