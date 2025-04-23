"use client";

import { useRef } from "react";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";
import { combineReducers, configureStore, createAction } from "@reduxjs/toolkit";
import { Provider } from "react-redux";
import globalReducer from "@/state";

/* REDUX STORE */
const rootReducer = combineReducers({
  global: globalReducer,
});

export const openSectionModal = createAction<{
  sectionIndex: number | null;
  editSection?: Section;  // Add this
}>('courseEditor/openSectionModal');

export const openChapterModal = createAction<{
  sectionIndex: number;
  chapterIndex: number | null;
  editChapter?: Chapter;  // Add this
}>('courseEditor/openChapterModal');

export const makeStore = () => {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredPaths: [
            "global.courseEditor.sections",
          ],
        },
      }),
  });
};

/* REDUX TYPES */
export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;



/* PROVIDER */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }
  return <Provider store={storeRef.current}>{children}</Provider>;
}

