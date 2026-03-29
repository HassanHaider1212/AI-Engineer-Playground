from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnableSequence, RunnableParallel, RunnablePassthrough, RunnableBranch
from dotenv import load_dotenv

from Runnables.runnableParallel import prompt1, prompt2

load_dotenv()

model = ChatOpenAI()
parser = StrOutputParser()

# We will ask for a topic
# Topic -> prompt -> llm -> parse -> Branch -> if(len(text) > 500) -> yes summarize again  -> else -> final output

prompt1 = PromptTemplate(
    template = "Write a detailed report on {topic}",
    input_variables = ['topic']
)

prompt2 = PromptTemplate(
    template = "Summarize the following text: {text}",
    input_variables = ['text']
)

report_genChain = RunnableSequence(prompt1, model, parser)

branch = RunnableBranch(
    ((lambda x: len(x.split(" ")) > 500), RunnableSequence(prompt2, model, parser)),
    RunnablePassthrough()
)

final_chain = RunnableSequence(report_genChain, branch)
print(final_chain.invoke({"topic": "India VS Pakistan"}))
