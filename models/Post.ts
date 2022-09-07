import { Schema, Document, model } from "mongoose";

const postSchema = new Schema({
  created: {
    type: Date,
  },
  message: {
    type: String,
  },
  imgs: [
    {
      type: String,
    },
  ],
  coords: {
    type: String,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Debe existir una referencia a un usuario"],
  },
});

interface IPost extends Document {
    created: Date;
    message: string;
    img: string[];
    coords: string;
    user: string;
}

postSchema.pre<IPost>("save", function (next) {
  this.created = new Date();
  next();
});

export const Post = model<IPost>("Post", postSchema);