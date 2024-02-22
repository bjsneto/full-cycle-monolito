import { Sequelize } from "sequelize-typescript"
import Id from "../../@shared/domain/value-object/id.value-object"
import InvoiceRepository from "./invoice.repository"
import Address from "../../@shared/domain/value-object/address"
import InvoiceItems from "../domain/invoice-items"
import Invoice from "../domain/invoice"
import { InvoiceModel } from "./invoice.model"
import { InvoiceItemsModel } from "./invoice-items.model"

describe("Invoice Repository test", () => {

    let sequelize: Sequelize

    beforeEach(async () => {
        sequelize = new Sequelize({
            dialect: 'sqlite',
            storage: ':memory:',
            logging: false,
            sync: { force: true }
        })

        await sequelize.addModels([InvoiceItemsModel, InvoiceModel])
        await sequelize.sync()
    })

    afterEach(async () => {
        await sequelize.close()
    })

    it("should generate a invoice", async () => {
        const item1 = new InvoiceItems({
            name: 'Item 1',
            price: 50
        });

        const item2 = new InvoiceItems({
            name: 'Item 2',
            price: 80
        });

        const invoice = new Invoice({
            id: new Id('123'),
            name: 'Invoice 1',
            document: '12345',
            items: [item1, item2]
        });

        const address = new Address("street", "1", "complement", "city", "st", "12");
        invoice.setAddress(address);

        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        const invoiceDb = await InvoiceModel.findByPk(invoice.id.id, {
            include: ["items"]
        });

        expect(invoiceDb.dataValues.id).toEqual(invoice.id.id)
        expect(invoiceDb.dataValues.name).toEqual(invoice.name)
        expect(invoiceDb.dataValues.document).toEqual(invoice.document)
        expect(invoiceDb.dataValues.items.length).toEqual(invoice.items.length)
        invoiceDb.dataValues.items.forEach((item: any, index: any) => {
            expect(item.name).toEqual(invoice.items[index].name)
            expect(item.price).toEqual(invoice.items[index].price)
        })
        expect(invoiceDb.dataValues.street).toEqual(invoice.address.street)
        expect(invoiceDb.dataValues.number).toEqual(invoice.address.number)
        expect(invoiceDb.dataValues.complement).toEqual(invoice.address.complement)
        expect(invoiceDb.dataValues.city).toEqual(invoice.address.city)
        expect(invoiceDb.dataValues.state).toEqual(invoice.address.state)
        expect(invoiceDb.dataValues.zipCode).toEqual(invoice.address.zipCode)
        expect(invoiceDb.dataValues.items.reduce((total: any, item: any) => total + item.price, 0)).toEqual(invoice.total())
    });

    it("should find a invoice", async () => {

        const item1 = new InvoiceItems({
            name: 'Item 1',
            price: 50
        });

        const item2 = new InvoiceItems({
            name: 'Item 2',
            price: 80
        });

        const invoice = new Invoice({
            id: new Id('123'),
            name: 'Invoice 1',
            document: '123',
            items: [item1, item2]
        });

        const address = new Address("street", "1", "complement", "city", "ct", "123");
        invoice.setAddress(address);

        const repository = new InvoiceRepository()
        await repository.generate(invoice)

        const result = await repository.find(invoice.id.id)
        expect(result.id.id).toEqual(invoice.id.id)
        expect(result.name).toEqual(invoice.name)
        expect(result.document).toEqual(invoice.document)
        expect(result.items.length).toEqual(invoice.items.length)
        result.items.forEach((item, index) => {
            expect(item.name).toEqual(invoice.items[index].name)
            expect(item.price).toEqual(invoice.items[index].price)
        })
        expect(result.address).toEqual(invoice.address)
        expect(new Date(result.createdAt).getDate()).toEqual(new Date(invoice.createdAt).getDate())
        expect(result.total()).toEqual(invoice.total())

    });
})