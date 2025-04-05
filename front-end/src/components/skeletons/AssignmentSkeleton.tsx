import { Skeleton } from "@/components/ui/skeleton"

export function AssignmentSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[150px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-5 w-[250px] rounded-xl" />
        <Skeleton className="h-5 w-[200px] rounded-xl" />
      </div>
    </div>
  )
}
