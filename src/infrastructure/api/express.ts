import express, { Express } from "express"
import { Sequelize } from "sequelize-typescript";
import ClientModel from '../../modules/client-adm/repository/client.model';
import { InvoiceModel } from "../../modules/invoice/repository/invoice.model";
import { ProductModel } from "../../modules/product-adm/repository/product.model";
import TransactionModel from '../../modules/payment/repository/transaction.model';
import { InvoiceItemsModel } from "../../modules/invoice/repository/invoice-items.model";
import { invoiceRoute } from "./routes/invoice.route";
import { clientAdmRoute } from "./routes/client-adm.route";
import { productAdmRoute } from "./routes/product-adm.route";
import { checkoutRoute } from "./routes/checkout.route";
import ProductStorageModel from "../../../src/modules/store-catalog/repository/product.model";


export const app: Express = express();
app.use(express.json());

app.use("/client", clientAdmRoute);
app.use("/product", productAdmRoute);
app.use("/checkout", checkoutRoute);
app.use("/invoice", invoiceRoute);

export let sequelize: Sequelize;

async function setupDb() {
  sequelize = new Sequelize({
    dialect: "sqlite",
    storage: ":memory:",
    logging: false,
  });
  sequelize.addModels([ProductStorageModel, ProductModel, ClientModel, TransactionModel, InvoiceModel, InvoiceItemsModel]);
  await sequelize.sync();
}
setupDb();