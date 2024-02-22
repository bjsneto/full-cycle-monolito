import Address from '../../../@shared/domain/value-object/address'
import Id from '../../../@shared/domain/value-object/id.value-object'
import Invoice from '../../domain/invoice'
import InvoiceItems from '../../domain/invoice-items'
import FindInvoiceUseCase from './find-invoice.usecase'

const item1 = new InvoiceItems({
  name: 'Item 1',
  price: 10
})

const item2 = new InvoiceItems({
  name: 'Item 2',
  price: 20
})

const invoice = new Invoice({
  id: new Id('123'),
  name: 'Invoice 1',
  document: '123',
  items: [item1, item2]
})

const address = new Address("Stree 1", "1", "Complement 1", "City", "ST", "12")

invoice.setAddress(address)

const MockRepository = () => {
  return {
    find: jest.fn().mockReturnValue(Promise.resolve(invoice)),
    generate: jest.fn()
  }
}

describe('find invoice use case unit test', () => {
  it('should find a invoice', async () => {
    const repository = MockRepository()
    const usecase = new FindInvoiceUseCase(repository)

    const usecaseResult = await usecase.execute({ id: invoice.id.id })

    expect(usecaseResult.id).toBe(invoice.id.id)
    expect(usecaseResult.name).toBe(invoice.name)
    expect(usecaseResult.document).toBe(invoice.document)
    expect(usecaseResult.address.street).toBe(invoice.address.street)
    expect(usecaseResult.address.number).toBe(invoice.address.number)
    expect(usecaseResult.address.complement).toBe(invoice.address.complement)
    expect(usecaseResult.address.city).toBe(invoice.address.city)
    expect(usecaseResult.address.state).toBe(invoice.address.state)
    expect(usecaseResult.address.zipCode).toBe(invoice.address.zipCode)
    expect(usecaseResult.total).toBe(invoice.total())
    usecaseResult.items.forEach((item: any, index: any) => {
      expect(item.name).toEqual(invoice.items[index].name)
      expect(item.price).toEqual(invoice.items[index].price)
    })
    expect(usecaseResult.items.length).toBe(invoice.items.length)
  })
})