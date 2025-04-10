import { z } from "zod";

export const addProductZodSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  title: z.string().min(1, "Title is required"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  mrp: z.number().positive("MRP must be positive").optional(),
  images: z.array(z.string().url()).optional(),
  variants: z.record(z.string(), z.string().url()).optional(),
  stock: z.number().min(0, "Stock must be at least 0").optional(),
});

export const updateProductZodSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  price: z.number().positive("Price must be positive"),
  mrp: z.number().positive("MRP must be positive").optional(),
  variants: z
    .record(z.string(), z.string().url("Must be a valid image URL"))
    .optional(),

  category: z.string().min(1, "Category is required"),
  rating: z.number().min(0).max(5).optional(),
  stock: z.number().min(0, "Stock must be at least 0").optional(),

  addImages: z.array(z.string().url("Must be a valid image URL")).optional(),
  removeImages: z.array(z.string().url("Must be a valid image URL")).optional(),

  addVariants: z
    .array(
      z.object({
        color: z.string().min(1, "Color is required"),
        url: z.string().url("Must be a valid image URL"),
      })
    )
    .optional(),
  removeVariants: z.array(z.string()).optional(),

  updateImageOfVariant: z
    .object({
      color: z.string().min(1, "Color is required"),
      url: z.string().url("Must be a valid image URL"),
    })
    .optional(),
});

export const fetchProductsListZodSchema = z.object({
  limit: z
    .number()
    .min(1, "limit can not be less than 1")
    .max(20, "limit can not be more than 20")
    .optional()
    .default(8),
  page: z.number().min(1, "page can not be less than 1").optional().default(1),
});

export const fetchProductZodSchema = z.object({
  sku: z.string().min(1, "SKU is required"),
});

export const deleteProductZodSchema = fetchProductZodSchema;

export const addListOfProductsZodSchema = z.object({
  body: z.array(addProductZodSchema).min(1, "At least one product is required"),
});

export type addProductZodType = z.infer<typeof addProductZodSchema>;
export type updateProductZodType = z.infer<typeof updateProductZodSchema>;
export type fetchProductsListZodType = z.infer<
  typeof fetchProductsListZodSchema
>;
export type fetchProductZodType = z.infer<typeof fetchProductZodSchema>;
export type deleteProductZodType = z.infer<typeof deleteProductZodSchema>;
export type addListOfProductsZodType = z.infer<
  typeof addListOfProductsZodSchema
>;
