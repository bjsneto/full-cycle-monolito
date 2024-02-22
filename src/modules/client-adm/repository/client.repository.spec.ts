import { Sequelize } from "sequelize-typescript"
import { ClientModel } from "./client.model"
import ClientRepository from "./client.repository"
import Client from "../domain/client.entity"
import Id from "../../@shared/domain/value-object/id.value-object"

describe("Client Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([ClientModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should create a client", async () => {

        const client = new Client({
            id: new Id("1"),
            name: "Lucian",
            email: "lucian@teste.com",
            document: "1234-5678",
        })

        const repository = new ClientRepository()
        await repository.add(client)

        const clientDb = await ClientModel.findOne({ where: { id: "1" }, raw: true })

        expect(clientDb).toBeDefined()
        expect(clientDb.id).toEqual(client.id.id)
        expect(clientDb.name).toEqual(client.name)
        expect(clientDb.email).toEqual(client.email)
        expect(clientDb.document).toEqual(client.document)

        const createdAt = new Date(clientDb.createdAt);
        const updatedAt = new Date(clientDb.updatedAt);
        
        expect(createdAt).toStrictEqual(new Date(client.createdAt));
        expect(updatedAt).toStrictEqual(new Date(client.updatedAt));

    })

    it("should find a client", async () => {

        const client = await ClientModel.create({
            id: '1',
            name: 'Lucian',
            email: 'lucian@123.com',
            document: "1234-5678",
            createdAt: new Date(),
            updatedAt: new Date()
        }, { raw: true })

        const repository = new ClientRepository()
        const result = await repository.find(client.dataValues.id)

        expect(result.id.id).toEqual(client.dataValues.id)
        expect(result.name).toEqual(client.dataValues.name)
        expect(result.email).toEqual(client.dataValues.email)
        const createdAt = new Date(result.createdAt);
        const updatedAt = new Date(result.updatedAt);
        
        expect(createdAt).toStrictEqual(new Date(client.dataValues.createdAt));
        expect(updatedAt).toStrictEqual(new Date(client.dataValues.updatedAt));
    })
})