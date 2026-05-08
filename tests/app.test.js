const request = require("supertest");
const { createApp } = require("../src/app");
const {
  createInMemoryItemRepository
} = require("../src/repositories/inMemoryItemRepository");

describe("API", () => {
  function buildApp() {
    const itemRepository = createInMemoryItemRepository();
    return createApp({ itemRepository });
  }

  test("GET /health returns ok status", async () => {
    const app = buildApp();

    const response = await request(app).get("/health");

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ status: "ok" });
  });

  test("POST /api/v1/items creates item and GET /api/v1/items returns it", async () => {
    const app = buildApp();

    const createResponse = await request(app).post("/api/v1/items").send({
      name: "Docker",
      description: "Containerized service"
    });

    const listResponse = await request(app).get("/api/v1/items");

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body.id).toBe(1);
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(listResponse.body[0].name).toBe("Docker");
  });

  test("GET /api/v1/items/:itemId returns 404 for missing item", async () => {
    const app = buildApp();

    const response = await request(app).get("/api/v1/items/999");

    expect(response.statusCode).toBe(404);
    expect(response.body).toEqual({ detail: "Item not found" });
  });
});
