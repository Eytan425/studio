// src/app/actions.ts
"use server";

import { analyzeCode, type AnalyzeCodeInput, type AnalyzeCodeOutput } from '@/ai/flows/code-analysis';
import { suggestFixes, type SuggestFixesInput, type SuggestFixesOutput } from '@/ai/flows/suggest-fixes';

export async function performCodeAnalysis(data: AnalyzeCodeInput): Promise<AnalyzeCodeOutput | { error: string }> {
  try {
    const result = await analyzeCode(data);
    return result;
  } catch (error) {
    console.error("Error in performCodeAnalysis:", error);
    return { error: "Failed to analyze code. Please try again." };
  }
}

export async function performSuggestFixes(data: SuggestFixesInput): Promise<SuggestFixesOutput | { error: string }> {
  try {
    const result = await suggestFixes(data);
    return result;
  } catch (error) {
    console.error("Error in performSuggestFixes:", error);
    return { error: "Failed to suggest fixes. Please try again." };
  }
}
