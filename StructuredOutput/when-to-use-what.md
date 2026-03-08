# When to use what?

Use this guide to choose between **TypedDict**, **Pydantic**, and **JSON Schema** for defining data structures (e.g. for structured outputs from LLMs).

---

## Use TypedDict if:

- You only need type hints for basic structure enforcement.
- You do not need data validation (e.g., checking if numbers are positive).
- You trust the Language Model (LLM) to return correct data.

---

## Use Pydantic if:

- You need data validation (e.g., sentiment must be "positive", "neutral", or "negative").
- You need to provide default values if the LLM misses fields.
- You want automatic type conversion (e.g., converting the string "100" to the integer 100).

---

## Use JSON Schema if:

- You do not want to import extra Python libraries, specifically Pydantic.
- You need validation for your data but do not require Python objects.
- You want to define the data structure in a standard JSON format.

---

## Feature comparison

| Feature                    | TypedDict | Pydantic | JSON Schema |
| -------------------------- | --------- | -------- | ----------- |
| Basic structure            | ✔         | ✔        | ✔           |
| Type enforcement           | ✔         | ✔        | ✔           |
| Data validation            | ✗         | ✔        | ✔           |
| Default values             | ✗         | ✔        | ✗           |
| Automatic conversion       | ✗         | ✔        | ✗           |
| Cross-language compatibility | ✗       | ✗        | ✔           |
