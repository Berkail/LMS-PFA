"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

interface Assignment {
  id: number;
  title: string;
  description: string;
  pdfPath: string | null;
  pdfName: string | null;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
  isPublished: boolean;
  instructorId: number;
}

const assignmentSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
  file: z.instanceof(File).optional(),
});

type AssignmentFormData = z.infer<typeof assignmentSchema>;

const EditAssignment = () => {
  const params = useParams();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [pdfFile, setPdfFile] = useState<File | null>(null);
  const isCreateMode = params.assignmentId === 'create';

  const form = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    const fetchAssignment = async () => {
      if (isCreateMode) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost/api/exams/${params.assignmentId}`);
        const data = await response.json();

        if (response.ok && data.data) {
          form.reset({
            title: data.data.title,
            description: data.data.description,
          });
        } else {
          throw new Error("Failed to fetch assignment");
        }
      } catch (error) {
        console.error("Error fetching assignment:", error);
        router.push("/teacher/assignments");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAssignment();
  }, [params.assignmentId, form, router, isCreateMode]);

  const onSubmit = async (data: AssignmentFormData) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("description", data.description);
      if (pdfFile) {
        formData.append("file", pdfFile);
      }

      const url = isCreateMode 
        ? 'http://localhost/api/exams'
        : `http://localhost/api/exams/${params.assignmentId}`;

      const response = await fetch(url, {
        method: isCreateMode ? 'POST' : 'PATCH',
        body: formData,
      });

      if (response.ok) {
        router.push("/teacher/assignments");
      } else {
        throw new Error(isCreateMode ? "Failed to create assignment" : "Failed to update assignment");
      }
    } catch (error) {
      console.error(isCreateMode ? "Error creating assignment:" : "Error updating assignment:", error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="assignment dark">
      <div className="assignment__container">
        <Card className="assignment__content">
          <CardHeader>
            <CardTitle>{isCreateMode ? 'Create Assignment' : 'Edit Assignment'}</CardTitle>
            <CardDescription>
              {isCreateMode ? 'Create a new assignment' : 'Update the assignment details below'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Assignment Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter assignment title" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Enter assignment description"
                          className="min-h-[100px]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormItem>
                  <FormLabel>Update PDF Assignment</FormLabel>
                  <FormControl>
                    <Input
                      type="file"
                      accept=".pdf"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) setPdfFile(file);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>

<div className="flex justify-end space-x-4">
                  <Button 
                    variant="outline" 
                    type="button"
                    onClick={() => router.push("/teacher/assignments")}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" className="bg-primary">
                    {isCreateMode ? 'Create Assignment' : 'Update Assignment'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default EditAssignment;