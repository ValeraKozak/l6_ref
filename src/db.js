const { Pool } = require("pg");

function createPool(connectionString) {
  return new Pool({
    connectionString
  });
}

async function waitForDatabase(pool, maxAttempts = 10, delayMs = 2000) {
  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      await pool.query("SELECT 1");
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
  createPool,
  waitForDatabase
};
