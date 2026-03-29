from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnableSequence
from dotenv import load_dotenv

load_dotenv()

prompt1 = PromptTemplate(
    input_variables=["topic"],
    template="""Write a tweet about: {topic}""",
)
prompt2 = PromptTemplate(
    input_variables=["topic"],
    template="""Write a linkedin post about: {topic}""",
)

model = ChatOpenAI()
parser = StrOutputParser()


runnableParallel =  RunnableParallel ({
    'tweet': RunnableSequence(prompt1, model, parser),
    'linkedin': RunnableSequence(prompt2, model, parser),
})

result = runnableParallel.invoke({"topic": "AI"})
print(result)
