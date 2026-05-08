function createItemRepository(pool) {
  return {
    async ping() {
      await pool.query("SELECT 1");
    },

    async initialize() {
      await pool.query(`
        CREATE TABLE IF NOT EXISTS items (
          id SERIAL PRIMARY KEY,
          name VARCHAR(100) NOT NULL,
          description VARCHAR(255) NOT NULL
        )
      `);
    },

    async listItems() {
      const result = await pool.query(
        "SELECT id, name, description FROM items ORDER BY id"
      );
      return result.rows;
    },

    async getItemById(id) {
      const result = await pool.query(
        "SELECT id, name, description FROM items WHERE id = $1",
        [id]
      );
      return result.rows[0] || null;
    },

    async createItem({ name, description }) {
      const result = await pool.query(
        `
          INSERT INTO items (name, description)
          VALUES ($1, $2)
          RETURNING id, name, description
        `,
        [name, description]
      );
      return result.rows[0];
    }
  };
}

module.exports = { createItemRepository };
