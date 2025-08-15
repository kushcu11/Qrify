'use server';
/**
 * @fileOverview This file defines a Genkit flow for validating the safety and legitimacy of redirect URLs.
 *
 * validateRedirectURL - A function that validates a redirect URL.
 * ValidateRedirectURLInput - The input type for the validateRedirectURL function.
 * ValidateRedirectURLOutput - The return type for the validateRedirectURL function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ValidateRedirectURLInputSchema = z.object({
  url: z.string().url().describe('The URL to validate.'),
});
export type ValidateRedirectURLInput = z.infer<typeof ValidateRedirectURLInputSchema>;

const ValidateRedirectURLOutputSchema = z.object({
  isValid: z.boolean().describe('Whether the URL is safe and legitimate.'),
  reason: z.string().optional().describe('The reason why the URL is invalid, if applicable.'),
});
export type ValidateRedirectURLOutput = z.infer<typeof ValidateRedirectURLOutputSchema>;

export async function validateRedirectURL(input: ValidateRedirectURLInput): Promise<ValidateRedirectURLOutput> {
  return validateRedirectURLFlow(input);
}

const prompt = ai.definePrompt({
  name: 'validateRedirectURLPrompt',
  input: {schema: ValidateRedirectURLInputSchema},
  output: {schema: ValidateRedirectURLOutputSchema},
  prompt: `You are a security expert specializing in identifying malicious URLs.

You will receive a URL and must determine if it is safe and legitimate. Consider factors such as the domain's reputation, the URL's structure, and any potential phishing attempts.

If the URL is deemed unsafe or illegitimate, explain the reason why in the reason field. Always provide a reason if isValid is false.

URL: {{{url}}}`,
});

const validateRedirectURLFlow = ai.defineFlow(
  {
    name: 'validateRedirectURLFlow',
    inputSchema: ValidateRedirectURLInputSchema,
    outputSchema: ValidateRedirectURLOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
