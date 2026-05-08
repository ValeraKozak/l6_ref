const { config } = require("./config");
const { createClient, getDatabaseName, waitForDatabase } = require("./db");
const { createItemRepository } = require("./repositories/itemRepository");
const { createApp } = require("./app");

async function startServer() {
  const client = createClient(config.databaseUrl);

  await waitForDatabase(client);

  const database = client.db(getDatabaseName(config.databaseUrl));
  const itemRepository = createItemRepository(database);

  await itemRepository.initialize();

  const app = createApp({ itemRepository });
  const server = app.listen(config.appPort, config.appHost, () => {
    console.log(
      `Server is running on http://${config.appHost}:${config.appPort}`
    );
  });

  const shutdown = async () => {
    server.close(async () => {
      await client.close();
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
