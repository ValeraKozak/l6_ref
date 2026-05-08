const { ObjectId } = require("mongodb");

function normalizeItem(document) {
  return {
    id: String(document._id),
    name: document.name,
    description: document.description
  };
}

function createItemRepository(database) {
  const collection = database.collection("items");

  return {
    async ping() {
      await database.command({ ping: 1 });
    },

    async initialize() {
      await collection.createIndex({ name: 1 });
    },

    async clear() {
      await collection.deleteMany({});
    },

    async listItems() {
      const documents = await collection
        .find({})
        .sort({ _id: 1 })
        .toArray();

      return documents.map(normalizeItem);
    },

    async getItemById(id) {
      if (!ObjectId.isValid(id)) {
        return null;
      }

      const document = await collection.findOne({
        _id: new ObjectId(id)
      });

      return document ? normalizeItem(document) : null;
    },

    async createItem({ name, description }) {
      const result = await collection.insertOne({ name, description });

      return {
        id: String(result.insertedId),
        name,
        description
      };
    }
  };
}

module.exports = { createItemRepository };
