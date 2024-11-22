import { StringOutputParser } from '@langchain/core/output_parsers';
import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { ChatOpenAI } from '@langchain/openai';

export function cairoGeneratorAgent() {
  // Improved system message to emphasize code-only response
  const systemMsg = `
    Your task is to generate complete Cairo smart contract code for Starknet blockchain based on the provided user request.
    - Focus solely on generating valid code without any explanatory or conversational text.
    - Do not include placeholder comments or non-essential text.
    - Strictly follow the syntax of the Cairo language as per the provided documentation and example.
  `;

  // Clarified user prompt to ensure the AI understands it should apply the customization directly to the example
  const userMsg = `
    Cairo Language Documentation: {docs}
    Template example: {example}
    
    Request: Based on the provided example, apply the following customization: "{customization}"
    Your output must strictly follow the Cairo language syntax, and only the required code should be provided.
  `;

  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(userMsg),
    ],
    inputVariables: ['docs', 'example', 'customization'],
  });

  const llm = new ChatOpenAI({
    openAIApiKey: process.env.OPENAI_API_KEY,
    modelName: 'gpt-4-1106-preview',
    temperature: 0.2, // Set lower temperature for deterministic and consistent code output
    max_tokens: 1500, // Allow space for generating full smart contract code
    modelKwargs: { seed: 1337 },
    verbose: false, // Set to false to avoid verbose output
  });

  // Return the prompt processed by the LLM and output parsed strictly for code
  return prompt.pipe(llm).pipe(new StringOutputParser());
}
