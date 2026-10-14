// Generates reusable product test payloads with unique names using randomUUID().

import { randomUUID } from "node:crypto";

export function createProductPayload() {
  const name = `MARIEHZ Product ${randomUUID()}`;
  console.log("Generated product name:", name);

  return {
    name,
    data: {
      price: 1500,
      color: "Black",
    },
  };
}
