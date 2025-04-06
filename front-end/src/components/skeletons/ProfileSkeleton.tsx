import { Skeleton } from "@/components/ui/skeleton"

export function ProfileSkeleton() {
  return (

              
              <div className="course__container">
                <div className="course__breadcrumb">
                <div className="course__path">
                <Skeleton className="h-5 w-[250px] rounded-xl" />
        
                    <div className="pt-4 course__instructor">
                    <div className="flex items-center space-x-4">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
                    </div>
                
                
                  </div>
                  
                </div>
                

    
    
    </div>
  )
}