import Address from "../../@shared/domain/value-object/address";
import Id from "../../@shared/domain/value-object/id.value-object";
import Invoice from "../domain/invoice";
import InvoiceItems from "../domain/invoice-items";
import InvoiceGateway from "../gateway/invoice.gateway";
import { InvoiceItemsModel } from "./invoice-items.model";
import { InvoiceModel } from "./invoice.model";

export default class InvoiceRepository implements InvoiceGateway {

    async generate(invoice: Invoice): Promise<void> {
        await InvoiceModel.create(
            {
                id: invoice.id.id,
                name: invoice.name,
                document: invoice.document,
                street: invoice.address.street,
                number: invoice.address.number,
                complement: invoice.address.complement,
                city: invoice.address.city,
                state: invoice.address.state,
                zipCode: invoice.address.zipCode,
                items: invoice.items.map((item) => ({
                    id: new Id().id,
                    name: item.name,
                    price: item.price,
                    createdAt: item.createdAt,
                    updatedAt: item.updatedAt
                })),
                createdAt: invoice.createdAt,
                updatedAt: invoice.updatedAt
            },
            {
                include: [{ model: InvoiceItemsModel }]
            }
        )
    }

    async find(id: string): Promise<Invoice> {

        const invoice = await InvoiceModel.findByPk(id, {
            include: ["items"]
        });

        const address = new Address(
            invoice.dataValues.street,
            invoice.dataValues.number,
            invoice.dataValues.complement,
            invoice.dataValues.city,
            invoice.dataValues.state,
            invoice.dataValues.zipCode
        )
        const result = new Invoice({
            id: new Id(invoice.dataValues.id),
            name: invoice.dataValues.name,
            document: invoice.dataValues.document,
            items: invoice.dataValues.items.map((item: any) => (
                new InvoiceItems({ id: new Id(item.dataValues.id), name: item.dataValues.name, price: item.dataValues.price })
            )),
            createdAt: invoice.dataValues.createdAt,
            updatedAt: invoice.dataValues.updatedAt
        })
        result.setAddress(address);
        return result;
    }
}