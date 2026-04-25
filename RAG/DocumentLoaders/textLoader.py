from langchain_community.document_loaders import TextLoader

loader = TextLoader('RAG/DocumentLoaders/Poem.txt', encoding='utf-8')
documents = loader.load()
print(documents)

print(type(documents))
print(len(documents))