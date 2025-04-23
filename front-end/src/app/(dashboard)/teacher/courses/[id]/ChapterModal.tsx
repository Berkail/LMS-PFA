import { CustomFormField } from "@/components/CustomFormField";
import CustomModal from "@/components/CustomModal";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { addChapter, closeChapterModal, updateChapter } from "@/state";
import { useAppDispatch, useAppSelector } from "@/state/redux";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

// Define the schema
const chapterSchema = z.object({
  title: z.string().min(1, "Title is required"),
  content: z.string().optional(),
  videoUrl: z.string().optional(),
});

type ChapterFormData = z.infer<typeof chapterSchema>;

const ChapterModal = () => {
  const dispatch = useAppDispatch();
  const { isOpen, sectionIndex, chapterIndex, editChapter } = useAppSelector(
    (state) => state.global.courseEditor.chapterModal
  );

  const methods = useForm<ChapterFormData>({
    resolver: zodResolver(chapterSchema),
    defaultValues: {
      title: "",
      content: "",
      videoUrl: "",
    },
  });

  useEffect(() => {
    if (editChapter) {
      methods.reset({
        title: editChapter.title,
        content: editChapter.content || "",
        videoUrl: editChapter.videoUrl || "",
      });
    } else {
      methods.reset({
        title: "",
        content: "",
        videoUrl: "",
      });
    }
  }, [editChapter, methods]);

  const onSubmit = async (data: ChapterFormData) => {
    if (typeof sectionIndex !== 'number') {
      toast.error("Invalid section");
      return;
    }

    try {
      const newChapter = {
        id: editChapter?.id || Date.now(),
        title: data.title,
        content: data.content || "",
        videoUrl: data.videoUrl || "",
        sectionId: sectionIndex,
      };

      if (chapterIndex === null) {
        await dispatch(addChapter({
          sectionIndex,
          chapter: newChapter,
        }));
        toast.success("Chapter added successfully");
      } else {
        await dispatch(updateChapter({
          sectionIndex,
          chapterIndex,
          chapter: newChapter,
        }));
        toast.success("Chapter updated successfully");
      }

      dispatch(closeChapterModal());
    } catch (error) {
      toast.error("Failed to save chapter");
      console.error(error);
    }
  };

  return (
    <CustomModal isOpen={isOpen} onClose={() => dispatch(closeChapterModal())}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editChapter ? 'Edit Chapter' : 'Add Chapter'}
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => dispatch(closeChapterModal())}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>

        <Form {...methods}>
          <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-4">
            <CustomFormField
              name="title"
              label="Chapter Title"
              type="text"
              placeholder="Write chapter title here"
            />
            <CustomFormField
              name="videoUrl"
              label="Video URL"
              type="text"
              placeholder="Enter video URL (e.g., YouTube, Vimeo)"
            />

            <div className="flex justify-end gap-2 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => dispatch(closeChapterModal())}
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary-700 text-white">
                {editChapter ? 'Update' : 'Create'} Chapter
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </CustomModal>
  );
};

export default ChapterModal;