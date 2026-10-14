// Complete create, read, update, delete workflow
// This test demonstrates the full lifecycle of a product using the ProductsApi client.

import { test, expect } from "@playwright/test";
import { ProductsApi } from "../clients/products.api";

test("CRUD - should manage a product lifecycle", async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const productName = `MARIEHZ Product ${Date.now()}`;
  let productId: string | undefined;

  try {
    // CREATE
    const createResponse = await productsApi.createProduct({
      name: productName,
      data: {
        price: 1500,
        color: "Black",
      },
    });

    expect(createResponse.status()).toBe(200);

    const createdProduct = await createResponse.json();
    productId = createdProduct.id;

    expect(productId).toBeTruthy();
    expect(createdProduct.name).toBe(productName);

    // READ
    const getResponse = await productsApi.getProduct(productId!);

    expect(getResponse.status()).toBe(200);

    const product = await getResponse.json();

    expect(product.id).toBe(productId);
    expect(product.name).toBe(productName);

    // UPDATE
    const updatedName = `${productName} Updated`;

    const updateResponse = await productsApi.updateProduct(productId!, {
      name: updatedName,
    });

    expect(updateResponse.ok()).toBeTruthy();

    // VERIFY UPDATE
    const verifyResponse = await productsApi.getProduct(productId!);

    expect(verifyResponse.ok()).toBeTruthy();

    const updatedProduct = await verifyResponse.json();

    expect(updatedProduct.name).toBe(updatedName);
  } finally {
    // CLEANUP
    if (productId) {
      const deleteResponse = await productsApi.deleteProduct(productId);

      expect(deleteResponse.ok()).toBeTruthy();
    }
  }
});
