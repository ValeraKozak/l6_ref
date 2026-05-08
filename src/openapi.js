const openApiDocument = {
  openapi: "3.0.3",
  info: {
    title: "Lab 6 JavaScript API",
    version: "1.0.0",
    description: "REST API for laboratory work 6 on DevOps, Docker, and CI/CD."
  },
  servers: [
    {
      url: "http://localhost:8000"
    }
  ],
  paths: {
    "/health": {
      get: {
        summary: "Check service health",
        responses: {
          200: {
            description: "Service is available"
          }
        }
      }
    },
    "/api/v1/items": {
      get: {
        summary: "Get all items",
        responses: {
          200: {
            description: "List of items"
          }
        }
      },
      post: {
        summary: "Create a new item",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                type: "object",
                required: ["name", "description"],
                properties: {
                  name: {
                    type: "string",
                    example: "Docker"
                  },
                  description: {
                    type: "string",
                    example: "Containerized service"
                  }
                }
              }
            }
          }
        },
        responses: {
          201: {
            description: "Created item"
          }
        }
      }
    },
    "/api/v1/items/{itemId}": {
      get: {
        summary: "Get item by id",
        parameters: [
          {
            name: "itemId",
            in: "path",
            required: true,
            schema: {
              type: "integer"
            }
          }
        ],
        responses: {
          200: {
            description: "Requested item"
          },
          404: {
            description: "Item not found"
          }
        }
      }
    }
  }
};

module.exports = { openApiDocument };
