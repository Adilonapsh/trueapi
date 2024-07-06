import { Request, Response, Router } from "express";
import {
    getLocationToBitwiseAPI,
    getShippingPrises,
    getTrackingDetails,
} from "./cekongkir.service";
import { limiter } from "../middleware/rate-limiter";
import { RatesShipping } from "../interface/interface";

export const cekOngkirRoute: Router = Router();

// cekOngkirRoute.use(limiter);

cekOngkirRoute.use("/location", async (req: Request, res: Response) => {
    try {
        const { input } = await req.query;
        if (input) {
            const data = await getLocationToBitwiseAPI(input?.toString());
            res.setHeader("Access-Control-Allow-Origin", "*"); // Anda bisa mengubah '*' dengan origin yang diizinkan secara spesifik
            res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: data.areas,
            });
        }
        res.json({ code: 422, message: "Invalid Input Parameter" });
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});

cekOngkirRoute.use("/trackings", async (req: Request, res: Response) => {
    try {
        const { receipt_number, courier } = await req.query;
        if (receipt_number && courier) {
            const data = await getTrackingDetails(
                receipt_number?.toString(),
                courier?.toString()
            );
            res.setHeader("Access-Control-Allow-Origin", "*"); // Anda bisa mengubah '*' dengan origin yang diizinkan secara spesifik
            res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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

cekOngkirRoute.use("/rates", async (req: Request, res: Response) => {
    try {
        const {
            origin_area_id,
            destination_area_id,
            couriers,
            weight,
            height,
            length,
            width,
        } = await req.query;
        if (
            origin_area_id &&
            destination_area_id &&
            couriers &&
            weight &&
            height &&
            length &&
            width
        ) {
            const data = await getShippingPrises(
                origin_area_id?.toString(),
                destination_area_id?.toString(),
                couriers?.toString(),
                weight?.toString(),
                height?.toString(),
                length?.toString(),
                width?.toString()
            );
            res.setHeader("Access-Control-Allow-Origin", "*"); // Anda bisa mengubah '*' dengan origin yang diizinkan secara spesifik
            res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
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

cekOngkirRoute.use("/s", async (req: Request, res: Response) => {
    res.send({ code: 200, message: "success" });
});
