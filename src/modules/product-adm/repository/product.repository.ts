import Id from "../../@shared/domain/value-object/id.value-object";
import Product from "../domain/product.entity";
import ProductGateway from "../gateway/product.gateway";
import { ProductModel } from "./product.model";

export default class ProductRepository implements ProductGateway {
    async add(product: Product): Promise<void> {
        await ProductModel.create({
            id: product.id.id,
            name: product.name,
            description: product.description,
            purchasePrice: product.purchasePrice,
            stock: product.stock,
            createdAt: Date.now,
            updatedAt: Date.now,
        })
    }

    async find(id: string): Promise<Product> {
        try {
            const product = await ProductModel.findOne({
                where: { id: id },
                raw: true,
            });

            if (!product) {
                throw new Error(`Product with id ${id} not found`);
            }

            return new Product({
                id: new Id(product.id),
                name: product.name,
                description: product.description,
                purchasePrice: product.purchasePrice,
                stock: product.stock,
                createdAt: product.createdAt,
                updatedAt: product.updatedAt
            });
        } catch (error) { 
            console.error(error); 
            throw error; 
        }
    }

}