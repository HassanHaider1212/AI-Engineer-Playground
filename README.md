# LangChain Models & Semantic Search

A semantic search pipeline built with **LangChain**, embedding models, and cosine similarity for retrieval. Supports both cloud (OpenAI) and local (Hugging Face) embeddings.

## Features

- **Document & query embedding** with configurable models
- **Cosine similarity** for ranking and retrieval
- **OpenAI** (`text-embedding-3-large`) and **Hugging Face** (sentence-transformers) support
- Clear separation of embedding, indexing, and retrieval steps

## Project structure

```
LangChainModels/
├── EmbeddedModels/
│   ├── documentSimilarityApp.py   # Semantic search demo (query → embeddings → similarity → result)
│   └── 2.embedding_huggingFaceLocal.py   # Local Hugging Face embeddings
├── requirements.txt
└── README.md
```

## Setup

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/YOUR_USERNAME/LangChainModels.git
   cd LangChainModels
   pip install -r requirements.txt
   ```

2. **Environment (for OpenAI embedding)**

   Create a `.env` in the project root:

   ```
   OPENAI_API_KEY=your_key_here
   ```

3. **Run the semantic search demo**

   ```bash
   python EmbeddedModels/documentSimilarityApp.py
   ```

   Example output: given a query (e.g. "What is the capital of Pakistan?"), the script returns the most similar document and its similarity score.

## Tech stack

- **LangChain** (core, OpenAI, Hugging Face)
- **scikit-learn** (cosine similarity)
- **Python 3.x**

## License

MIT
