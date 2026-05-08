const request = require("supertest");
const { createApp } = require("../src/app");
const { createClient, getDatabaseName, waitForDatabase } = require("../src/db");
const { createItemRepository } = require("../src/repositories/itemRepository");

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIfDatabase = hasDatabaseUrl ? describe : describe.skip;

describeIfDatabase("API with MongoDB", () => {
  let client;
  let app;
  let itemRepository;

  beforeAll(async () => {
    client = createClient(process.env.DATABASE_URL);
    await waitForDatabase(client, 15, 1000);

    const database = client.db(getDatabaseName(process.env.DATABASE_URL));
    itemRepository = createItemRepository(database);
    await itemRepository.initialize();
    app = createApp({ itemRepository });
  });

  beforeEach(async () => {
    await itemRepository.clear();
  });

  afterAll(async () => {
    await client.close();
  });

  test("creates and reads items through MongoDB", async () => {
    const createResponse = await request(app).post("/api/v1/items").send({
      name: "MongoDB",
      description: "Integration test item"
    });

    const itemId = createResponse.body.id;
    const listResponse = await request(app).get("/api/v1/items");
    const singleResponse = await request(app).get(`/api/v1/items/${itemId}`);

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body).toMatchObject({
      id: expect.any(String),
      name: "MongoDB",
      description: "Integration test item"
    });
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(singleResponse.statusCode).toBe(200);
    expect(singleResponse.body.name).toBe("MongoDB");
  });
});
