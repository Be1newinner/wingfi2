// import { ProductModel } from "../../src/models/products.model.ts";

import request from "supertest";
import { app } from "../../src/index.ts";

import {
  connectTestDB,
  closeTestDB,
  clearTestDB,
} from "../../src/config/testDBSetup.ts";

beforeAll(async () => {
  await connectTestDB();
});

afterEach(async () => {
  await clearTestDB();
});

afterAll(async () => {
  await closeTestDB();
});

const productObject = {
  name: "Test Product",
  category: "Electronics",
  price: 1000,
  mrp: 1200,
  stock: 50,
  sku: "TEST123",
  description: "A sample product",
  rating: 4.5,
};
const newProductObject = {
  name: "New Product",
  category: "Books",
  price: 500,
  mrp: 700,
  stock: 20,
  sku: "BOOK123",
  description: "A test book",
};

const updatingProduct = { ...newProductObject, sku: productObject.sku };

describe("Product Routes Api Tests", () => {
  // let product;

  // beforeEach(async () => {
  //   product = await ProductModel.create(productObject);
  // });

  // GET /products/ => GetListOfProducts() = Fetch All Products
  it("Should fetch all products", async () => {
    const res = await request(app).get("/products/");
    expect(res.statusCode).toBe(200);
    expect(res.body.data.length).toBe(1);
    expect(res.body.data[0]).toHaveProperty("sku", productObject.sku);
  });

  // GET /products/ => GetSingleProduct() = Fetch Single Product by SKU
  it("Should fetch single product", async () => {
    const res = await request(app).get(`/products/${productObject.sku}`);
    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("sku", productObject.sku);
  });

  // Error : GET /products/ => GetSingleProduct() = 404 Product not found
  it("Should fetch single product", async () => {
    const res = await request(app).get(`/products/UNKNOWN-SKU`);
    expect(res.statusCode).toBe(404);
  });

  // POST /products/ => AddSingleProductController() = Add Single Product
  it("should add single product", async () => {
    const res = await request(app).post("/products/").send(newProductObject);

    expect(res.statusCode).toBe(201);
    expect(res.body.data).toHaveProperty("sku", newProductObject.sku);
  });

  // POST /products/bulk => AddListOfProductsController() = Add Multiple Products
  it("should add multiple products", async () => {});

  // PATCH /products/ => UpdateSingleProductController() = Update Single Product by SKU
  it("should Update Single Product", async () => {
    const res = await request(app).patch("/products/").send(updatingProduct);

    expect(res.statusCode).toBe(200);
    expect(res.body.data).toHaveProperty("sku", updatingProduct.sku);
  });

  // Error: PATCH /products/ => UpdateSingleProductController() = product sku not found
  it("should throw 404 error when sku not found", async () => {
    const res = await request(app).patch("/products/").send(newProductObject);
    expect(res.statusCode).toBe(404);
  });
});
