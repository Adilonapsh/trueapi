import { Request, Response, NextFunction } from 'express';

const allowedOrigins = [
    'truenapsh.my.id',
    'trumap.web.id',
    'localhost:3001' // Keep localhost for dev as seen in previous edits
];

export const apiAuth = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'];
    const origin = req.headers.origin;
    const host = req.headers.host;
    const validApiKey = process.env.API_KEY;

    // 1. Check API Key
    if (apiKey && apiKey === validApiKey) {
        return next();
    }

    // 2. Check Origin/Host (Domain Whitelist)
    let isAllowedDomain = false;

    if (origin) {
        isAllowedDomain = allowedOrigins.some(allowed => origin.includes(allowed));
    } else if (host) {
        isAllowedDomain = allowedOrigins.some(allowed => host.includes(allowed));
    }

    if (isAllowedDomain) {
        return next();
    }

    // 3. Reject if neither
    return res.status(401).json({
        code: 401,
        message: 'Unauthorized: Invalid API Key or Origin.'
    });
};
