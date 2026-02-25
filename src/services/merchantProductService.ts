import axiosClient from "@/api/axiosClient";
import { type Product, type ProductRequest } from "@/data/mock-data";

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("fr-FR").format(price) + " Ar";
};

export const merchantProductService = {
  // GET /api/products
  async getProducts(): Promise<Product[]> {
    try {
      const { data } = await axiosClient.get("/products");
      return data;
    } catch (error) {
      console.error("Failed to fetch products:", error);
      throw new Error("Failed to fetch products");
    }
  },

  // GET /api/products/:id
  async getProduct(id: string): Promise<Product> {
    try {
      const { data } = await axiosClient.get(`/products/${id}`);
      return data;
    } catch (error) {
      console.error(`Failed to fetch product with id ${id}:`, error);
      throw new Error("Product not found");
    }
  },

  // POST /api/products
  async createProduct(productRequest: ProductRequest): Promise<Product> {
  const formData = new FormData();
  formData.append("name", productRequest.name);
  formData.append("description", productRequest.description);
  formData.append("merchantId", productRequest.merchantId.toString());
  formData.append("category", productRequest.category);
  formData.append("price", productRequest.price.toString());

  if (productRequest.image) {
    formData.append("image", productRequest.image);
  }

  try {
    const token = localStorage.getItem('mc_token'); // ← récupère ton JWT
    const { data } = await axiosClient.post("/products", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: token ? `Bearer ${token}` : "",
      },
      withCredentials: true, // nécessaire si allow_credentials = true
    });
    return data;
  } catch (error) {
    console.error("Failed to create product:", error);
    throw new Error("Invalid product data");
  }
},

  // PUT /api/products/:id
  async updateProduct(
    id: number,
    productRequest: ProductRequest
  ): Promise<Product> {
    const formData = new FormData();
    formData.append("name", productRequest.name);
    formData.append("description", productRequest.description);
    formData.append("merchantId", productRequest.merchantId.toString());
    formData.append("category", productRequest.category);
    formData.append("price", productRequest.price.toString());

    if (productRequest.image) {
      formData.append("image", productRequest.image);
    }

    try {
      const { data } = await axiosClient.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return data;
    } catch (error) {
      console.error(`Failed to update product with id ${id}:`, error);
      throw new Error("Product not found");
    }
  },

  // DELETE /api/products/:id
  async deleteProduct(id: number): Promise<void> {
    try {
      await axiosClient.delete(`/products/${id}`);
    } catch (error) {
      console.error(`Failed to delete product with id ${id}:`, error);
      throw new Error("Product not found");
    }
  },
};
