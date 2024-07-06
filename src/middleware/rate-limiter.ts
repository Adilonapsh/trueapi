import rateLimiter from "express-rate-limit";

const limiter = rateLimiter({
    max: 5,
    windowMs: 10000, // 10 Detik
    message: {
        code: 429,
        message: "Too Many Requests",
    },
});

export { limiter };
