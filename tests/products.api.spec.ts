// Import the necessary modules from Playwright.

import { test, expect } from "@playwright/test";

test("GET - should retrieve a product successfully", async ({ request }) => {
  // Step 1: Send GET request
  const response = await request.get("/objects/7");

  // Step 2: Validate HTTP status
  expect(response.status()).toBe(200);

  // Step 3: Convert JSON response into a JS object
  const responseBody = await response.json();

  // Step 4: Validate response data
  expect(responseBody.id).toBe("7");
  expect(responseBody.name).toBe("Apple MacBook Pro 16");

  // Step 5: Print response for learning/debugging
  console.log(responseBody);
});
