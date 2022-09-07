"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const autentication_1 = require("../middlewares/autentication");
const Post_1 = require("../models/Post");
const file_system_1 = __importDefault(require("../classes/file-system"));
const postRoutes = (0, express_1.Router)();
const fileSystem = new file_system_1.default();
//obtener Posts paginados
postRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let page = Number(req.query.page) || 1;
    let skip = page - 1;
    skip = skip * 10;
    const posts = yield Post_1.Post.find()
        .sort({ _id: -1 })
        .skip(skip)
        .limit(10)
        .populate("user", "-password")
        .exec();
    res.json({
        ok: true,
        page,
        posts,
    });
}));
postRoutes.post("/", [autentication_1.verifyToken], (req, res) => {
    const body = req.body;
    body.user = req.user._id;
    const images = fileSystem.moveImagesFromTempToPost(req.user._id);
    body.imgs = images;
    Post_1.Post.create(body)
        .then((postDB) => __awaiter(void 0, void 0, void 0, function* () {
        yield postDB.populate("user", "-password");
        res.json({
            ok: true,
            message: postDB,
        });
    }))
        .catch((err) => {
        res.json(err);
    });
});
//Servicio para subir archivos
postRoutes.post("/upload", [autentication_1.verifyToken], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            message: "No se subió ningún archivo",
        });
    }
    const file = req.files.image;
    if (!file) {
        return res.status(400).json({
            ok: false,
            message: "No se subió ningún archivo - image",
        });
    }
    if (!file.mimetype.includes("image")) {
        return res.status(400).json({
            ok: false,
            message: "Lo que subió no es una imagen",
        });
    }
    yield fileSystem.saveImageTemp(file, req.user._id);
    res.json({
        ok: true,
        file: file.name,
    });
}));
postRoutes.get("/image/:userid/:img", [autentication_1.verifyToken], (req, res) => {
    const userId = req.params.userid;
    const img = req.params.img;
    const pathImg = fileSystem.getImageUrl(userId, img);
    res.sendFile(pathImg);
});
exports.default = postRoutes;
