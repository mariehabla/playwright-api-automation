/**
 * PURPOSE:
 * Verify that a newly created product can be retrieved
 * and its API response contains the expected data.
 */

import { test, expect } from "../fixtures/product.fixture";

test("should retrieve a newly created product", async ({
  productsApi,
  createdProduct,
}) => {
  // 1. Send GET request
  const response = await productsApi.getProduct(createdProduct.id);

  // 2. Validate HTTP status
  expect(response.status()).toBe(200);

  // 3. Validate response content type
  expect(response.headers()["content-type"]).toContain("application/json");

  // 4. Parse JSON response
  const body = await response.json();

  // 5. Validate response data
  expect(body.id).toBe(createdProduct.id);
  expect(body.name).toBe(createdProduct.name);

  // 6. Validate basic data types
  expect(typeof body.id).toBe("string");
  expect(typeof body.name).toBe("string");
});
