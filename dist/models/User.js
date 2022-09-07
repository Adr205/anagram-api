"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = require("mongoose");
const bcrypt_1 = __importDefault(require("bcrypt"));
const userSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: [true, "The name is required"],
    },
    avatar: {
        type: String,
        default: "av-1.png",
    },
    email: {
        type: String,
        unique: true,
        required: [true, "The email is required"],
    },
    password: {
        type: String,
        required: [true, "The password is required"],
    },
});
userSchema.method("comparePassword", function (password = "") {
    if (bcrypt_1.default.compareSync(password, this.password)) {
        return true;
    }
    else {
        return false;
    }
});
exports.User = (0, mongoose_1.model)("User", userSchema);
