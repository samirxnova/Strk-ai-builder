import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

export function buildResolverAgent() {
  // Improved system message with more specific instructions
  const systemMsg = `
    Your task is to resolve compiler errors in the provided smart contract code.
    - Only address the part of the code causing the compiler error.
    - Ensure the final output is valid code that compiles without any additional explanations or conversational text.
    - Do not modify any part of the code that is unrelated to fixing the compiler error.
    - Return the full code, including the unmodified parts, with the error resolved.
  `;

  // Clear question prompt with focus on compiler error and full code resolution
  const question = `
    Resolve the following compiler error: "{compilerError}"
    From the provided smart contract code: 
    {code}
  `;

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(question),
    ],
    inputVariables: ['code', 'compilerError'],
  });

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-1106-preview',
    temperature: 0.2,  // Lower temperature for more deterministic output
    max_tokens: 1500,  // Max tokens to ensure full code is returned
    modelKwargs: { seed: 1337 },
  });

  // Return the prompt piped to the LLM with a StringOutputParser to handle structured output
  return prompt.pipe(llm).pipe(new StringOutputParser());
}
