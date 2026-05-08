const express = require("express");
const swaggerUi = require("swagger-ui-express");
const { openApiDocument } = require("./openapi");

function validateItemPayload(body) {
  if (!body || typeof body !== "object") {
    return "Request body must be a JSON object";
  }

  if (typeof body.name !== "string" || body.name.trim().length === 0) {
    return "Field 'name' is required";
  }

  if (
    typeof body.description !== "string" ||
    body.description.trim().length === 0
  ) {
    return "Field 'description' is required";
  }

  return null;
}

function createApp({ itemRepository }) {
  const app = express();

  app.use(express.json());
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(openApiDocument));

  app.get("/openapi.json", (_request, response) => {
    response.json(openApiDocument);
  });

  app.get("/health", async (_request, response, next) => {
    try {
      await itemRepository.ping();
      response.json({ status: "ok" });
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/v1/items", async (_request, response, next) => {
    try {
      const items = await itemRepository.listItems();
      response.json(items);
    } catch (error) {
      next(error);
    }
  });

  app.get("/api/v1/items/:itemId", async (request, response, next) => {
    try {
      const item = await itemRepository.getItemById(request.params.itemId);

      if (!item) {
        response.status(404).json({ detail: "Item not found" });
        return;
      }

      response.json(item);
    } catch (error) {
      next(error);
    }
  });

  app.post("/api/v1/items", async (request, response, next) => {
    try {
      const validationError = validateItemPayload(request.body);

      if (validationError) {
        response.status(400).json({ detail: validationError });
        return;
      }

      const item = await itemRepository.createItem({
        name: request.body.name.trim(),
        description: request.body.description.trim()
      });

      response.status(201).json(item);
    } catch (error) {
      next(error);
    }
  });

  app.use((error, _request, response, _next) => {
    response.status(500).json({
      detail: "Internal server error",
      error: error.message
    });
  });

  return app;
}

module.exports = { createApp };
