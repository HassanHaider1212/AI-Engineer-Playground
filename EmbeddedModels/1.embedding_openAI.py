from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv

load_dotenv()


embedding = OpenAIEmbeddings(model="text-embedding-3-large", dimensions=32)

# single sentence
result = embedding.embed_query("Islamabad is the capital of pakistan")
print(str(result))

# document
document = ["Islamabad is the capital of pakistan", "Dehli is the capital of india", "Karachi is the city of pakistan"]
results = embedding.embed_documents(document)
print(str(results))