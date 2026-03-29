from langchain_openai import ChatOpenAI
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnableLambda, RunnableSequence, RunnableParallel, RunnablePassthrough
from dotenv import load_dotenv

load_dotenv()
#concept: We can convert any python function into a runnable using Runnablelambda
# def word_counter(sentence):
#     return len(sentence.split(" "))

# runnable_wordCounter = RunnableLambda(word_counter)
# print(runnable_wordCounter.invoke("Hello World"))

model = ChatOpenAI()
parser = StrOutputParser()

prompt = PromptTemplate(
    template = "Write a joke about {topic}",
    input_variables= ['topic']
)

joke_gen_chain = RunnableSequence(prompt, model, parser)
parallel_chain = RunnableParallel({
    'joke': RunnablePassthrough(),
    'word_count': RunnableLambda(lambda x: len(x.split(" ")))
})

final_chain = RunnableSequence(joke_gen_chain, parallel_chain)
result = final_chain.invoke({"topic": "AI"})
finalResult = """{} \n Word Count: {}""".format(result['joke'], result['word_count'])
print(finalResult)  
