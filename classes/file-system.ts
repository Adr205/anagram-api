import { FileUpload } from "../intefaces/file-upload";
import path from "path";
import fs from "fs";
import uniqid from "uniqid";

export default class FileSystem {
  constructor() {}

  saveImageTemp(file: FileUpload, userId: string) {
    return new Promise((resolve, reject) => {
      const path = this.createUserFolder(userId);
      const fileName = this.generateUniqueName(file.name);

      //Move file from temp to user folder
      file.mv(`${path}/${fileName}`, (err: any) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  private generateUniqueName(originalName: string) {
    const nameArr = originalName.split(".");
    const extension = nameArr[nameArr.length - 1];

    const uniqueId = uniqid();

    return `${uniqueId}.${extension}`;
  }

  private createUserFolder(userId: string) {
    const pathUser = path.resolve(__dirname, "../uploads/", userId);
    const pathUserTemp = pathUser + "/temp";

    const exists = fs.existsSync(pathUser);

    if (!exists) {
      fs.mkdirSync(pathUser);
      fs.mkdirSync(pathUserTemp);
    }
    return pathUserTemp;
  }

  moveImagesFromTempToPost(userId: string) {
    const pathTemp = path.resolve(__dirname, "../uploads/", userId, "temp");
    const pathPost = path.resolve(__dirname, "../uploads/", userId, "posts");

    if (!fs.existsSync(pathTemp)) {
      return [];
    }

    if (!fs.existsSync(pathPost)) {
      fs.mkdirSync(pathPost);
    }

    const imagesTemp = this.getImagesTemp(userId);

    imagesTemp.forEach((image) => {
      fs.renameSync(`${pathTemp}/${image}`, `${pathPost}/${image}`);
    });

    return imagesTemp;
  }

  private getImagesTemp(userId: string) {
    const pathTemp = path.resolve(__dirname, "../uploads/", userId, "temp");

    return fs.readdirSync(pathTemp) || [];
  }

  getImageUrl(userId: string, img: string) {
    //Path post
    const pathPost = path.resolve(__dirname, "../uploads/", userId, "posts", img);

    //If image exists
    const exists = fs.existsSync(pathPost);
    if (!exists) {
      return path.resolve(__dirname, "../assets/400x250.png");
    }

    return pathPost;
  }
}
