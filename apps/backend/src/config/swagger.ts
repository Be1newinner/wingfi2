import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { Express } from "express";
import { mongooseModelToSwagger } from "../utils/mongooseToSwagger.ts";
import AllMongooseModels from "../models/index.ts";
import { Model } from "mongoose";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const AllSwaggerSchemas: Record<string, Record<string, any>> = {};

Object.values(AllMongooseModels)?.forEach((model) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tempModel = mongooseModelToSwagger(model as Model<any>);
  AllSwaggerSchemas[tempModel[0]] = tempModel[1];
});

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Blog API",
      version: "1.0.0",
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: AllSwaggerSchemas,
    },
  },
  apis: ["./src/routes/*.ts", "./src/controllers/*.ts"],
};

const swaggerSpec = swaggerJSDoc(options);

export const setupSwagger = (app: Express) => {
  app.use("/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
};
