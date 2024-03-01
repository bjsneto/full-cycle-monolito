import { app, sequelize } from "../express";
import request from "supertest";

describe("E2E test for client adm", () => {
    beforeEach(async () => {
        await sequelize.sync({ force: true });
    });

    afterAll(async () => {
        await sequelize.close();
    });

    it("should create a client adm", async () => {
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

        const response = await request(app)
            .get(`/client/${client.body.id}`).send();

        expect(response.status).toBe(200);
        expect(response.body.name).toBe("client");
        expect(response.body.email).toBe("fullcycle@mail.com");
        expect(response.body.document).toEqual("1234");
        expect(response.body.street).toBe("street");
        expect(response.body.number).toBe("132");
        expect(response.body.complement).toBe("complement");
        expect(response.body.city).toBe("city");
        expect(response.body.state).toBe("state");
        expect(response.body.zipCode).toBe("123");
    });
});