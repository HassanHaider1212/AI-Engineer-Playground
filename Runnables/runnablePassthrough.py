from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableParallel, RunnablePassthrough, RunnableSequence
from dotenv import load_dotenv

#concept
# passthrough = RunnablePassthrough()
# print(passthrough.invoke({"name" : "Hassan"}))

#example
load_dotenv()
model = ChatOpenAI()
parser = StrOutputParser()

prompt1 = PromptTemplate(
    template = "Write a joke about {topic}",
    input_variables= ['topic']
)

prompt2 = PromptTemplate(
    template = "Explain the following joke - {text}",
    input_variables= ['text']
)

jokeGenChain = runnableSequence(prompt1, model, parser)
parallelChain = RunnableParallel({
    'joke': RunnablePassthrough(),
    'explanation': RunnableSequence(prompt2, model, parser)
})

finalChain = RunnableSequence(jokeGenChain, parallelChain)

print(finalChain.invoke({"topic" : "AI"}))
