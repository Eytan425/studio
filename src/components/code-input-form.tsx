"use client";

import React, { useRef } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { SUPPORTED_LANGUAGES, DEFAULT_LANGUAGE } from '@/lib/constants';
import { UploadCloud, FileText } from 'lucide-react';

const formSchema = z.object({
  code: z.string().min(10, { message: "Code must be at least 10 characters." }).max(10000, {message: "Code must be less than 10,000 characters."}),
  language: z.string(),
});

export type CodeInputFormValues = z.infer<typeof formSchema>;

interface CodeInputFormProps {
  onSubmit: (values: CodeInputFormValues) => void;
  isLoading: boolean;
}

export function CodeInputForm({ onSubmit, isLoading }: CodeInputFormProps) {
  const form = useForm<CodeInputFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: '',
      language: DEFAULT_LANGUAGE,
    },
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const text = e.target?.result as string;
        form.setValue('code', text, { shouldValidate: true });
      };
      reader.readAsText(file);
      form.setValue('code', `// Loading file: ${file.name}...`); // Placeholder while reading
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };


  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Submit Your Code</CardTitle>
        <CardDescription>Enter or upload your code snippet and select the language for analysis.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Language</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a language" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {SUPPORTED_LANGUAGES.map((lang) => (
                        <SelectItem key={lang.value} value={lang.value}>
                          {lang.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Code Snippet</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Paste your code here..."
                      className="min-h-[200px] font-mono text-sm bg-background border-input rounded-md shadow-sm focus-visible:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <div>
              <FormLabel htmlFor="file-upload" className="block mb-2">Or Upload a File</FormLabel>
              <Button type="button" variant="outline" onClick={triggerFileUpload} className="w-full justify-start text-muted-foreground">
                <UploadCloud className="mr-2 h-5 w-5" />
                Choose a file...
              </Button>
              <Input
                id="file-upload"
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
                accept=".js,.ts,.py,.java,.cs,.txt" 
              />
               {form.watch('code').startsWith('// Loading file:') && (
                <p className="text-sm text-muted-foreground mt-2 flex items-center">
                  <FileText className="h-4 w-4 mr-1 shrink-0" /> 
                  <span>{form.watch('code').substring(17)} selected. Content will appear above.</span>
                </p>
              )}
            </div>

            <Button type="submit" disabled={isLoading} className="w-full bg-primary hover:bg-primary/90 text-primary-foreground">
              {isLoading ? 'Analyzing...' : 'Analyze Code'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
