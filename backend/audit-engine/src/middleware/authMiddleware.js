const logger = require("../utils/logger");

function authMiddleware(req, res, next) {
    const configuredApiKey =
        process.env.AUDIT_ENGINE_API_KEY ||
        "dev-audit-engine-key";

    if (!configuredApiKey) {
        logger.error(
            "AUDIT_ENGINE_API_KEY is not configured"
        );

        return res.status(500).json({
            success: false,
            message: "Audit engine authentication is not configured"
        });
    }

    const providedApiKey = req.headers["x-audit-engine-key"];

    if (!providedApiKey) {
        return res.status(401).json({
            success: false,
            message: "Missing audit engine authentication key"
        });
    }

    if (providedApiKey !== configuredApiKey) {
        return res.status(401).json({
            success: false,
            message: "Invalid audit engine authentication key"
        });
    }

    next();
}

module.exports = authMiddleware;