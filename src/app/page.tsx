"use client";

import React, { useState, useEffect } from 'react';
import { CodeInputForm, type CodeInputFormValues } from '@/components/code-input-form';
import { AnalysisDisplay } from '@/components/analysis-display';
import { performCodeAnalysis, performSuggestFixes } from './actions';
import type { AnalyzeCodeOutput } from '@/ai/flows/code-analysis';
import type { SuggestFixesOutput } from '@/ai/flows/suggest-fixes';
import { CodeRemedyLogo } from '@/components/logo';
import { useToast } from "@/hooks/use-toast";
import { Separator } from '@/components/ui/separator';

export default function HomePage() {
  const [originalCode, setOriginalCode] = useState<string | null>(null);
  const [currentLanguage, setCurrentLanguage] = useState<string | null>(null);
  
  const [analysisResult, setAnalysisResult] = useState<AnalyzeCodeOutput | null>(null);
  const [suggestionResult, setSuggestionResult] = useState<SuggestFixesOutput | null>(null);
  
  const [isLoadingAnalysis, setIsLoadingAnalysis] = useState(false);
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { toast } = useToast();

  // Effect to clear results when new analysis starts
  useEffect(() => {
    if (isLoadingAnalysis) {
      setAnalysisResult(null);
      setSuggestionResult(null);
      setError(null);
    }
  }, [isLoadingAnalysis]);

  const handleFormSubmit = async (values: CodeInputFormValues) => {
    setIsLoadingAnalysis(true);
    setOriginalCode(values.code);
    setCurrentLanguage(values.language);

    const analysisResponse = await performCodeAnalysis({
      code: values.code,
      language: values.language,
    });

    if ('error' in analysisResponse) {
      setError(analysisResponse.error);
      toast({
        title: "Analysis Failed",
        description: analysisResponse.error,
        variant: "destructive",
      });
      setIsLoadingAnalysis(false);
      return;
    }

    setAnalysisResult(analysisResponse);
    setIsLoadingAnalysis(false);
    
    // Now, get suggestions
    setIsLoadingSuggestions(true);
    const suggestionsResponse = await performSuggestFixes({
      code: values.code,
      language: values.language,
      errors: analysisResponse.analysis, // Pass the analysis text as 'errors' context
    });

    if ('error' in suggestionsResponse) {
      setError(suggestionsResponse.error);
      toast({
        title: "Suggestion Failed",
        description: suggestionsResponse.error,
        variant: "destructive",
      });
    } else {
      setSuggestionResult(suggestionsResponse);
    }
    setIsLoadingSuggestions(false);
  };

  return (
    <div className="container mx-auto p-4 md:p-8 min-h-screen flex flex-col font-sans">
      <header className="mb-6 md:mb-10 text-center md:text-left">
        <CodeRemedyLogo size={40} className="mx-auto md:mx-0 mb-2" />
        <h1 className="text-4xl md:text-5xl font-bold text-primary tracking-tight">
          Code Remedy
        </h1>
        <p className="text-lg text-muted-foreground mt-1">
          Your AI-powered code analysis and suggestion tool.
        </p>
      </header>
      <Separator className="mb-6 md:mb-10"/>
      <main className="flex-grow grid md:grid-cols-2 gap-6 md:gap-10">
        <section aria-labelledby="code-input-heading" className="flex flex-col">
          <h2 id="code-input-heading" className="sr-only">Code Input</h2>
          <CodeInputForm 
            onSubmit={handleFormSubmit} 
            isLoading={isLoadingAnalysis || isLoadingSuggestions} 
          />
        </section>
        
        <section aria-labelledby="analysis-output-heading" className="flex flex-col">
          <h2 id="analysis-output-heading" className="sr-only">Analysis Output</h2>
          <AnalysisDisplay
            originalCode={originalCode}
            language={currentLanguage}
            analysisResult={analysisResult}
            suggestionResult={suggestionResult}
            isLoadingAnalysis={isLoadingAnalysis}
            isLoadingSuggestions={isLoadingSuggestions}
            error={error}
          />
        </section>
      </main>
      <footer className="text-center mt-12 py-6 border-t">
        <p className="text-sm text-muted-foreground">
          &copy; {new Date().getFullYear()} Code Remedy. Powered by Generative AI.
        </p>
      </footer>
    </div>
  );
}
