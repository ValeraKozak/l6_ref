const { config } = require("./config");
const { createPool, waitForDatabase } = require("./db");
const { createItemRepository } = require("./repositories/itemRepository");
const { createApp } = require("./app");

async function startServer() {
  const pool = createPool(config.databaseUrl);
  const itemRepository = createItemRepository(pool);

  await waitForDatabase(pool);
  await itemRepository.initialize();

  const app = createApp({ itemRepository });
  const server = app.listen(config.appPort, config.appHost, () => {
    console.log(
      `Server is running on http://${config.appHost}:${config.appPort}`
    );
  });

  const shutdown = async () => {
    server.close(async () => {
      await pool.end();
      process.exit(0);
    });
  };

  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

startServer().catch((error) => {
  console.error("Failed to start application:", error);
  process.exit(1);
});
