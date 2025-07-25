import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Zap, Upload, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertJobSchema } from "@shared/schema";
import type { Job } from "@shared/schema";
import { z } from "zod";

const formSchema = insertJobSchema.extend({
  image: z.any().optional(),
});

interface JobAnalysisFormProps {
  onAnalysisComplete: (result: Job) => void;
}

export default function JobAnalysisForm({ onAnalysisComplete }: JobAnalysisFormProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: "",
      company: "",
      description: "",
      contactEmail: "",
      sourceUrl: "",
    },
  });

  const analyzeJobMutation = useMutation({
    mutationFn: async (data: z.infer<typeof formSchema>) => {
      const response = await apiRequest("POST", "/api/jobs/analyze", data);
      return response.json();
    },
    onSuccess: (result: Job) => {
      toast({
        title: "Analysis Complete",
        description: "Job posting has been analyzed for fraud indicators.",
      });
      onAnalysisComplete(result);
      form.reset();
      setSelectedFile(null);
    },
    onError: (error) => {
      toast({
        title: "Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const analyzeImageMutation = useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch('/api/jobs/analyze-image', {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to analyze image');
      }
      
      return response.json();
    },
    onSuccess: (result) => {
      // Extract text and pre-fill form
      if (result.extractedText) {
        form.setValue('description', result.extractedText);
      }
      
      // Create a fake job result for display
      const jobResult: Job = {
        id: 'image-analysis',
        title: 'Image Analysis Result',
        company: 'Unknown',
        description: result.extractedText || 'Text extraction failed',
        contactEmail: null,
        sourceUrl: null,
        userId: null,
        riskScore: result.fraudAnalysis.riskScore,
        riskLevel: result.fraudAnalysis.riskLevel,
        redFlags: result.fraudAnalysis.redFlags,
        aiAnalysis: {
          explanation: result.fraudAnalysis.explanation,
          confidence: result.fraudAnalysis.confidence,
          keyPhrases: result.fraudAnalysis.keyPhrases,
        },
        status: result.fraudAnalysis.riskLevel === 'high' ? 'scam' : 
                result.fraudAnalysis.riskLevel === 'medium' ? 'suspicious' : 'safe',
        createdAt: new Date(),
      };
      
      onAnalysisComplete(jobResult);
      toast({
        title: "Image Analysis Complete",
        description: "Job poster has been analyzed for fraud indicators.",
      });
    },
    onError: (error) => {
      toast({
        title: "Image Analysis Failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    analyzeJobMutation.mutate(data);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      if (file.type.startsWith('image/')) {
        analyzeImageMutation.mutate(file);
      } else {
        toast({
          title: "Invalid File Type",
          description: "Please select an image file (JPG, PNG).",
          variant: "destructive",
        });
      }
    }
  };

  return (
    <div className="glass-morphism rounded-xl p-8 shadow-2xl">
      <h2 className="text-2xl font-semibold text-white mb-6 flex items-center">
        <Zap className="w-6 h-6 text-orange-500 mr-3" />
        Analyze Job Posting
      </h2>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Job Title *</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., Software Engineer" 
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="company"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Company Name</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="e.g., TechCorp Inc." 
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="description"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-300">Job Description *</FormLabel>
                <FormControl>
                  <Textarea 
                    rows={6}
                    placeholder="Paste the complete job description here..."
                    className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500 resize-none"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={form.control}
              name="contactEmail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Contact Email</FormLabel>
                  <FormControl>
                    <Input 
                      type="email"
                      placeholder="recruiter@company.com" 
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="sourceUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-slate-300">Source URL</FormLabel>
                  <FormControl>
                    <Input 
                      type="url"
                      placeholder="https://company.com/careers" 
                      className="bg-slate-800/50 border-slate-600 text-white placeholder-slate-400 focus:ring-orange-500 focus:border-orange-500"
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">
              Upload Job Poster (Optional)
            </label>
            <div className="border-2 border-dashed border-slate-600 rounded-lg p-6 text-center hover:border-orange-500 transition-colors">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                className="hidden"
                id="file-upload"
              />
              <label htmlFor="file-upload" className="cursor-pointer">
                <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-slate-400">
                  {selectedFile ? selectedFile.name : "Drop image here or click to browse"}
                </p>
                <p className="text-xs text-slate-500 mt-1">Supports JPG, PNG up to 10MB</p>
              </label>
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={analyzeJobMutation.isPending || analyzeImageMutation.isPending}
            className="w-full gradient-accent text-white font-semibold py-4 px-6 rounded-lg hover:shadow-lg transform hover:scale-105 transition-all duration-200"
          >
            {analyzeJobMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                Analyzing...
              </>
            ) : (
              <>
                <Zap className="w-5 h-5 mr-2" />
                Analyze with AI
              </>
            )}
          </Button>
        </form>
      </Form>
    </div>
  );
}
