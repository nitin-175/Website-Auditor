const logger = require("../utils/logger");

const {
    launchChrome,
    closeChrome
} = require("./chromeService");

const {
    getLighthouseConfig
} = require("../config/lighthouse.config");

async function runLighthouseAudit(url, device = "desktop") {
    let chrome;

    try {
        if (!url) {
            const error = new Error("URL is required");
            error.statusCode = 400;
            throw error;
        }

        if (!["mobile", "desktop"].includes(device)) {
            const error = new Error(
                "Device must be either mobile or desktop"
            );

            error.statusCode = 400;
            throw error;
        }

        logger.info(
            `Starting Lighthouse audit: ${url} (${device})`
        );

        chrome = await launchChrome();

        /*
         * Current Lighthouse versions are ESM.
         * Dynamic import allows our CommonJS project
         * to use Lighthouse.
         */
        const lighthouseModule =
            await import("lighthouse");

        const lighthouse =
            lighthouseModule.default;

        if (!lighthouse) {
            throw new Error(
                "Unable to load Lighthouse"
            );
        }

        const options = {
            port: chrome.port,
            output: "json",
            logLevel: "error",

            /*
             * Keep the audit from running indefinitely.
             */
            maxWaitForFcp: 15000,
            maxWaitForLoad: 45000
        };

        const config =
            getLighthouseConfig(device);

        const result =
            await lighthouse(
                url,
                options,
                config
            );

        if (!result) {
            throw new Error(
                "Lighthouse returned no audit result"
            );
        }

        if (!result.lhr) {
            throw new Error(
                "Lighthouse returned an invalid result"
            );
        }

        logger.info(
            `Lighthouse audit completed: ${url} (${device})`
        );

        return result;

    } catch (error) {

        logger.error(
            `Lighthouse audit failed for ${url}`,
            error
        );

        throw error;

    } finally {

        await closeChrome(chrome);
    }
}

module.exports = {
    runLighthouseAudit
};