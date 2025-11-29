import { Request, Response, Router } from "express";
import { getDataSets } from "./humdata.service";

export const humdataRoute: Router = Router();

/**
 * @route GET /api/humdata/datasets
 * @description Get datasets from Humdata.
 * @query {string} search - Search term.
 * @query {string} page_size - Number of results per page.
 * @query {string} page - Page number.
 * @access Restricted
 */
humdataRoute.use("/datasets", async (req: Request, res: Response) => {
    try {
        const { search, page_size, page } = await req.query;
        if (search) {
            const datasets = await getDataSets({ search: search as string, page_size: parseInt(page_size as string), page: parseInt(page as string) });
            res.json({
                code: 200,
                message: "Data berhasil diambil",
                data: datasets,
            });
        } else {
            res.json({ code: 422, message: "Invalid Input Parameter" });
        }
    } catch (err: any) {
        res.json({ code: 404, message: err.message });
    }
});