require("dotenv").config();

const express = require("express");
const cors = require("cors");

const logger = require("./utils/logger");
const errorMiddleware = require("./middleware/errorMiddleware");
const auditRoutes = require("./routes/auditRoutes");

const app = express();

const PORT = process.env.PORT || 3001;

app.use(
    cors({
        origin:
            process.env.FRONTEND_URL ||
            "http://localhost:5173"
    })
);

app.use(
    express.json({
        limit: "1mb"
    })
);

app.use(
    express.urlencoded({
        extended: true
    })
);

app.get("/health", (req, res) => {
    res.status(200).json({
        success: true,
        service: "audit-engine",
        status: "UP",
        timestamp: new Date().toISOString()
    });
});

app.use("/api/audits", auditRoutes);

app.use(errorMiddleware);

app.listen(PORT, () => {
    logger.info(
        `Audit engine started on port ${PORT}`
    );
});