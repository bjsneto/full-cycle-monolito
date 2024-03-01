import ProductStorageModel from "../../../modules/store-catalog/repository/product.model";
import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for checkout", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should checkout", async () => {

        const client = await request(app)
            .post("/client")
            .send({
                name: "client",
                email: "fullcycle@mail.com",
                document: "1234",
                address: {
                    street: "street",
                    number: "132",
                    complement: "complement",
                    city: "city",
                    state: "state",
                    zipCode: "123",
                },
            });

        const productA = await request(app)
            .post("/product")
            .send({
                id: "1",
                name: "Product 1",
                description: "Product",
                purchasePrice: 100,
                stock: 10,
            },
            );

        const productB = await request(app)
            .post("/product")
            .send({
                id: "2",
                name: "Product 2",
                description: "Product",
                purchasePrice: 200,
                stock: 4,
            },
            );

        await ProductStorageModel.create({
            id: "1",
            name: "Product 1",
            description: "Product",
            salesPrice: 100,
        })

        await ProductStorageModel.create({
            id: "2",
            name: "Product 2",
            description: "Product",
            salesPrice: 200,
        })

        const order = await request(app)
            .post("/checkout")
            .send({
                clientId: client.body.id,
                products: [
                    {
                        productId: productA.body.id,
                    },
                    {
                        productId: productB.body.id,
                    },
                ],
            },
            );

        expect(order.body.total).toBe(300);
        expect(order.body.products).toStrictEqual([{ productId: "1" }, { productId: "2" }]);

    });
});