import { create } from "zustand";

interface ContentStore {
  content: Record<string, string>;
  setContent: (c: Record<string, string>) => void;
}

export const useContentStore = create<ContentStore>((set) => ({
  content: {},
  setContent: (c) => set({ content: c }),
}));