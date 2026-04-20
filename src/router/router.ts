import { Request, Response, Router } from "express";
import { mapsRoute } from "../maps/maps.controller";
import { cekOngkirRoute } from "../cekongkir/cekongkir.controller";
import cors from 'cors';
import { humdataRoute } from "../humdata/humdata.controller";
import { apiAuth } from "../middleware/api-auth";
import path from 'path';

const allowedOrigins = [
    'https://truenapsh.my.id',
    'https://trumap.web.id',
    'http://truenapsh.my.id',
    'http://trumap.web.id'
];

const corsOption = {
    credentials: true,
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    }
}

export const router: Router = Router();

router.use(cors(corsOption));
// router.use(originCheck);
// router.use(apiAuth);

/**
 * @route GET /
 * @description Root endpoint to verify server status.
 * @access Restricted
 */
router.get("/", (req: Request, res: Response) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
});

/**
 * @route GET /api
 * @description API welcome endpoint.
 * @access Restricted
 */
router.get("/api", (req: Request, res: Response) => {
    res.json({
        status: "success",
        message: "Welcome to my API!",
        list: [
            "/api/maps",
            "/api/cek-ongkir",
            "/api/humdata"
        ]
    });
});

router.use("/api/maps", mapsRoute);

router.use("/api/cek-ongkir", cekOngkirRoute);
router.use("/api/humdata", humdataRoute);