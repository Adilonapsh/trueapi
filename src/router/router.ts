import { Request, Response, Router } from "express";
import { mapsRoute } from "../maps/maps.controller";
import { cekOngkirRoute } from "../cekongkir/cekongkir.controller";

export const router: Router = Router();

router.get("/", (req: Request, res: Response) => {
    res.send("Apaan Ini Gan ??");
});
router.get("/api", (req: Request, res: Response) => {
    res.send("Welcome to my api!");
});

router.use("/api/maps", mapsRoute);

router.use("/api/cek-ongkir", cekOngkirRoute);
