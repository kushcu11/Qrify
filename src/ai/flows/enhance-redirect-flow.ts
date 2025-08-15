'use server';

/**
 * @fileOverview An AI agent that enhances a redirect URL based on user input.
 *
 * - enhanceRedirectURL - A function that enhances the redirect URL.
 * - EnhanceRedirectURLInput - The input type for the enhanceRedirectURL function.
 * - EnhanceRedirectURLOutput - The return type for the enhanceRedirectURL function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const EnhanceRedirectURLInputSchema = z.object({
  userInput: z
    .string()
    .describe(
      'A keyword or phrase that the user wants to be redirected to. For example: Firebase Documentation.'
    ),
});
export type EnhanceRedirectURLInput = z.infer<typeof EnhanceRedirectURLInputSchema>;

const EnhanceRedirectURLOutputSchema = z.object({
  enhancedURL: z.string().url().describe('The enhanced and validated URL to redirect to.'),
});
export type EnhanceRedirectURLOutput = z.infer<typeof EnhanceRedirectURLOutputSchema>;

export async function enhanceRedirectURL(input: EnhanceRedirectURLInput): Promise<EnhanceRedirectURLOutput> {
  return enhanceRedirectURLFlow(input);
}

const prompt = ai.definePrompt({
  name: 'enhanceRedirectURLPrompt',
  input: {schema: EnhanceRedirectURLInputSchema},
  output: {schema: EnhanceRedirectURLOutputSchema},
  prompt: `You are an expert at finding the most relevant official URL for a given user input.\n\nUser Input: {{{userInput}}}\n\nBased on the user input, identify the most relevant official URL and return it. The URL should be a functional website.\nEnsure that the URL is a valid URL, and the 'enhancedURL' field contains the valid URL.`,
});

const enhanceRedirectURLFlow = ai.defineFlow(
  {
    name: 'enhanceRedirectURLFlow',
    inputSchema: EnhanceRedirectURLInputSchema,
    outputSchema: EnhanceRedirectURLOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
