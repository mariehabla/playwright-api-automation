// This test demonstrates the use of a fixture to create a product before the test and clean it up afterward.

import { test, expect } from "../fixtures/api.fixture";
import { createProductPayload } from "../test-data/product.factory";

test("should retrieve a product using fixture", async ({ productsApi }) => {
  const response = await productsApi.getProduct("7");

  expect(response.status()).toBe(200);
});

test("should generate unique product data", async () => {
  const product1 = createProductPayload();
  const product2 = createProductPayload();

  console.log("Product 1:", product1);
  console.log("Product 2:", product2);

  expect(product1.name).not.toBe(product2.name);
});
