"use client";

import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { addSection, closeSectionModal, updateSection } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const sectionSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
});

type SectionFormData = z.infer<typeof sectionSchema>;

const SectionModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, sectionIndex, editSection } = useAppSelector(
    (state) => state.global.courseEditor.sectionModal
  );

  const methods = useForm<SectionFormData>({
    resolver: zodResolver(sectionSchema),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  useEffect(() => {
    if (editSection) {
      methods.reset({
        title: editSection.title,
        description: editSection.description || "",
      });
    } else {
      methods.reset({
        title: "",
        description: "",
      });
    }
  }, [editSection, methods]);

  const onSubmit = async (data: SectionFormData) => {
    try {
      const newSection = {
        id: editSection?.id || Date.now(),
        title: data.title,
        description: data.description || "",
        chapters: editSection?.chapters || [],
        order: editSection?.order || 0,
      };

      if (sectionIndex === null) {
        await dispatch(addSection(newSection));
        toast.success("Section added successfully");
      } else {
        await dispatch(updateSection({
          index: sectionIndex,
          section: newSection,
        }));
        toast.success("Section updated successfully");
      }

      dispatch(closeSectionModal());
    } catch (error) {
      toast.error("Failed to save section");
      console.error(error);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={() => dispatch(closeSectionModal())}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editSection ? 'Edit Section' : 'Add Section'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(closeSectionModal())}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              name="title"
              label="Section Title"
              type="text"
              placeholder="Write section title here"
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch(closeSectionModal())}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700 text-white">
                {editSection ? 'Update' : 'Create'} Section
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default SectionModal;