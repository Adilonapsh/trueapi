import { Request, Response, Router } from "express";
import express from "express";
import {
    getAlternativesRoutes,
    getAutoComplete,
    getGeoRss,
} from "./maps.service";

export const mapsRoute: Router = Router();

// mapsRoute.use(limiter);
mapsRoute.use(express.json()); // Add This if using Raw Form Data 

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
        } else {
            res.json({ code: 422, message: "Invalid Input Parameter" });
        }
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
        } else {
            res.json({ code: 422, message: "Invalid Input Parameter" });
        }
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});

mapsRoute.post("/alternatives", async (req: Request, res: Response) => {
    try {
        const { from, to } = req.body;
        if (!from || !to) {
            return res.status(422).json({ code: 422, message: "Invalid Input Parameter" });
        }
        if (from && to) {
            const data = await getAlternativesRoutes(from, to);
            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: data,
            });
        } else {
            res.json({ code: 422, message: "Invalid Input Parameter" });
        }
    } catch (err: any) {
        console.error("Error processing alternatives route:", err);
        res.status(500).json({ code: 500, message: "Internal Server Error" });
    }
});
