import axiosClient from "@/api/axiosClient";
import type { CategoryResponse, CategoryRequest } from "@/data/mock-data";


export const categoryService = {
  // GET /api/categories
  async getAll(): Promise<CategoryResponse[]> {
    try {
      const { data } = await axiosClient.get("/categories");
      return data;
    } catch (error) {
      console.error("Failed to fetch categories:", error);
      throw new Error("Failed to fetch categories");
    }
  },

  // GET /api/categories/:id
  async getById(id: number): Promise<CategoryResponse> {
    try {
      const { data } = await axiosClient.get(`/categories/${id}`);
      return data;
    } catch (error: any) {
      console.error(`Failed to fetch category with id ${id}:`, error.response || error);
      throw new Error(error.response?.data?.message || "Category not found");
    }
  },

  // POST /api/categories
  async create(category: CategoryRequest): Promise<CategoryResponse> {
    try {
      const { data } = await axiosClient.post("/categories", category, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (error: any) {
      console.error("Failed to create category:", error.response || error);
      throw new Error(error.response?.data?.message || "Invalid category data");
    }
  },

  // PUT /api/categories/:id
  async update(id: number, category: CategoryRequest): Promise<CategoryResponse> {
    try {
      const { data } = await axiosClient.put(`/categories/${id}`, category, {
        headers: { "Content-Type": "application/json" },
      });
      return data;
    } catch (error: any) {
      console.error(`Failed to update category with id ${id}:`, error.response || error);
      throw new Error(error.response?.data?.message || "Category not found");
    }
  },

  // DELETE /api/categories/:id
  async delete(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/categories/${id}`);
    } catch (error: any) {
      console.error(`Failed to delete category with id ${id}:`, error.response || error);
      throw new Error(error.response?.data?.message || "Category not found");
    }
  },
};