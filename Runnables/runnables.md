# Runnables in LangChain

## Overview
Runnables are the core execution abstraction in LangChain.  
Each runnable takes an input, performs work, and returns an output.  
They can be composed into deterministic pipelines, parallel fan-out graphs, and conditional flows.

## Primitive Runnables (Building Blocks)
These are low-level composition primitives used to build workflow structure.

### 1. `RunnableSequence`
- **What it does**: Runs steps one after another.
- **Input -> Output**: Output of step N becomes input of step N+1.
- **Best for**: Linear pipelines (prompt -> model -> parser).

### 2. `RunnableParallel`
- **What it does**: Runs multiple branches at the same time on the same input.
- **Input -> Output**: Shared input -> `dict` of branch outputs.
- **Best for**: Fan-out tasks (summarize + sentiment + keywords together).

### 3. `RunnableLambda`
- **What it does**: Wraps custom Python logic as a runnable.
- **Input -> Output**: Any -> Any (depends on your function).
- **Best for**: Lightweight transformations and glue logic.

### 4. `RunnablePassthrough`
- **What it does**: Keeps original input unchanged, optionally adding derived fields.
- **Input -> Output**: Same input shape (optionally enriched).
- **Best for**: Preserving context while computing extra values.

### 5. `RunnableBranch`
- **What it does**: Chooses one branch based on conditions.
- **Input -> Output**: Input routed to selected branch output.
- **Best for**: Conditional execution and routing.

## Diff: How Primitive Runnables Differ

| Runnable | Execution Style | Output Shape | Typical Role |
|---|---|---|---|
| `RunnableSequence` | Sequential | Single transformed value | Pipeline chaining |
| `RunnableParallel` | Concurrent branches | `dict` of branch results | Fan-out aggregation |
| `RunnableLambda` | Function call | Any | Custom transformation |
| `RunnablePassthrough` | Pass-through + optional enrich | Usually same as input | Preserve context |
| `RunnableBranch` | Conditional single-path | Selected branch output | Routing/decisioning |

## Task-Specific Runnables vs Primitive Runnables

### Primitive Runnables (what you have done)
- Focus on **control flow and composition**.
- They define **how** data moves through the graph.
- Examples: `RunnableSequence`, `RunnableParallel`, `RunnableBranch`.

### Task-Specific Runnables
- Focus on **domain/task behavior** such as prompting, model calls, parsing, retrieval, or tools.
- They define **what** task is being done at each step.
- Examples:
  - Prompting: `PromptTemplate` / `ChatPromptTemplate` used as runnable steps.
  - Model invocation: chat/LLM model runnables.
  - Output parsing: `StrOutputParser`, `JsonOutputParser`, `PydanticOutputParser`.
  - Tool/retrieval steps: retrievers and tool-calling components.

### Practical View
- Use **primitive runnables** to orchestrate the workflow skeleton.
- Plug in **task-specific runnables** to perform actual NLP/application work inside that skeleton.
- Common pattern:  
  `PromptTemplate -> Model -> OutputParser`, wrapped inside `RunnableSequence`, with `RunnableParallel` or `RunnableBranch` when needed.

## Conclusion
Think of primitive runnables as the workflow engine and task-specific runnables as the business logic modules.  
Together they give you composable, testable, and reusable LangChain pipelines.
