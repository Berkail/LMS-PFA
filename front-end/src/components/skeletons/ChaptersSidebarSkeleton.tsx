import { Skeleton } from "@/components/ui/skeleton"

export function ChaptersSidebarSkeleton() {
  return (
    


<div className="chapters-sidebar-skeleton">

      <div className="chapters-sidebar__header">
        <h2 className="chapters-sidebar__title"><Skeleton className="h-7 w-[250px] rounded-xl" /></h2>
        
        <hr className="chapters-sidebar__divider" />
        <div className="chapters-sidebar-sections-skeleton">
            <div>
        <Skeleton className="h-3 w-[220px] rounded-xl mb-3" />
        <Skeleton className="h-3 w-[250px] rounded-xl" />
        </div>
        </div>
        <hr className="chapters-sidebar__divider" />
        <div className="chapters-sidebar-sections-skeleton">
        <div>
        <Skeleton className="h-3 w-[220px] rounded-xl mb-3" />
        <Skeleton className="h-3 w-[250px] rounded-xl" />
        </div>
        </div>
        <hr className="chapters-sidebar__divider" />
        <div className="chapters-sidebar-sections-skeleton">
        <div>
        <Skeleton className="h-3 w-[220px] rounded-xl mb-3" />
        <Skeleton className="h-3 w-[250px] rounded-xl" />
        </div>
        </div>
        <hr className="chapters-sidebar__divider" />
        <div className="chapters-sidebar-sections-skeleton">
        <div>
        <Skeleton className="h-3 w-[220px] rounded-xl mb-3" />
        <Skeleton className="h-3 w-[250px] rounded-xl" />
        </div>
        </div>

      </div>
    </div>
  )
}
