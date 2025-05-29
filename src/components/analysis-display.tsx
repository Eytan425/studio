"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { AlertTriangle, Lightbulb, CheckCircle, Copy, Code2, FileText } from 'lucide-react';
import type { AnalyzeCodeOutput } from '@/ai/flows/code-analysis';
import type { SuggestFixesOutput } from '@/ai/flows/suggest-fixes';
import { useToast } from "@/hooks/use-toast";

interface AnalysisDisplayProps {
  originalCode: string | null;
  language: string | null;
  analysisResult: AnalyzeCodeOutput | null;
  suggestionResult: SuggestFixesOutput | null;
  isLoadingAnalysis: boolean;
  isLoadingSuggestions: boolean;
  error: string | null;
}

const CodeBlock: React.FC<{ code: string; language: string | null, title: string, onCopy?: () => void }> = ({ code, language, title, onCopy }) => (
  <Card className="mt-4 shadow-sm">
    <CardHeader className="flex flex-row items-center justify-between pb-2">
      <CardTitle className="text-lg font-medium flex items-center">
        <Code2 className="mr-2 h-5 w-5 text-primary"/>
        {title}
      </CardTitle>
      {onCopy && (
         <Button variant="ghost" size="icon" onClick={onCopy} aria-label="Copy code">
           <Copy className="h-4 w-4" />
         </Button>
      )}
    </CardHeader>
    <CardContent>
      <pre className="bg-muted p-4 rounded-md overflow-x-auto">
        <code className={`language-${language || 'plaintext'} font-mono text-sm`}>
          {code}
        </code>
      </pre>
    </CardContent>
  </Card>
);


export function AnalysisDisplay({
  originalCode,
  language,
  analysisResult,
  suggestionResult,
  isLoadingAnalysis,
  isLoadingSuggestions,
  error,
}: AnalysisDisplayProps) {
  const { toast } = useToast();

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text)
      .then(() => {
        toast({
          title: "Copied to clipboard!",
          description: `${type} has been copied.`,
        });
      })
      .catch(err => {
        console.error("Failed to copy: ", err);
        toast({
          title: "Copy Failed",
          description: `Could not copy ${type}. Please try again.`,
          variant: "destructive",
        });
      });
  };

  if (isLoadingAnalysis) {
    return (
      <Card className="shadow-lg animate-pulse">
        <CardHeader>
          <Skeleton className="h-8 w-3/5" />
          <Skeleton className="h-4 w-4/5 mt-2" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-12 w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="shadow-md">
        <AlertTriangle className="h-5 w-5" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  if (!analysisResult && !suggestionResult && !originalCode) {
    return (
      <Card className="shadow-lg text-center">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">Ready for Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Submit your code snippet on the left to get started.
          </p>
          <FileText className="mx-auto mt-4 h-16 w-16 text-muted-foreground opacity-50" />
        </CardContent>
      </Card>
    );
  }
  
  return (
    <div className="space-y-6">
      {originalCode && (
        <CodeBlock code={originalCode} language={language} title="Original Code" onCopy={() => handleCopy(originalCode, "Original code")} />
      )}

      {analysisResult && (
        <Card className="shadow-lg animate-in fade-in-0 duration-500">
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center">
              <Lightbulb className="mr-2 h-6 w-6 text-accent" /> Code Analysis
            </CardTitle>
            <CardDescription>AI-powered insights into your code.</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded-md">{analysisResult.analysis}</p>
          </CardContent>
        </Card>
      )}

      {isLoadingSuggestions && (
        <Card className="shadow-lg animate-pulse">
          <CardHeader>
            <Skeleton className="h-8 w-2/5" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      )}

      {suggestionResult && (
        <div className="space-y-6 animate-in fade-in-0 duration-500 delay-200">
          <CodeBlock code={suggestionResult.improvedCode} language={language} title="Suggested Code" onCopy={() => handleCopy(suggestionResult.improvedCode, "Suggested code")} />
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-xl font-semibold flex items-center">
                <CheckCircle className="mr-2 h-6 w-6 text-green-500" /> Improvement Suggestions
              </CardTitle>
              <CardDescription>Detailed recommendations for enhancing your code.</CardDescription>
            </CardHeader>
            <CardContent>
              {suggestionResult.suggestions.length > 0 ? (
                <ul className="space-y-3 list-disc list-inside pl-2">
                  {suggestionResult.suggestions.map((suggestion, index) => (
                    <li key={index} className="text-sm leading-relaxed">
                      {suggestion}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground">No specific suggestions provided beyond the improved code.</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
