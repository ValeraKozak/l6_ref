function createInMemoryItemRepository() {
  const items = [];
  let nextId = 1;

  return {
    async ping() {
      return true;
    },

    async initialize() {
      return true;
    },

    async listItems() {
      return items;
    },

    async getItemById(id) {
      return items.find((item) => item.id === id) || null;
    },

    async createItem({ name, description }) {
      const item = {
        id: nextId,
        name,
        description
      };

      nextId += 1;
      items.push(item);
      return item;
    }
  };
}

module.exports = { createInMemoryItemRepository };
