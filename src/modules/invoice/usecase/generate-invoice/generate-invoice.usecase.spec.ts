import GenerateInvoiceUseCase from "./generate-invoice.usecase"

const MockRepository = () => {
    return {
        generate: jest.fn(),
        find: jest.fn()
    }
}

describe("Generate invoice use case unit tests", () => {

    it("should generate a invoice", async () => {

        const repository = MockRepository()
        const usecase = new GenerateInvoiceUseCase(repository)

        const input = {
            name: "Document 1",
            document: "13",
            street: "street",
            number: "99",
            complement: "complement",
            city: "city",
            state: "st",
            zipCode: "123",
            items: [
                { id: '1', name: 'Item 1', price: 12 },
                { id: '2', name: 'Item 2', price: 34.12 }
            ]
        }

        const result = await usecase.execute(input)
        expect(repository.generate).toHaveBeenCalled()
        expect(result.id).toBeDefined()
        expect(result.name).toEqual(input.name)
        expect(result.document).toEqual(input.document)
        expect(result.street).toEqual(input.street)
        expect(result.number).toEqual(input.number)
        expect(result.complement).toEqual(input.complement)
        expect(result.city).toEqual(input.city)
        expect(result.state).toEqual(input.state)
        expect(result.zipCode).toEqual(input.zipCode)
        expect(result.items.length).toEqual(input.items.length)
        input.items.forEach((item, index) => {
            expect(result.items[index]).toEqual({
                id: item.id,
                name: item.name,
                price: item.price
            })
        })
    })
})