import axios from "axios";
import { data } from "cheerio/dist/commonjs/api/attributes";
import dotenv from "dotenv";
import puppeteer from "puppeteer";
import googleMapsScraper from "./google-maps-scraper";

dotenv.config();
const baseUrl: string = "https://www.waze.com/live-map/api";

// const headers = {
//     Accept: "application/json",
// };

const getAutoComplete = async (
    search?: string,
    lang?: string,
    extent?: string
) => {
    const response = await axios.get(baseUrl + "/autocomplete/", {
        params: {
            q: search ? search : "jakarta",
            v: extent
                ? extent
                : "-6.1788702,106.7748355;-6.16816098,106.7953491",
            lang: lang ? lang : "id-ID",
            exp: "8,10,12",
            "geo-env": "row",
        },
        headers: {
            "Cookie": "recaptcha-ca-t=ARbRLZ29PmdBLL_60GPf47GWoVZNgisEt1MM16iYq28I-1_PnriVGkM8YPYOIznivXKPEI3-VTGYNYO19CODC7xvOkefdZPyt_PuyXYzfFs-xvSNtFzxaWqRLuYRIjXkfvoItexm94DH3ipJEaH70hZi0HUcioofqIx-WjA1U1WBxEu-o-vEiNrzto7hx7xIkIDDiQ:U=d8b9a27a45000000;",
        },
    });
    const data = response.data;

    const autoComplete = data.map((item: any) => {
        return {
            name: item.name,
            fullName: item.cleanName,
            location: {
                lat: item.latLng.lat,
                lng: item.latLng.lng,
            },
            address: item.address,
        };
    });


    return autoComplete;
};

const getGeoRss = async (
    extent: string = "",
    types: string = "alerts,traffic"
) => {
    let extents = extent.split(",");
    const response = await axios.get(baseUrl + "/georss", {
        params: {
            top: extents[0] ? extents[0] : "-6.555244577109877",
            bottom: extents[1] ? extents[1] : "-6.606608300875732",
            left: extents[3] ? extents[3] : "106.75508594512941",
            right: extents[4] ? extents[4] : "106.85355091094972",
            env: "row",
            types,
        },
    });

    const data = response.data;
    const geoRss = {
        alerts: data.alerts,
        jams: data.jams,
    };

    return geoRss;
};

const getAlternativesRoutes = async (from: object, to: object) => {
    const response = await axios.post(
        baseUrl + "/user-drive?geo_env=row",
        {
            from,
            to,
            nPaths: 3,
            useCase: "LIVEMAP_PLANNING",
            interval: 15,
            arriveAt: true,
        },
        {
            headers: {
                "Content-Type": "application/json",
                "Cookie": "recaptcha-ca-t=ARbRLZ29PmdBLL_60GPf47GWoVZNgisEt1MM16iYq28I-1_PnriVGkM8YPYOIznivXKPEI3-VTGYNYO19CODC7xvOkefdZPyt_PuyXYzfFs-xvSNtFzxaWqRLuYRIjXkfvoItexm94DH3ipJEaH70hZi0HUcioofqIx-WjA1U1WBxEu-o-vEiNrzto7hx7xIkIDDiQ:U=d8b9a27a45000000;",
            }
        }
    );
    const data = response.data;
    return data;
};

const searchGoogleMaps = async (keyword: string, lat: number, lng: number, zoom: number, outputType: string = "json", limit: number = 20) => {
    const browser = await puppeteer.connect({
        browserWSEndpoint: process.env.BROWSERLESS_URL || `ws://192.168.18.2:8082`,
    });
    try {
        const page = await browser.newPage();
        // Set user agent to avoid bot detection
        await page.setUserAgent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
        
        const results = await googleMapsScraper({ page, keyword, lat, lng, zoom, limit });

        if (outputType === "geojson") {
            return {
                type: "FeatureCollection",
                features: results.data.map((item: any) => ({
                    type: "Feature",
                    geometry: {
                        type: "Point",
                        coordinates: [item.lng, item.lat],
                    },
                    properties: {
                        name: item.name,
                        category: item.kategori,
                        rating: item.rating,
                        address: item.address,
                    },
                })).filter((f: any) => f.geometry.coordinates[0] !== null && f.geometry.coordinates[1] !== null),
            };
        }

        return results;
    } finally {
        await browser.close();
    }
};

export { getAutoComplete, getGeoRss, getAlternativesRoutes, searchGoogleMaps };
