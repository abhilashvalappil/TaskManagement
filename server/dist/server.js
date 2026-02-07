"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const http_1 = __importDefault(require("http"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRouter_1 = __importDefault(require("./routes/userRouter"));
const taskRouter_1 = __importDefault(require("./routes/taskRouter"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const mongoUrl = process.env.MONGO_URL;
const server = http_1.default.createServer(app);
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use('/', userRouter_1.default);
app.use('/tasks', taskRouter_1.default);
if (!mongoUrl) {
    throw new Error("MONGO_URL is not defined in environment variables");
}
mongoose_1.default
    .connect(mongoUrl)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error("MongoDB connection error:", err));
app.get("/", (req, res) => {
    res.send("Hello, TypeScript!");
});
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
exports.default = app;
//# sourceMappingURL=server.js.map