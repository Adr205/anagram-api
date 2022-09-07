import Server from "./classes/server";
import mongoose from "mongoose";
import express from 'express';
import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import userRoutes from "./routes/user";
import postRoutes from './routes/post';
 //dotenv 

 require('dotenv').config();



const URI = process.env.MONGO_URI || 'mongodb://localhost:27017/fotosgram';
const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//File upload
server.app.use(fileUpload({ useTempFiles: true }));

//cors
server.app.use(cors({ origin: true, credentials: true }));

//Rutas
server.app.use("/anagram/api/user", userRoutes);
server.app.use("/anagram/api/post", postRoutes);

//public folder
server.app.use(express.static(__dirname + "/uploads"));
//DB connection
mongoose.connect(
  URI, 
  {},
  (err) => {
    if (err) throw err;
    console.log("DB online");
  }
);

server.start(() => {
  console.log(`Servidor corriendo en puerto ${server.port}`);
});
