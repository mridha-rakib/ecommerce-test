// lib/api/products.ts
import axios from "axios";
import { Product, ProductApiResponse } from "@/types/product";

export const fetchProduct = async (id: string): Promise<Product | null> => {
  try {
    const response = await axios.get<ProductApiResponse>(
      `https://glore-bd-backend-node-mongo.vercel.app/api/product/${id}`
    );
    return response.data.data[0];
  } catch (error) {
    console.error("Error fetching product:", error);
    return null;
  }
};

export const fetchProducts = async (): Promise<Product[]> => {
  try {
    const response = await axios.get<ProductApiResponse>(
      "https://glore-bd-backend-node-mongo.vercel.app/api/product"
    );
    return response.data.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
