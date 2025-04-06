import { Skeleton } from "@/components/ui/skeleton"

export function CourseVideoSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="w-full h-[500px] rounded-xl" />
    </div>
  )
}