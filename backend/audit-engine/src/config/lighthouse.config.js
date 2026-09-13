function getLighthouseConfig(device = "desktop") {
    const isMobile = device === "mobile";

    return {
        extends: "lighthouse:default",

        settings: {
            formFactor: isMobile ? "mobile" : "desktop",

            screenEmulation: isMobile
                ? {
                      mobile: true,
                      width: 390,
                      height: 844,
                      deviceScaleFactor: 3,
                      disabled: false
                  }
                : {
                      mobile: false,
                      width: 1350,
                      height: 940,
                      deviceScaleFactor: 1,
                      disabled: false
                  },

            throttlingMethod: "simulate",

            onlyCategories: [
                "performance",
                "accessibility",
                "best-practices",
                "seo"
            ]
        }
    };
}

module.exports = {
    getLighthouseConfig
};