import { Router, Response } from "express";
import { FileUpload } from "../intefaces/file-upload";
import { verifyToken } from "../middlewares/autentication";
import { Post } from "../models/Post";
import FileSystem from "../classes/file-system";

const postRoutes = Router();
const fileSystem = new FileSystem();

//obtener Posts paginados
postRoutes.get("/", async (req: any, res: Response) => {
  let page = Number(req.query.page) || 1;
  let skip = page - 1;
  skip = skip * 10;
  const posts = await Post.find()
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
});

postRoutes.post("/", [verifyToken], (req: any, res: Response) => {
  const body = req.body;
  body.user = req.user._id;

  const images = fileSystem.moveImagesFromTempToPost(req.user._id);
  body.imgs = images;

  Post.create(body)
    .then(async (postDB) => {
      await postDB.populate("user", "-password");
      res.json({
        ok: true,
        message: postDB,
      });
    })
    .catch((err) => {
      res.json(err);
    });
});

//Servicio para subir archivos
postRoutes.post("/upload", [verifyToken], async (req: any, res: Response) => {
  if (!req.files) {
    return res.status(400).json({
      ok: false,
      message: "No se subió ningún archivo",
    });
  }

  const file: FileUpload = req.files.image;
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

  await fileSystem.saveImageTemp(file, req.user._id);

  res.json({
    ok: true,
    file: file.name,
  });
});

postRoutes.get(
  "/image/:userid/:img",
  [verifyToken],
  (req: any, res: Response) => {
    const userId = req.params.userid;
    const img = req.params.img;

    const pathImg = fileSystem.getImageUrl(userId, img);

    const headers = {
      "Content-Type": "image/jpg",
      "Allow-Control-Allow-Origin": "*",
    }

    res.setHeader('Content-Type', 'image/jpg');
    res.setHeader('Allow-Control-Allow-Origin', '*');
    res.setHeader('Allow-Control-Allow-Headers', 'Content-Type, Authorization');
    
    res.sendFile(pathImg);
    
  }
);

export default postRoutes;
