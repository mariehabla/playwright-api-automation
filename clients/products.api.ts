// Reusable API client for sending product CRUD requests (POST, GET, PATCH, DELETE).
// If the test wants to create a product, it can call the createProduct method with the payload.
// If it wants to retrieve a product, it can call the getProduct method with the product ID.
// If it wants to update a product, it can call the updateProduct method with the product ID and payload.
// If it wants to delete a product, it can call the deleteProduct method with the product ID.

import { APIRequestContext } from "@playwright/test";

export class ProductsApi {
  constructor(private request: APIRequestContext) {}

  async createProduct(payload: object) {
    return await this.request.post("/objects", {
      data: payload,
    });
  }

  async getProduct(id: string) {
    return await this.request.get(`/objects/${id}`);
  }

  async updateProduct(id: string, payload: object) {
    return await this.request.patch(`/objects/${id}`, {
      data: payload,
    });
  }

  async deleteProduct(id: string) {
    return await this.request.delete(`/objects/${id}`);
  }
}
