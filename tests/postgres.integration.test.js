const request = require("supertest");
const { createApp } = require("../src/app");
const { createPool, waitForDatabase } = require("../src/db");
const { createItemRepository } = require("../src/repositories/itemRepository");

const hasDatabaseUrl = Boolean(process.env.DATABASE_URL);
const describeIfDatabase = hasDatabaseUrl ? describe : describe.skip;

describeIfDatabase("API with PostgreSQL", () => {
  let pool;
  let app;

  beforeAll(async () => {
    pool = createPool(process.env.DATABASE_URL);
    await waitForDatabase(pool, 15, 1000);

    const itemRepository = createItemRepository(pool);
    await itemRepository.initialize();
    app = createApp({ itemRepository });
  });

  beforeEach(async () => {
    await pool.query("TRUNCATE TABLE items RESTART IDENTITY");
  });

  afterAll(async () => {
    await pool.end();
  });

  test("creates and reads items through PostgreSQL", async () => {
    const createResponse = await request(app).post("/api/v1/items").send({
      name: "PostgreSQL",
      description: "Integration test item"
    });

    const listResponse = await request(app).get("/api/v1/items");
    const singleResponse = await request(app).get("/api/v1/items/1");

    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body).toMatchObject({
      id: 1,
      name: "PostgreSQL",
      description: "Integration test item"
    });
    expect(listResponse.statusCode).toBe(200);
    expect(listResponse.body).toHaveLength(1);
    expect(singleResponse.statusCode).toBe(200);
    expect(singleResponse.body.name).toBe("PostgreSQL");
  });
});
