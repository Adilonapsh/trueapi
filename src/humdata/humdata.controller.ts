import { Request, Response, Router } from "express";
import { getDataSets } from "./humdata.service";

export const humdataRoute: Router = Router();

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