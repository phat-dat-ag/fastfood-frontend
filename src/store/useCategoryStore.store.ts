import { defineStore } from "pinia";
import type { Category } from "../types/category.types";

export const useCategoryStore = defineStore("category", {
  state: () => ({
    category: null as Category | null,
  }),
  actions: {
    setCategory(newCategory: Category) {
      this.category = newCategory;
    },
  },
});
