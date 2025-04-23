import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Chapter {
  id: number;
  title: string;
  content?: string;
  videoUrl?: string;
  sectionId: number;
}

interface Section {
  id: number;
  title: string;
  description?: string;
  chapters: Chapter[];
  order: number;
}

interface ChapterModal {
  isOpen: boolean;
  sectionIndex: number | null;
  chapterIndex: number | null;
  editChapter: Chapter | null;
}

interface SectionModal {
  isOpen: boolean;
  sectionIndex: number | null;
  editSection: Section | null;
}

interface InitialStateTypes {
  courseEditor: {
    sections: Section[];
    chapterModal: ChapterModal;
    sectionModal: SectionModal;
  };
}

const initialState: InitialStateTypes = {
  courseEditor: {
    sections: [],
    chapterModal: {
      isOpen: false,
      sectionIndex: null,
      chapterIndex: null,
      editChapter: null,
    },
    sectionModal: {
      isOpen: false,
      sectionIndex: null,
      editSection: null,
    },
  },
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setSections: (state, action: PayloadAction<Section[]>) => {
      state.courseEditor.sections = action.payload;
    },
    
    openChapterModal: (
      state,
      action: PayloadAction<{
        sectionIndex: number;
        chapterIndex: number | null;
        editChapter?: Chapter;
      }>
    ) => {
      state.courseEditor.chapterModal = {
        isOpen: true,
        sectionIndex: action.payload.sectionIndex,
        chapterIndex: action.payload.chapterIndex,
        editChapter: action.payload.editChapter || null,
      };
    },

    closeChapterModal: (state) => {
      state.courseEditor.chapterModal = {
        isOpen: false,
        sectionIndex: null,
        chapterIndex: null,
        editChapter: null,
      };
    },

    openSectionModal: (
      state,
      action: PayloadAction<{
        sectionIndex: number | null;
        editSection?: Section;
      }>
    ) => {
      state.courseEditor.sectionModal = {
        isOpen: true,
        sectionIndex: action.payload.sectionIndex,
        editSection: action.payload.editSection || null,
      };
    },

    closeSectionModal: (state) => {
      state.courseEditor.sectionModal = {
        isOpen: false,
        sectionIndex: null,
        editSection: null,
      };
    },

    addSection: (state, action: PayloadAction<Section>) => {
      state.courseEditor.sections.push(action.payload);
    },

    updateSection: (
      state,
      action: PayloadAction<{ index: number; section: Section }>
    ) => {
      state.courseEditor.sections[action.payload.index] = action.payload.section;
    },

    deleteSection: (state, action: PayloadAction<number>) => {
      state.courseEditor.sections.splice(action.payload, 1);
    },

    addChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapter: Chapter }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.push(
        action.payload.chapter
      );
    },

    updateChapter: (
      state,
      action: PayloadAction<{
        sectionIndex: number;
        chapterIndex: number;
        chapter: Chapter;
      }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters[
        action.payload.chapterIndex
      ] = action.payload.chapter;
    },

    deleteChapter: (
      state,
      action: PayloadAction<{ sectionIndex: number; chapterIndex: number }>
    ) => {
      state.courseEditor.sections[action.payload.sectionIndex].chapters.splice(
        action.payload.chapterIndex,
        1
      );
    },
  },
});

export const {
  setSections,
  openChapterModal,
  closeChapterModal,
  openSectionModal,
  closeSectionModal,
  addSection,
  updateSection,
  deleteSection,
  addChapter,
  updateChapter,
  deleteChapter,
} = globalSlice.actions;

export default globalSlice.reducer;