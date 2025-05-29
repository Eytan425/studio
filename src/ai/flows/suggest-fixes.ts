// use server'
'use server';
/**
 * @fileOverview A code improvement AI agent.
 *
 * - suggestFixes - A function that handles the code improvement process.
 * - SuggestFixesInput - The input type for the suggestFixes function.
 * - SuggestFixesOutput - The return type for the suggestFixes function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestFixesInputSchema = z.object({
  code: z
    .string()
    .describe("The user's code snippet that needs improvement."),
  language: z.string().describe('The programming language of the code.'),
  errors: z.string().optional().describe('The errors found in the code.'),
});
export type SuggestFixesInput = z.infer<typeof SuggestFixesInputSchema>;

const SuggestFixesOutputSchema = z.object({
  improvedCode: z.string().describe('The improved code with suggestions.'),
  suggestions: z
    .array(z.string())
    .describe('The array of suggestions to fix the code.'),
});
export type SuggestFixesOutput = z.infer<typeof SuggestFixesOutputSchema>;

export async function suggestFixes(input: SuggestFixesInput): Promise<SuggestFixesOutput> {
  return suggestFixesFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestFixesPrompt',
  input: {schema: SuggestFixesInputSchema},
  output: {schema: SuggestFixesOutputSchema},
  prompt: `You are an expert software developer specializing in debugging and improving code.

You will use this information to improve the code, and suggest fixes. You will provide the improved code and an array of suggestions that explains the changes made.

Use the following as the primary source of information about the code.

Language: {{{language}}}
Code: {{{code}}}
Errors: {{{errors}}}

Respond with the improved code and suggestions array.`,
});

const suggestFixesFlow = ai.defineFlow(
  {
    name: 'suggestFixesFlow',
    inputSchema: SuggestFixesInputSchema,
    outputSchema: SuggestFixesOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
