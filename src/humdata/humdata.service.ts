import axios from "axios";
import * as cheerio from "cheerio";
import dotenv from "dotenv";

dotenv.config();

const base_url = "https://data.humdata.org";
const getDataSets = async ({ search, page_size = 2, page = 1 }: { search: string, page_size: number, page: number }) => {
    try {
        const response = await axios.get(base_url + "/dataset/", {
            params: {
                ext_geodata: 1, //0/1
                q: search,
                sort: "metadata_created desc",
                ext_page_size: page_size,
                page
            }
        });
        if (response.data) {
            const selector = cheerio.load(response.data);
            const total_page = selector(".pagination .page-link").eq(-2).text();
            const links = selector(".dataset-heading a").map((i, el) => {
                return selector(el).attr("href");
            }).get();


            let data: Array<any> = [];


            for (const link of links) {
                const res = await axios.get(base_url + link);
                const selector = cheerio.load(res.data);

                const title = selector(".dataset-title").text().replace(/\n/g, '').replace(/\s+/g, ' ').trim();
                const details = selector(".details").text()
                const download_link = selector(".resource-item").map((i, el) => {
                    return {
                        filename: selector(el).find(".heading").attr("title"),
                        file_type: selector(el).find(".resource-name").find("span").text().replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
                        update_date: selector(el).find(".update-date").text().replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
                        desc: selector(el).find(".description").find("p").text().replace(/\n/g, '').replace(/\s+/g, ' ').trim(),
                        metadata: base_url + selector(el).find(".crises-group").find("a").attr("href"),
                        url: base_url + selector(el).find(".ga-download").attr("href")
                    }
                }).get();
                data.push({
                    name: title,
                    details,
                    download_link,
                })
            }

            return {
                total_page: total_page,
                data: data
            };
        }
    } catch (err: any) {
        console.log(err)
        throw "Error Occured"
    }

}

export {
    getDataSets
}