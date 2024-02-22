import Address from "../../../@shared/domain/value-object/address";
import Id from "../../../@shared/domain/value-object/id.value-object";
import UseCaseInterface from "../../../@shared/usecase/use-case.interface";
import Invoice from "../../domain/invoice";
import InvoiceItems from "../../domain/invoice-items";
import InvoiceGateway from "../../gateway/invoice.gateway";
import { GenerateInvoiceUseCaseInputDto, GenerateInvoiceUseCaseOutputDto } from "./generate-invoice.dto";

export default class GenerateInvoiceUseCase implements UseCaseInterface {

    private _generateInvoiceRepository: InvoiceGateway;
    constructor(repository: InvoiceGateway) {
        this._generateInvoiceRepository = repository
    }
    async execute(input: GenerateInvoiceUseCaseInputDto): Promise<GenerateInvoiceUseCaseOutputDto> {

        const props = {
            id: new Id(),
            name: input.name,
            document: input.document,
            items: input.items.map((item) => (
                new InvoiceItems({
                    id: new Id(item.id),
                    name: item.name,
                    price: item.price
                })))
        }

        const invoice = new Invoice(props)
        const address = new Address(
            input.street,
            input.number,
            input.complement,
            input.city,
            input.state,
            input.zipCode);

        invoice.setAddress(address);
        await this._generateInvoiceRepository.generate(invoice)

        return {
            id: invoice.id.id,
            name: invoice.name,
            document: invoice.document,
            street: invoice.address.street,
            number: invoice.address.number,
            complement: invoice.address.complement,
            city: invoice.address.city,
            state: invoice.address.state,
            zipCode: invoice.address.zipCode,
            items: invoice.items.map((item) => (
                { id: item.id.id, name: item.name, price: item.price }
            )),
            total: invoice.total()
        }
    }

}