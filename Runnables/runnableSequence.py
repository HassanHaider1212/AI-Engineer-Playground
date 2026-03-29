from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableSequence
from dotenv import load_dotenv

load_dotenv()

prompt1 = PromptTemplate(
    input_variables=["topic"],
    template="""Write a joke about: {topic}""",
)

prompt2 = PromptTemplate(
    input_variables=["joke"],
    template="""Explain the joke in simple words: {joke}""",
)

model = ChatOpenAI()
parser = StrOutputParser()

chain = RunnableSequence(prompt1, model, parser, prompt2, model, parser)

print(chain.invoke("AI"))
