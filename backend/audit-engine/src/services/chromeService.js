const chromeLauncher = require("chrome-launcher");
const logger = require("../utils/logger");

async function launchChrome() {
    try {
        logger.info("Starting Chrome for Lighthouse audit");

        const chrome = await chromeLauncher.launch({
            chromeFlags: [
                "--headless=new",
                "--no-sandbox",
                "--disable-gpu",
                "--disable-dev-shm-usage",
                "--disable-software-rasterizer"
            ]
        });

        logger.info(`Chrome started on port ${chrome.port}`);

        return chrome;
    } catch (error) {
        logger.error("Failed to start Chrome", error);

        const chromeError = new Error(
            "Unable to start Chrome for audit"
        );

        chromeError.statusCode = 500;

        throw chromeError;
    }
}

async function closeChrome(chrome) {
    if (!chrome) {
        return;
    }

    try {
        await chrome.kill();
        logger.info("Chrome process closed");
    } catch (error) {
        logger.error("Failed to close Chrome", error);
    }
}

module.exports = {
    launchChrome,
    closeChrome
};