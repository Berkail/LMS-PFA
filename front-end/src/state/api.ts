import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { BaseQueryApi, FetchArgs } from "@reduxjs/toolkit/query";
import { toast } from "sonner";

const customBaseQuery = async (
    args: string | FetchArgs,
    api: BaseQueryApi,
    extraOptions: any
) => {
  const baseQuery = fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8001',
    credentials: 'include', // Include credentials for cookies if you're using cookie-based auth
    prepareHeaders: async (headers) => {
      // Replace this with your own authentication method
      // For example, if you're using JWT stored in localStorage:
      const token = localStorage.getItem('authToken');
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  });

  try {
    const result: any = await baseQuery(args, api, extraOptions);

    if (result.error) {
      const errorData = result.error.data;
      const errorMessage =
          errorData?.message ||
          result.error.status.toString() ||
          "An error occurred";
      toast.error(`Error: ${errorMessage}`);
    }

    const isMutationRequest =
        (args as FetchArgs).method && (args as FetchArgs).method !== "GET";

    if (isMutationRequest && result.data) {
      const successMessage = result.data?.message;
      if (successMessage) toast.success(successMessage);
    }

    if (result.data?.data) {
      result.data = result.data.data;
    } else if (
        result.error?.status === 204 ||
        result.meta?.response?.status === 204
    ) {
      return { data: null };
    }

    return result;
  } catch (error: unknown) {
    const errorMessage =
        error instanceof Error ? error.message : "Unknown error";

    console.error("API request failed:", errorMessage);
    toast.error(`Connection error: ${errorMessage}`);
    return { error: { status: "FETCH_ERROR", error: errorMessage } };
  }
};

export const api = createApi({
  baseQuery: customBaseQuery,
  reducerPath: "api",
  tagTypes: ["Courses", "Users", "UserCourseProgress"],
  endpoints: (build) => ({
    /*
    ===============
    USERS
    ===============
    */
    updateUser: build.mutation({
      query: ({ userId, ...updatedUser }) => ({
        url: `users/${userId}`,
        method: "PUT",
        body: updatedUser,
      }),
      invalidatesTags: ["Users"],
    }),

    /*
    ===============
    COURSES
    ===============
    */
    getCourses: build.query({
      query: ({ category } = {}) => ({
        url: "courses",
        params: category ? { category } : undefined,
      }),
      providesTags: ["Courses"],
    }),

    getCourse: build.query({
      query: (id) => `courses/${id}`,
      providesTags: (result, error, id) => [{ type: "Courses", id }],
    }),

    createCourse: build.mutation({
      query: (body) => ({
        url: `courses`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Courses"],
    }),

    updateCourse: build.mutation({
      query: ({ courseId, formData }) => ({
        url: `courses/${courseId}`,
        method: "PUT",
        body: formData,
      }),
      invalidatesTags: (result, error, { courseId }) => [
        { type: "Courses", id: courseId },
      ],
    }),

    deleteCourse: build.mutation({
      query: (courseId) => ({
        url: `courses/${courseId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Courses"],
    }),

    getUploadVideoUrl: build.mutation({
      query: ({ courseId, sectionId, chapterId, fileName, fileType }) => ({
        url: `courses/${courseId}/sections/${sectionId}/chapters/${chapterId}/get-upload-url`,
        method: "POST",
        body: { fileName, fileType },
      }),
    }),

    /*
    ===============
    TRANSACTIONS
    ===============
    */
    getTransactions: build.query({
      query: (userId) => `transactions?userId=${userId}`,
    }),

    createStripePaymentIntent: build.mutation({
      query: ({ amount }) => ({
        url: `/transactions/stripe/payment-intent`,
        method: "POST",
        body: { amount },
      }),
    }),

    createTransaction: build.mutation({
      query: (transaction) => ({
        url: "transactions",
        method: "POST",
        body: transaction,
      }),
    }),

    /*
    ===============
    USER COURSE PROGRESS
    ===============
    */
    getUserEnrolledCourses: build.query({
      query: (userId) => `users/course-progress/${userId}/enrolled-courses`,
      providesTags: ["Courses", "UserCourseProgress"],
    }),

    getUserCourseProgress: build.query({
      query: ({ userId, courseId }) =>
          `users/course-progress/${userId}/courses/${courseId}`,
      providesTags: ["UserCourseProgress"],
    }),

    updateUserCourseProgress: build.mutation({
      query: ({ userId, courseId, progressData }) => ({
        url: `users/course-progress/${userId}/courses/${courseId}`,
        method: "PUT",
        body: progressData,
      }),
      invalidatesTags: ["UserCourseProgress"],
      async onQueryStarted(
          { userId, courseId, progressData },
          { dispatch, queryFulfilled }
      ) {
        const patchResult = dispatch(
            api.util.updateQueryData(
                "getUserCourseProgress",
                { userId, courseId },
                (draft) => {
                  Object.assign(draft, {
                    ...draft,
                    sections: progressData.sections,
                  });
                }
            )
        );
        try {
          await queryFulfilled;
        } catch {
          patchResult.undo();
        }
      },
    }),
  }),
});

export const {
  useUpdateUserMutation,
  useCreateCourseMutation,
  useUpdateCourseMutation,
  useDeleteCourseMutation,
  useGetCoursesQuery,
  useGetCourseQuery,
  useGetUploadVideoUrlMutation,
  useGetTransactionsQuery,
  useCreateTransactionMutation,
  useCreateStripePaymentIntentMutation,
  useGetUserEnrolledCoursesQuery,
  useGetUserCourseProgressQuery,
  useUpdateUserCourseProgressMutation,
} = api;