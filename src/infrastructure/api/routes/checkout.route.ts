import express, { Request, Response } from "express";
import StoreCatalogFacadeFactory from '../../../modules/store-catalog/factory/facade.factory';
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';
import PaymentFacadeFactory from '../../../modules/payment/factory/payment.facade.factory';
import ClientAdmFacadeFactory from "../../../modules/client-adm/factory/client-adm.facade.factory";
import InvoiceFacadeFactory from "../../../modules/invoice/factory/invoice.facade.factory";
import PlaceOrderUseCase from "../../../modules/checkout/usecase/place-order/place-order.usecase";

export const checkoutRoute = express.Router();

checkoutRoute.post("/", async (req: Request, res: Response) => {
    const clientFacade = ClientAdmFacadeFactory.create();
    const catalogFacade = StoreCatalogFacadeFactory.create();
    const productFacade = ProductAdmFacadeFactory.create();
    const mockCheckoutRepository = {
        addOrder: jest.fn(),
        findOrder: jest.fn(),
    };
    const invoiceFacade = InvoiceFacadeFactory.create();
    const paymentFacade = PaymentFacadeFactory.create();

    const orderUseCase = new PlaceOrderUseCase(productFacade,
        clientFacade,
        catalogFacade,
        mockCheckoutRepository,
        invoiceFacade,
        paymentFacade);

    try {
        const orderDto = {
            clientId: req.body.clientId,
            products: req.body.products,
        };
        const output = await orderUseCase.execute(orderDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});