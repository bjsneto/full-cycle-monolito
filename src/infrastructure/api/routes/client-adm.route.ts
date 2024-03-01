import express, { Request, Response } from "express";
import ClientAdmFacadeFactory from '../../../modules/client-adm/factory/client-adm.facade.factory';

export const clientAdmRoute = express.Router();

clientAdmRoute.post("/", async (req: Request, res: Response) => {
    const clientadmFace = ClientAdmFacadeFactory.create();
    try {
        const clientAdmDto = {
            name: req.body.name,
            email: req.body.email,
            document: req.body.document,
            street: req.body.address.street,
            number: req.body.address.number,
            complement: req.body.address.complement,
            city: req.body.address.city,
            state: req.body.address.state,
            zipCode: req.body.address.zipCode,
        };
        const output = await clientadmFace.add(clientAdmDto);
        res.send(output);
    } catch (err) {
        res.status(500).send(err);
    }
});

clientAdmRoute.get("/:id", async (req: Request, res: Response) => {
    const clientadmFace = ClientAdmFacadeFactory.create();
    const output = await clientadmFace.find({ id: req.params.id });

    res.format({
        json: async () => res.send(output)
    });
});