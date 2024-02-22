import { Sequelize } from "sequelize-typescript"
import InvoiceItems from "../domain/invoice-items"
import InvoiceFacadeFactory from "../factory/invoice.facade.factory"
import { InvoiceModel } from "../repository/invoice.model"
import InvoiceRepository from "../repository/invoice.repository"
import GenerateInvoiceUseCase from "../usecase/generate-invoice/generate-invoice.usecase"
import InvoiceFacade from "./invoice.facade"
import { InvoiceItemsModel } from "../repository/invoice-items.model"
import { GenerateInvoiceFacadeInputDto } from "./invoice.facade.interface"
import Id from "../../@shared/domain/value-object/id.value-object"

describe("invoice facade test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        sequelize.addModels([InvoiceModel, InvoiceItemsModel])
        await sequelize.sync()
    })
    it("should generate a invoice", async () => {

        const repository = new InvoiceRepository()
        const generateUsecase = new GenerateInvoiceUseCase(repository)
        const facade = new InvoiceFacade({
            generateUsecase: generateUsecase,
            findUsecase: undefined,
        })

        const input = {
            name: "Nome do Cliente",
            document: "12345678900",
            street: "Rua Exemplo",
            number: "123",
            complement: "Complemento Exemplo",
            city: "Cidade Exemplo",
            state: "Estado Exemplo",
            zipCode: "12345678",
            items: [
                new InvoiceItems({ name: "Item 1", price: 100 }),
                new InvoiceItems({ name: "Item 2", price: 100 })
            ]
        };
        const output = await facade.generate(input)

        const invoice = await InvoiceModel.findByPk(output.id, {
            include: ["items"]
        });

        expect(invoice.dataValues.id).toBeDefined()
        expect(invoice.dataValues.name).toEqual(input.name)
        expect(invoice.dataValues.document).toEqual(input.document)
        expect(invoice.dataValues.street).toEqual(input.street)
        expect(invoice.dataValues.number).toEqual(input.number)
        expect(invoice.dataValues.complement).toEqual(input.complement)
        expect(invoice.dataValues.city).toEqual(input.city)
        expect(invoice.dataValues.state).toEqual(input.state)
        expect(invoice.dataValues.zipCode).toEqual(input.zipCode)
        expect(invoice.dataValues.items[0].name).toEqual(input.items[0].name)
        expect(invoice.dataValues.items[0].price).toEqual(input.items[0].price)
        expect(invoice.dataValues.items[1].name).toEqual(input.items[1].name)
        expect(invoice.dataValues.items[1].price).toEqual(input.items[1].price)
    })

    it("should find a invoice", async () => {

        const facade = InvoiceFacadeFactory.create()

        const input = {
            name: "Nome do Cliente",
            document: "12345678900",
            street: "Rua Exemplo",
            number: "123",
            complement: "Complemento Exemplo",
            city: "Cidade Exemplo",
            state: "Estado Exemplo",
            zipCode: "12345678",
            items: [
                new InvoiceItems({ name: "Item 1", price: 100 }),
                new InvoiceItems({ name: "Item 2", price: 100 })
            ]
        };

        const invoice = await facade.generate(input)
        const output = await facade.find({ id: invoice.id })

        expect(output.id).toBe(invoice.id)
        expect(output.name).toBe(input.name)
        expect(output.document).toBe(input.document)
        expect(output.address.street).toBe(input.street)
        expect(output.address.number).toBe(input.number)
        expect(output.address.complement).toBe(input.complement)
        expect(output.address.city).toBe(input.city)
        expect(output.address.state).toBe(input.state)
        expect(output.address.zipCode).toBe(input.zipCode)
        expect(output.items[0].name).toBe(input.items[0].name)
        expect(output.items[0].price).toBe(input.items[0].price)
        expect(output.items[1].name).toBe(input.items[1].name)
        expect(output.items[1].price).toBe(input.items[1].price)
    })
})