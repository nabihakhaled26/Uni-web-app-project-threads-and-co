import {
  getAllProducts,
  getProductsByCategory
} from "../model/P2879363productModel.js";

function capitalize(value) {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export function showProducts(url) {
  const selectedCategory = url.searchParams.get("category") || "all";

  const products =
    selectedCategory === "all"
      ? getAllProducts()
      : getProductsByCategory(selectedCategory);

  return {
    products,
    selectedCategory,
    categoryTitle: selectedCategory === "all" ? "All Products" : capitalize(selectedCategory)
  };
}