
import express, { Request, Response } from "express";
import ProductAdmFacadeFactory from '../../../modules/product-adm/factory/facade.factory';


export const productAdmRoute = express.Router();

productAdmRoute.post("/", async (req: Request, res: Response) => {
    const productadmFace = ProductAdmFacadeFactory.create();

    try {
        const productAdmDto = {
            id: req.body.id,
            name: req.body.name,
            description: req.body.description,
            purchasePrice: req.body.purchasePrice,
            stock: req.body.stock,
        };
        const output = await productadmFace.addProduct(productAdmDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

productAdmRoute.get("/:id", async (req: Request, res: Response) => {
    const clientadmFace = ProductAdmFacadeFactory.create();
    const output = await clientadmFace.checkStock({ productId: req.params.id });

    res.format({
        json: async () => res.send(output)
    });
});