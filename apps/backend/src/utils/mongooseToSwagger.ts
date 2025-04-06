/* eslint-disable @typescript-eslint/no-explicit-any */
import { Schema, Model } from "mongoose";

/**
 * Converts a Mongoose model to a Swagger schema
 * @param model - The Mongoose model
 * @returns A Swagger schema definition
 */
export function mongooseModelToSwagger<T>(model: Model<T>): any[] {
  const modelName = model.modelName;
  const schema: Schema<T> = model.schema;

  const swaggerSchema: {
    type: "object";
    properties: Record<string, any>;
    required?: string[];
  } = {
    type: "object",
    properties: {},
  };

  // Loop through schema fields
  Object.entries(schema.paths).forEach(([key, path]) => {
    const schemaType = path as any;

    // Define Mongoose type to Swagger type mapping
    let swaggerType: string | undefined;
    switch (schemaType.instance) {
      case "String":
        swaggerType = "string";
        break;
      case "Number":
        swaggerType = "number";
        break;
      case "Boolean":
        swaggerType = "boolean";
        break;
      case "Date":
        swaggerType = "string";
        swaggerSchema.properties[key] = {
          type: swaggerType,
          format: "date-time",
        };
        return;
      case "Array":
        swaggerType = "array";
        swaggerSchema.properties[key] = {
          type: "array",
          items: { type: "string" }, // Default to string array (adjust dynamically)
        };
        return;
      case "ObjectId":
        swaggerType = "string"; // MongoDB ObjectId is stored as a string
        break;
      case "Embedded":
        // Handle embedded (nested) objects
        const embeddedSchema = schemaType.schema as Schema;
        if (embeddedSchema) {
          swaggerSchema.properties[key] = {
            type: "object",
            properties: mongooseModelToSwagger({
              modelName: key,
              schema: embeddedSchema,
            } as Model<any>)[1].properties,
          };
        }
        return;
    }

    if (swaggerType) {
      swaggerSchema.properties[key] = { type: swaggerType };
    }

    // ✅ Handle required fields correctly
    if (schema.requiredPaths().includes(key)) {
      swaggerSchema.required = swaggerSchema.required || [];
      swaggerSchema.required.push(key);
    }
  });

  return [modelName, swaggerSchema];
}
