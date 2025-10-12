import { defineStore } from "pinia";
import type { Product } from "../types/product.types";

export const useProductStore = defineStore("product", {
  state: () => ({
    product: null as Product | null,
  }),
  actions: {
    setProduct(newProduct: Product) {
      this.product = newProduct;
    },
  },
});
