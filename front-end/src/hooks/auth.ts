import { useRouter } from "next/router"
import { useState } from "react";


export const useAuth = (user:User, login:string, logout:boolean) => {

    const router = useRouter();
    const [isLoading, setIsLoading] = useState(true); 

    return {
        user,
        isLoading,
        login,
        logout
    }
}