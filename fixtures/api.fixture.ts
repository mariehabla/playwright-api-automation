//Custom Playwright fixture that provides a reusable ProductsApi client to tests.
//It creates the ProductsApi instance and makes it available to tests via the test context.

import { test as base, expect } from "@playwright/test";

import { ProductsApi } from "../clients/products.api";

type ApiFixtures = {
  productsApi: ProductsApi;
};

export const test = base.extend<ApiFixtures>({
  productsApi: async ({ request }, use) => {
    const productsApi = new ProductsApi(request);

    await use(productsApi);
  },
});

export { expect };
