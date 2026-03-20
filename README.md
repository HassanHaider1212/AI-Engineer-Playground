# LangChain Models & Semantic Search

A LangChain-based project covering **embeddings**, **chat models**, **LLMs**, **prompts**, and **structured outputs**. Includes semantic search with cosine similarity, Streamlit UIs, conversation demos, and LLM response shaping via TypedDict, Pydantic, and JSON Schema. Supports OpenAI and Hugging Face (cloud and local).

## Features

- **Embeddings**: OpenAI (`text-embedding-3-large`) and Hugging Face (sentence-transformers) for documents and queries
- **Semantic search**: Cosine similarity for ranking and retrieval
- **Chat models**: OpenAI and Hugging Face chat with message-based APIs
- **LLMs**: Direct LLM invocation (e.g. OpenAI `gpt-3.5-turbo-instruct`)
- **Prompts**: `PromptTemplate`, research-paper summarizer UI (Streamlit), chatbot with conversation history, template save/load (JSON)
- **Structured outputs**: TypedDict, Pydantic, and JSON Schema for type-safe, validated LLM responses — [when-to-use-what guide](StructuredOutput/when-to-use-what.md) with criteria and feature comparison table
- **Output parsers**: `StrOutputParser`, `JsonOutputParser`, and `PydanticOutputParser` demos with direct invoke and LCEL chaining

## Project structure

```
LangChainModels/
├── EmbeddedModels/
│   ├── 1.embedding_openAI.py          # OpenAI embeddings (query + documents)
│   ├── 2.embedding_huggingFaceLocal.py # Local Hugging Face embeddings
│   └── documentSimilarityApp.py       # Semantic search demo (query → embeddings → similarity → result)
├── ChatModels/
│   ├── 1.chatModel_openAI.py          # OpenAI chat (single invoke)
│   ├── 2.chatModel_huggingFace.py     # Hugging Face chat (cloud)
│   └── 3.chatModel_huggingFaceLocal.py # Hugging Face chat (local)
├── LLMS/
│   └── 1.llm_Demo.py                  # OpenAI LLM (e.g. gpt-3.5-turbo-instruct)
├── Prompts/
│   ├── 1.prompts_UI.py                # Research Tool – Streamlit UI + PromptTemplate (paper, style, length)
│   ├── chatbot.py                     # CLI chatbot with conversation history (HumanMessage/AIMessage/SystemMessage)
│   ├── messages.py                    # Simple message list demo (System + Human → invoke → AIMessage)
│   └── promptGenerator.py             # PromptTemplate for research summary, saves to template.json
├── OutputParsers/
│   ├── strOutputParser.py             # Manual two-step prompting with chat model responses
│   ├── strOutputParser_Chain.py       # LCEL chain with StrOutputParser for plain string outputs
│   ├── jsonOutputParser.py            # JsonOutputParser demo (+ chaining)
│   └── pydanticOutputParser.py        # PydanticOutputParser demo (+ schema validation + chaining)
├── StructuredOutput/
│   ├── when-to-use-what.md            # When to use TypedDict / Pydantic / JSON Schema + feature table
│   ├── structuredOutput_typeDict.py   # Structured output with TypedDict (type hints only)
│   ├── structuredOutput_Pydantic.py   # Structured output with Pydantic (validation, defaults, conversion)
│   ├── structuredOutput_JsonSchema.py # Structured output with JSON Schema (no Pydantic, cross-language)
│   ├── jsonSchema.json                # JSON Schema definition (used by structuredOutput_JsonSchema.py)
│   ├── pydanticDemo.py                # Minimal Pydantic + dict unpacking demo
│   └── typeDictDemo.py                # Minimal TypedDict demo
├── template.json                      # Saved prompt template (from promptGenerator)
├── requirements.txt
├── .env                                # OPENAI_API_KEY (and optional HF keys)
└── README.md
```

## Setup

1. **Clone and install dependencies**

   ```bash
   git clone https://github.com/YOUR_USERNAME/LangChainModels.git
   cd LangChainModels
   pip install -r requirements.txt
   ```

2. **Environment**

   Create a `.env` in the project root:

   ```
   OPENAI_API_KEY=your_key_here
   ```

   For Hugging Face cloud models, add `HUGGINGFACEHUB_API_TOKEN` if needed.

3. **Run examples**

   - **Semantic search (documents + query):**
     ```bash
     python EmbeddedModels/documentSimilarityApp.py
     ```

   - **Research Tool (Streamlit UI):**
     ```bash
     streamlit run Prompts/1.prompts_UI.py
     ```

   - **CLI chatbot (conversation loop, type `exit` to quit):**
     ```bash
     python Prompts/chatbot.py
     ```

   - **Simple messages demo:**
     ```bash
     python Prompts/messages.py
     ```

   - **Save prompt template to JSON:**
     ```bash
     python Prompts/promptGenerator.py
     ```

   - **OpenAI chat (single question):**
     ```bash
     python ChatModels/1.chatModel_openAI.py
     ```

   - **OpenAI LLM:**
     ```bash
     python LLMS/1.llm_Demo.py
     ```

   - **OpenAI embeddings:**
     ```bash
     python EmbeddedModels/1.embedding_openAI.py
     ```

   - **Local Hugging Face embeddings:**
     ```bash
     python EmbeddedModels/2.embedding_huggingFaceLocal.py
     ```

   - **Structured output (TypedDict):**
     ```bash
     python StructuredOutput/structuredOutput_typeDict.py
     ```

   - **Structured output (Pydantic):**
     ```bash
     python StructuredOutput/structuredOutput_Pydantic.py
     ```

   - **Structured output (JSON Schema):**
     ```bash
     python StructuredOutput/structuredOutput_JsonSchema.py
     ```
     Run from project root so `StructuredOutput/jsonSchema.json` is found.

   - **Minimal demos (Pydantic / TypedDict):**
     ```bash
     python StructuredOutput/pydanticDemo.py
     python StructuredOutput/typeDictDemo.py
     ```

   - **Output parser demos:**
     ```bash
     python OutputParsers/strOutputParser.py
     python OutputParsers/strOutputParser_Chain.py
     python OutputParsers/jsonOutputParser.py
     python OutputParsers/pydanticOutputParser.py
     ```
    
   - **Activate virtual environment:**
    ```bash
    D:\LangChain\LangChainModels\venv\Scripts\Activate.ps1
    ```

## Structured output (LLM response shaping)

This project implements **three ways** to get type-safe, structured data from LLM responses in LangChain: **TypedDict**, **Pydantic**, and **JSON Schema**. Each is demonstrated with runnable scripts and minimal demos.

| Approach       | Use when |
| -------------- | -------- |
| **TypedDict**  | You only need type hints and trust the LLM output. No extra deps. |
| **Pydantic**   | You need validation, defaults, and automatic type conversion. |
| **JSON Schema** | You want validation without Pydantic, or a portable JSON spec (e.g. cross-language). |

**Guide:** [StructuredOutput/when-to-use-what.md](StructuredOutput/when-to-use-what.md) — "When to use what?" criteria and a feature comparison table (basic structure, type enforcement, data validation, default values, automatic conversion, cross-language compatibility).

## Output parsers (LangChain)

This project also shows parser-first response handling with LangChain output parsers:

| Parser | What it returns | Best for |
| ------ | --------------- | -------- |
| **StrOutputParser** | plain string | Simple text pipelines and step-by-step summarization flows |
| **JsonOutputParser** | Python `dict`/JSON | Structured JSON output without strict schema validation |
| **PydanticOutputParser** | Pydantic object | Strict schema enforcement and field-level validation |

Note: In newer LangChain versions, use parser imports from `langchain_core.output_parsers`.

## Tech stack

- **LangChain** (core, OpenAI, Hugging Face)
- **Streamlit** (Research Tool UI)
- **Pydantic** (structured output validation, used in StructuredOutput)
- **python-dotenv** (environment variables)
- **scikit-learn** (cosine similarity)
- **Python 3.x**

## License

MIT
