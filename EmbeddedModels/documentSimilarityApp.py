from langchain_core import embeddings
from langchain_openai import OpenAIEmbeddings
from dotenv import load_dotenv
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

load_dotenv()

embeddings = OpenAIEmbeddings(model="text-embedding-3-large", dimensions=300)

documents = [
    "The capital of Pakistan is Islamabad",
    "The capital of China is Beijing",
    "The capital of France is Paris",
    "The capital of Germany is Berlin",
    "The capital of Italy is Rome",
    "The capital of Spain is Madrid"
]

user_query = "What is the capital of Pakistan?"

#Here drawback is we are not storing embedding in the vector database. Asking our model to embed the documents again and again which is a costly operation.
document_embeddings = embeddings.embed_documents(documents)
# This is the user query embedding. We retrieve the embedding for the user query and get similarity score known as retrival process.
user_embedding = embeddings.embed_query(user_query)

scores = cosine_similarity([user_embedding], document_embeddings)[0]
#print(scores[0])
result = sorted(list(enumerate(scores)), key=lambda x: x[1])
index, score = result[-1]

print(user_query)
print(f"The most similar document is: {documents[index]}.\nThe similarity score is: {score}")

# We basically did semantic similarity search here.
#--------------------------------------------------------
# We can also do vector search by using the vector store.
# We can also do fuzzy search by using the fuzzy store.
# We can also do hybrid search by using the hybrid store.
# We can also do multi-modal search by using the multi-modal store.
# We can also do multi-modal search by using the multi-modal store.