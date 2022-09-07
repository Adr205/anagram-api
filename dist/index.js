"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const server_1 = __importDefault(require("./classes/server"));
const mongoose_1 = __importDefault(require("mongoose"));
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const cors_1 = __importDefault(require("cors"));
const user_1 = __importDefault(require("./routes/user"));
const post_1 = __importDefault(require("./routes/post"));
//dotenv 
require('dotenv').config();
const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fotosgram';
const server = new server_1.default();
// Body parser
server.app.use(body_parser_1.default.urlencoded({ extended: true }));
server.app.use(body_parser_1.default.json());
//File upload
server.app.use((0, express_fileupload_1.default)({ useTempFiles: true }));
//cors
server.app.use((0, cors_1.default)({ origin: true, credentials: true }));
//Rutas
server.app.use("/anagram/api/user", user_1.default);
server.app.use("/anagram/api/post", post_1.default);
//public folder
server.app.use(express_1.default.static(__dirname + "/uploads"));
//DB connection
mongoose_1.default.connect(URI, {}, (err) => {
    if (err)
        throw err;
    console.log("DB online");
});
server.start(() => {
    console.log(`Servidor corriendo en puerto ${server.port}`);
});
