const { MongoClient } = require("mongodb");

function createClient(connectionString) {
  return new MongoClient(connectionString);
}

function getDatabaseName(connectionString) {
  const url = new URL(connectionString);
  return url.pathname.replace(/^\/+/, "") || "app_db";
}

async function waitForDatabase(client, maxAttempts = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await client.connect();
      await client.db("admin").command({ ping: 1 });
      return;
    } catch (error) {
      if (attempt === maxAttempts) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
}

module.exports = {
  createClient,
  getDatabaseName,
  waitForDatabase
};
