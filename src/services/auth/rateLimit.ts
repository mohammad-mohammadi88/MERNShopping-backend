import { rateLimit } from "express-rate-limit";

const loginLimit = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 5,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    ipv6Subnet: 56,
    message: "You riched the limit of requests. Please try again later!",
});

export default loginLimit;
