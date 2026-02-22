from langchain_huggingface import HuggingFaceEmbeddings

embedding = HuggingFaceEmbeddings(model_name='sentence-transformers/all-MiniLM-L6-v2')

#single sentence
text = "Islamabad is the capital of pakistan"
vector = embedding.embed_query(text)
print(str(vector))

#document query
document = ["Islamabad is the capital of pakistan", "Dehli is the capital of india", "Karachi is the city of pakistan"]
vectors = embedding.embed_documents(document)
print(str(vectors))
