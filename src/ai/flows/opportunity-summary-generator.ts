'use server';
/**
 * @fileOverview An AI agent that generates concise summaries of sales opportunities.
 *
 * - generateOpportunitySummary - A function that generates a summary of an opportunity based on activity notes.
 * - OpportunitySummaryInput - The input type for the generateOpportunitySummary function.
 * - OpportunitySummaryOutput - The return type for the generateOpportunitySummary function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const OpportunitySummaryInputSchema = z.object({
  activityNotes: z
    .array(z.string())
    .describe('A list of activity notes related to an opportunity.'),
});
export type OpportunitySummaryInput = z.infer<typeof OpportunitySummaryInputSchema>;

const OpportunitySummaryOutputSchema = z.object({
  summary: z.string().describe('A concise summary of the opportunity.'),
});
export type OpportunitySummaryOutput = z.infer<typeof OpportunitySummaryOutputSchema>;

export async function generateOpportunitySummary(
  input: OpportunitySummaryInput
): Promise<OpportunitySummaryOutput> {
  return opportunitySummaryGeneratorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'opportunitySummaryPrompt',
  input: { schema: OpportunitySummaryInputSchema },
  output: { schema: OpportunitySummaryOutputSchema },
  prompt: `You are an expert sales representative. Your task is to generate a concise summary of an opportunity's progress and key details based on the provided activity notes.

Activity Notes:
{{#each activityNotes}}
- {{{this}}}
{{/each}}

Generate a concise summary that covers the key updates and next steps described in these notes.`,
});

const opportunitySummaryGeneratorFlow = ai.defineFlow(
  {
    name: 'opportunitySummaryGeneratorFlow',
    inputSchema: OpportunitySummaryInputSchema,
    outputSchema: OpportunitySummaryOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
