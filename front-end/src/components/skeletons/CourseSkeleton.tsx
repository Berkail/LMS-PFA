import { Skeleton } from "@/components/ui/skeleton"

export function CourseSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[200px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-6 w-[250px] rounded-xl" />
        <Skeleton className="h-6 w-[200px] rounded-xl" />
      </div>
    </div>
  )
}
