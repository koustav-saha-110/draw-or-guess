import express from "express";
import cors from "cors";
import "dotenv/config";
import http from "node:http";
import path from "path";

// Socket Connection
import {
    initializeIOServerConnection
} from "./socket/socket.server.js";

export const corsOptions = {
    origin: process.env.FRONTEND_URL,
    credentials: true
};

const _dirname = path.resolve();
const PORT = Number(process.env.PORT) || 8000;
const app = express();

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.static(path.join(_dirname, "/frontend/dist")));
app.get("/", (_, res) => {
    res.sendFile(path.resolve(_dirname, "frontend", "dist", "index.html"));
});

const httpServer = http.createServer(app);
initializeIOServerConnection(httpServer);

httpServer.listen(PORT, () => {
    console.log("server started!");
});
