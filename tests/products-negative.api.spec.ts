// Exploratory negative scenarios

import { test, expect } from "@playwright/test";
import { ProductsApi } from "../clients/products.api";

test("GET - should return 404 for nonexistent product", async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.getProduct(
    "nonexistent-sdet-product-999999",
  );

  expect(response.status()).toBe(404);

  console.log("Status:", response.status());
  console.log("Body:", await response.text());
});

test("POST - should accept a product without a name", async ({ request }) => {
  const productsApi = new ProductsApi(request);

  const response = await productsApi.createProduct({
    data: {
      price: 1500,
    },
  });

  // Validate observed API behavior
  expect(response.status()).toBe(200);

  const body = await response.json();

  expect(body.id).toBeTruthy();
  expect(body.name).toBeNull();
  expect(body.data.price).toBe(1500);
});
