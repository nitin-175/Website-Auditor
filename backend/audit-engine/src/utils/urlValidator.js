function isValidUrl(value) {
    if (!value || typeof value !== "string") {
        return false;
    }

    try {
        const url = new URL(value);

        return (
            (url.protocol === "http:" || url.protocol === "https:") &&
            Boolean(url.hostname)
        );
    } catch (error) {
        return false;
    }
}

module.exports = {
    isValidUrl
};