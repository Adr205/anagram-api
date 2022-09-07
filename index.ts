import Server from "./classes/server";
import mongoose from "mongoose";

import bodyParser from "body-parser";
import fileUpload from "express-fileupload";
import cors from "cors";

import userRoutes from "./routes/user";
import postRoutes from './routes/post';
 //dotenv 

 require('dotenv').config();



const URI = process.env.MONGO_URI || '';
const server = new Server();

// Body parser
server.app.use(bodyParser.urlencoded({ extended: true }));
server.app.use(bodyParser.json());

//File upload
server.app.use(fileUpload({ useTempFiles: true }));

//cors
server.app.use(cors({ origin: true, credentials: true }));

//Rutas
server.app.use("/user", userRoutes);
server.app.use("/post", postRoutes);

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
