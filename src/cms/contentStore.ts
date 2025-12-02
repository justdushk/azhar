import { create } from "zustand";

interface ContentStore {
  content: Record<string, string>;
  isReady: boolean;

  setContent: (c: Record<string, string>) => void;
  setReady: (v: boolean) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  content: {},
  isReady: false,

  setContent: (c) => set({ content: c }),
  setReady: (v) => set({ isReady: v }),
}));
