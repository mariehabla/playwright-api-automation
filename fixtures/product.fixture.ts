// Fixture that creates a product before a test and attempts to delete it afterward.
// It creates a product using the ProductsApi client and provides the created product to the test via the test context.
// After the test completes, it attempts to delete the product to clean up.

import { test as base, expect } from "./api.fixture";
import { createProductPayload } from "../test-data/product.factory";

type CreatedProduct = {
  id: string;
  name: string;
};

type ProductFixtures = {
  createdProduct: CreatedProduct;
};

// Register the custom Playwright fixture that creates a product before a test and attempts to delete it afterward. The created product is provided to the test via the test context.
export const test = base.extend<ProductFixtures>({
  createdProduct: async ({ productsApi }, use) => {
    // 1. Generate test data
    const payload = createProductPayload();

    // 2. Create product via POST
    const response = await productsApi.createProduct(payload);
    expect(response.ok()).toBeTruthy();

    // 3. Capture created product
    const product = (await response.json()) as CreatedProduct;
    expect(product.id).toBeTruthy();

    // 4. Provide product to the test
    try {
      await use(product);
    } finally {
      // 5. Cleanup after the test
      const deleteResponse = await productsApi.deleteProduct(product.id);
      expect(deleteResponse.ok()).toBeTruthy();
    }
  },
});

export { expect };
