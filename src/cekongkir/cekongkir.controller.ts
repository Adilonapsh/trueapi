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

/**
 * @route GET /api/cek-ongkir/location
 * @description Get location details from Bitwise API.
 * @query {string} input - The location search input.
 * @access Restricted
 */
cekOngkirRoute.use("/location", async (req: Request, res: Response) => {
    try {
        const { input } = await req.query;
        if (input) {
            const data = await getLocationToBitwiseAPI(input?.toString());
            // Headers handled by global CORS middleware
            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: data.areas,
            });
        } else {
            res.json({ code: 422, message: "Invalid Input Parameter" });
        }
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});

/**
 * @route GET /api/cek-ongkir/trackings
 * @description Track shipping details.
 * @query {string} receipt_number - The receipt number.
 * @query {string} courier - The courier name.
 * @access Restricted
 */
cekOngkirRoute.use("/trackings", async (req: Request, res: Response) => {
    try {
        const { receipt_number, courier } = await req.query;
        if (receipt_number && courier) {
            const data = await getTrackingDetails(
                receipt_number?.toString(),
                courier?.toString()
            );
            // Headers handled by global CORS middleware
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

/**
 * @route GET /api/cek-ongkir/rates
 * @description Get shipping rates.
 * @query {string} origin_area_id - Origin area ID.
 * @query {string} destination_area_id - Destination area ID.
 * @query {string} couriers - List of couriers.
 * @query {string} weight - Weight of the package.
 * @query {string} height - Height of the package.
 * @query {string} length - Length of the package.
 * @query {string} width - Width of the package.
 * @access Restricted
 */
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
            // Headers handled by global CORS middleware
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

/**
 * @route GET /api/cek-ongkir/s
 * @description Simple success check endpoint.
 * @access Restricted
 */
cekOngkirRoute.use("/s", async (req: Request, res: Response) => {
    res.send({ code: 200, message: "success" });
});
