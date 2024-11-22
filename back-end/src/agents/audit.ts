import { ChatPromptTemplate, HumanMessagePromptTemplate, SystemMessagePromptTemplate } from '@langchain/core/prompts';
import { z } from 'zod';

import { jsonAgent } from './json';

// Define a stricter schema to ensure better quality JSON output
export const auditJsonSchema = z.object({
  audits: z
    .array(
      z.object({
        title: z
          .string()
          .min(10, "Title must be at least 10 characters long") // Enforce descriptive titles
          .describe("Short description of the issue. Example: 'Reentrancy attack in withdraw function'"),
        severity: z
          .enum(['High', 'Medium', 'Low'])
          .describe('Severity of the issue (e.g., High, Medium, Low)'),
        description: z
          .string()
          .min(20, "Description must be at least 20 characters long") // Ensure detailed explanations
          .describe('Detailed explanation of the issue, including its impact and causes'),
      }),
    )
    .nonempty("Audits list cannot be empty") // Enforce at least one issue if provided
    .describe('List of issues found in the smart contract'),
});

export function auditorAgent() {
  // Improved system message for better clarity
  const systemMsg = `
    You are an AI auditor specializing in smart contract analysis. Your job is to identify and assess vulnerabilities in the provided code.
    Each vulnerability should include:
    - A short, clear title summarizing the issue.
    - A severity classification (High, Medium, Low).
    - A detailed description explaining the vulnerability, its impact, and possible causes.

    Avoid reporting common overflow/underflow issues, as they are out of scope.  
    If no vulnerabilities are found, return: { "audits": [] }.  
    Your report must strictly adhere to the provided JSON schema.
  `;

  // Improved user message with structured guidelines
  const userMsg = `
    Analyze the following Cairo smart contract code and generate an audit report. For each identified issue:
    - Summarize the issue in a clear title.
    - Classify its severity (High, Medium, Low).
    - Provide a detailed description of the vulnerability, including its potential impact and causes.

    If no vulnerabilities are found, respond with: { "audits": [] }.
    Adhere strictly to the JSON schema provided.
    Code: {code}
  `;

  // Create the prompt template with clearer instructions
  const prompt = new ChatPromptTemplate({
    promptMessages: [
      SystemMessagePromptTemplate.fromTemplate(systemMsg),
      HumanMessagePromptTemplate.fromTemplate(userMsg),
    ],
    inputVariables: ['code'],
  });

  // Return the prompt piped with the JSON agent
  return prompt.pipe(jsonAgent('gpt-4-1106-preview', auditJsonSchema));
}
