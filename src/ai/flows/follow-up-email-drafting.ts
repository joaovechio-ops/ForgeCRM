'use server';
/**
 * @fileOverview A Genkit flow for drafting follow-up emails based on interaction notes and opportunity status.
 *
 * - followUpEmailDrafting - A function that generates a draft follow-up email.
 * - FollowUpEmailDraftingInput - The input type for the followUpEmailDrafting function.
 * - FollowUpEmailDraftingOutput - The return type for the followUpEmailDrafting function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const FollowUpEmailDraftingInputSchema = z.object({
  recipientName: z.string().describe('The name of the lead or contact.'),
  recipientEmail: z.string().email().describe('The email address of the lead or contact.'),
  senderName: z.string().describe('The name of the sales representative drafting the email.'),
  interactionNotes: z.string().describe('Detailed notes from the recent interaction with the lead/contact.'),
  opportunityStatus: z.string().describe('The current status of the opportunity (e.g., Discovery, Proposal Sent, Negotiation).'),
  opportunityValue: z.string().optional().describe('The value of the opportunity, if applicable.'),
  expectedCloseDate: z.string().optional().describe('The expected closing date for the opportunity, if applicable.'),
});
export type FollowUpEmailDraftingInput = z.infer<typeof FollowUpEmailDraftingInputSchema>;

const FollowUpEmailDraftingOutputSchema = z.object({
  subject: z.string().describe('The subject line for the follow-up email.'),
  body: z.string().describe('The body content of the follow-up email.'),
});
export type FollowUpEmailDraftingOutput = z.infer<typeof FollowUpEmailDraftingOutputSchema>;

export async function followUpEmailDrafting(input: FollowUpEmailDraftingInput): Promise<FollowUpEmailDraftingOutput> {
  return followUpEmailDraftingFlow(input);
}

const prompt = ai.definePrompt({
  name: 'followUpEmailDraftingPrompt',
  input: { schema: FollowUpEmailDraftingInputSchema },
  output: { schema: FollowUpEmailDraftingOutputSchema },
  prompt: `You are a helpful sales assistant. Your task is to draft a professional and concise follow-up email.

Use the provided information to craft a relevant and personalized message.

Recipient Name: {{{recipientName}}}
Recipient Email: {{{recipientEmail}}}
Sender Name: {{{senderName}}}
Recent Interaction Notes: {{{interactionNotes}}}
Opportunity Status: {{{opportunityStatus}}}
{{#if opportunityValue}}Opportunity Value: {{{opportunityValue}}}{{/if}}
{{#if expectedCloseDate}}Expected Close Date: {{{expectedCloseDate}}}{{/if}}

Draft a follow-up email that:
- References the recent interaction notes.
- Briefly mentions the current opportunity status.
- Is professional and encourages the next step or reinforces previous agreements.
- Keep it concise and to the point.

Generate only the subject and body of the email in JSON format.`,
});

const followUpEmailDraftingFlow = ai.defineFlow(
  {
    name: 'followUpEmailDraftingFlow',
    inputSchema: FollowUpEmailDraftingInputSchema,
    outputSchema: FollowUpEmailDraftingOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return output!;
  }
);
