'use server';
/**
 * @fileOverview This file defines a Genkit flow for suggesting a unique QR code style based on the URL.
 *
 * It exports:
 * - `suggestQrCodeStyle`: An async function that takes a URL as input and returns a QR code style suggestion.
 * - `SuggestQrCodeStyleInput`: The input type for the suggestQrCodeStyle function.
 * - `SuggestQrCodeStyleOutput`: The output type for the suggestQrCodeStyle function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SuggestQrCodeStyleInputSchema = z.object({
  url: z.string().url().describe('The URL to be encoded in the QR code.'),
});
export type SuggestQrCodeStyleInput = z.infer<typeof SuggestQrCodeStyleInputSchema>;

const SuggestQrCodeStyleOutputSchema = z.object({
  styleSuggestion: z.string().describe('A suggestion for a unique QR code style based on the URL.'),
});
export type SuggestQrCodeStyleOutput = z.infer<typeof SuggestQrCodeStyleOutputSchema>;

export async function suggestQrCodeStyle(input: SuggestQrCodeStyleInput): Promise<SuggestQrCodeStyleOutput> {
  return suggestQrCodeStyleFlow(input);
}

const prompt = ai.definePrompt({
  name: 'suggestQrCodeStylePrompt',
  input: {schema: SuggestQrCodeStyleInputSchema},
  output: {schema: SuggestQrCodeStyleOutputSchema},
  prompt: `You are an expert in QR code design.

  Based on the URL provided, suggest a unique QR code style that is visually relevant and engaging. The style suggestion should be a concise description of the desired aesthetic.

  URL: {{{url}}}

  Style Suggestion:`,
});

const suggestQrCodeStyleFlow = ai.defineFlow(
  {
    name: 'suggestQrCodeStyleFlow',
    inputSchema: SuggestQrCodeStyleInputSchema,
    outputSchema: SuggestQrCodeStyleOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
