import { Page } from "puppeteer";

export default async ({ page, keyword, lat, lng, zoom, limit = 20 }: { page: Page, keyword: string, lat: number, lng: number, zoom: number, limit?: number }) => {
    // Navigate to Google Maps search
    await page.goto(`https://www.google.com/maps/search/${keyword}/@${lat},${lng},${zoom}z`);

    // Wait for the results feed to load
    await page.waitForSelector('div[role="feed"]', { timeout: 15000 });

    // ✅ SCROLL DINAMIS (berhenti jika sudah mencapai limit atau mentok)
    await page.evaluate(async (targetLimit) => {
        const scrollable = document.querySelector('div[role="feed"]');
        if (!scrollable) return;

        let lastHeight = 0;
        let sameHeightCount = 0;

        while (true) {
            const currentItems = scrollable.querySelectorAll('div[role="feed"] > div').length;
            
            // Berhenti jika sudah mencapai atau melebihi limit
            if (currentItems >= targetLimit) break;

            scrollable.scrollBy(0, 1000);
            await new Promise(r => setTimeout(r, 2000));

            const newHeight = scrollable.scrollHeight;
            if (newHeight === lastHeight) {
                sameHeightCount++;
                if (sameHeightCount >= 3) break; // Berhenti jika 3x scroll tinggi tetap sama (mentok)
            } else {
                sameHeightCount = 0;
                lastHeight = newHeight;
            }
        }
    }, limit);

    // ✅ AMBIL DATA 
    const results = await page.evaluate((targetLimit) => {
        const items = Array.from(document.querySelectorAll('div[role="feed"] > div'))
            .map(el => {
                const name = (el.querySelector('.qBF1Pd') as HTMLElement)?.innerText;
                if (!name) return null;

                const kategori = (el.querySelector('.W4Efsd > span') as HTMLElement)?.innerText;
                const info = (el.querySelector('.W4Efsd .W4Efsd') as HTMLElement)?.innerText;
                const rating = (el.querySelector('.W4Efsd .AJB7ye') as HTMLElement)?.innerText;
                const url = (el.querySelector('a[href*="/place/"]') as HTMLAnchorElement)?.href || '';

                let lat = null;
                let lng = null;

                if (url) {
                    const latMatch = url.match(/!3d(-?\d+\.\d+)/);
                    const lngMatch = url.match(/!4d(-?\d+\.\d+)/);

                    lat = latMatch ? parseFloat(latMatch[1]) : null;
                    lng = lngMatch ? parseFloat(lngMatch[1]) : null;
                }

                return {
                    name,
                    kategori,
                    rating,
                    address: info,
                    lat,
                    lng
                };
            })
            .filter(Boolean);
        
        // Kembalikan hanya sejumlah limit
        return items.slice(0, targetLimit);
    }, limit);

    return {
        total: results.length,
        data: results
    };
};
