import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client adm", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a product", async () => {

        const product1 = await request(app)
            .post("/product")
            .send({
                id: "1",
                name: "Product 1",
                description: "description 2",
                purchasePrice: 10,
                stock: 10,
            },
            );

        const product2 = await request(app)
            .post("/product")
            .send({
                id: "2",
                name: "Product 2",
                description: "description 2",
                purchasePrice: 50,
                stock: 4,
            },
            );

        const response1 = await request(app).get(`/product/${product1.body.id}`).send()
        const response2 = await request(app).get(`/product/${product2.body.id}`).send()

        expect(product1.status).toBe(200);
        expect(product2.status).toBe(200);

        expect(response1.body.productId).toEqual(product1.body.id);
        expect(response1.body.stock).toEqual(10);
        expect(response2.body.productId).toEqual(product2.body.id);
        expect(response2.body.stock).toEqual(4);
    });
});