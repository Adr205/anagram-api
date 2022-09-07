"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uniqid_1 = __importDefault(require("uniqid"));
class FileSystem {
    constructor() { }
    saveImageTemp(file, userId) {
        return new Promise((resolve, reject) => {
            const path = this.createUserFolder(userId);
            const fileName = this.generateUniqueName(file.name);
            //Move file from temp to user folder
            file.mv(`${path}/${fileName}`, (err) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve();
                }
            });
        });
    }
    generateUniqueName(originalName) {
        const nameArr = originalName.split(".");
        const extension = nameArr[nameArr.length - 1];
        const uniqueId = (0, uniqid_1.default)();
        return `${uniqueId}.${extension}`;
    }
    createUserFolder(userId) {
        const pathUser = path_1.default.resolve(__dirname, "../uploads/", userId);
        const pathUserTemp = pathUser + "/temp";
        const exists = fs_1.default.existsSync(pathUser);
        if (!exists) {
            fs_1.default.mkdirSync(pathUser);
            fs_1.default.mkdirSync(pathUserTemp);
        }
        return pathUserTemp;
    }
    moveImagesFromTempToPost(userId) {
        const pathTemp = path_1.default.resolve(__dirname, "../uploads/", userId, "temp");
        const pathPost = path_1.default.resolve(__dirname, "../uploads/", userId, "posts");
        if (!fs_1.default.existsSync(pathTemp)) {
            return [];
        }
        if (!fs_1.default.existsSync(pathPost)) {
            fs_1.default.mkdirSync(pathPost);
        }
        const imagesTemp = this.getImagesTemp(userId);
        imagesTemp.forEach((image) => {
            fs_1.default.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
        });
        return imagesTemp;
    }
    getImagesTemp(userId) {
        const pathTemp = path_1.default.resolve(__dirname, "../uploads/", userId, "temp");
        return fs_1.default.readdirSync(pathTemp) || [];
    }
    getImageUrl(userId, img) {
        //Path post
        const pathPost = path_1.default.resolve(__dirname, "../uploads/", userId, "posts", img);
        //If image exists
        const exists = fs_1.default.existsSync(pathPost);
        if (!exists) {
            return path_1.default.resolve(__dirname, "../assets/400x250.png");
        }
        return pathPost;
    }
}
exports.default = FileSystem;
