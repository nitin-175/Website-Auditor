const logger = require("../utils/logger");

const {
    runLighthouseAudit
} = require("../services/lighthouseService");

const {
    processAuditResult
} = require("../services/auditService");

const {
    isValidUrl
} = require("../utils/urlValidator");

async function createAudit(req, res, next) {
    try {
        const { url, device } = req.body;

        if (!url) {
            return res.status(400).json({
                success: false,
                message: "URL is required"
            });
        }

        if (!isValidUrl(url)) {
            return res.status(400).json({
                success: false,
                message: "URL must be a valid HTTP or HTTPS URL"
            });
        }

        if (!device) {
            return res.status(400).json({
                success: false,
                message: "Device is required"
            });
        }

        if (!["mobile", "desktop"].includes(device)) {
            return res.status(400).json({
                success: false,
                message: "Device must be either mobile or desktop"
            });
        }

        logger.info(
            `Audit request received: ${url} (${device})`
        );

        /*
         * Run Lighthouse.
         */
        const lighthouseResult =
            await runLighthouseAudit(
                url,
                device
            );

        /*
         * Convert raw Lighthouse data into
         * application-specific audit data.
         */
        const processedResult =
            processAuditResult(
                lighthouseResult
            );

        return res.status(200).json({
            success: true,

            url,

            device,

            result: processedResult
        });

    } catch (error) {
        next(error);
    }
}

module.exports = {
    createAudit
};