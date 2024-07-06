import { Request, Response, Router } from "express";
import {
    getAlternativesRoutes,
    getAutoComplete,
    getGeoRss,
} from "./maps.service";

export const mapsRoute: Router = Router();

// mapsRoute.use(limiter);

mapsRoute.use("/location", async (req: Request, res: Response) => {
    try {
        const { search, lang, extent } = await req.query;
        if (search) {
            const data = await getAutoComplete(
                search?.toString(),
                lang?.toString(),
                extent?.toString()
            );

            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: data,
            });
        }
        res.json({ code: 422, message: "Invalid Input Parameter" });
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});
mapsRoute.use("/alert", async (req: Request, res: Response) => {
    try {
        const { tipe, extent } = await req.query;
        if (tipe) {
            const data = await getGeoRss(extent?.toString(), tipe?.toString());
            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: data,
            });
        }
        res.json({ code: 422, message: "Invalid Input Parameter" });
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});
mapsRoute.use("/alternatives", async (req: Request, res: Response) => {
    try {
        const { from, to } = await req.query;
        if (from && to) {
            const data = await getAlternativesRoutes(
                from.toString(),
                to?.toString()
            );

            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: data,
            });
        }
        res.json({ code: 422, message: "Invalid Input Parameter" });
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});
