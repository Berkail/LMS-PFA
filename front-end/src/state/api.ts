import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";



export const api = createApi({
  baseQuery: fetchBaseQuery({ baseUrl: process.env.NEXT_PUBLIC_API_PREFIX }),
  reducerPath: "api",
  tagTypes: ["courses", "Users", "UserCourseProgress"],
  endpoints: (build) => ({
    
    getCourses: build.query<Course[], { category?: string }>({
      query: ({ category }) => ({
        url: "courses",
        params: { category },
      }),
      providesTags: ["courses"],
    }),

    getCourse: build.query<Course, string>({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "courses", id }],
    }),

  }),
});

export const {
  useGetCoursesQuery,
  useGetCourseQuery,
} = api;