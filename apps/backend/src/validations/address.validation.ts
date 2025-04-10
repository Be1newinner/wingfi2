import { z } from "zod";

export const createAddressSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be between 10 to 15 digits"),
  address1: z.string().min(5, "Address Line 1 is required"),
  address2: z.string().optional(),
  city: z.string().min(2, "City is required"),
  state: z.string().min(2, "State is required"),
  zipcode: z.string().min(4, "Zipcode is required"),
  uid: z.string().regex(/^[a-f\d]{24}$/i, "Invalid User ID"),
});

export const updateAddressSchema = z.object({
  name: z.string().min(2).optional(),
  phone: z
    .string()
    .regex(/^[0-9]{10,15}$/, "Phone must be 10-15 digits")
    .optional(),
  address1: z.string().optional(),
  address2: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  zipcode: z.string().optional(),
});

export const getAddressByUidQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => val > 0, "Page must be a positive number"),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 6))
    .refine((val) => val > 0 && val <= 10, "Limit must be between 1 and 10"),
});

export const getAddressByIdParamsSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid Address ID"),
});

export const deleteAddressByIdParamsSchema = getAddressByIdParamsSchema;

export const updateAddressIDSchema = getAddressByIdParamsSchema;
