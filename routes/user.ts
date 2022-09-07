import { Router, Request, Response } from "express";
import {User} from "../models/User";
import bcrypt from "bcrypt";
import Token from '../classes/token';
import { verifyToken } from '../middlewares/autentication';

const userRoutes = Router();





//Login
userRoutes.post("/login", (req: Request, res: Response) => {
    const body = req.body;
    User.findOne({email: body.email}, (err: any, userDB: {
        _id: any;
        name: any;
        email: any;
        avatar: any; comparePassword: (arg0: any) => any; 
}) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                message: "User/Password incorrect"
            });
        }

        if(userDB.comparePassword(body.password)){
            const token = Token.getJwtToken({
                _id: userDB._id,
                name: userDB.name,
                email: userDB.email,
                avatar: userDB.avatar
            });

            res.json({
                ok: true,
                token: token
            });
        }else{
            return res.json({
                ok: false,
                message: "User/Password incorrect"
            });
        }
    });
});

userRoutes.post("/create", (req: Request, res: Response) => {
  

    const user = {
        name: req.body.name,
        email: req.body.email,
        password: bcrypt.hashSync(req.body.password, 10),
        avatar: req.body.avatar
    } 
    
    User.create(user).then(userDB => {

        const token = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: token
        })
    }).catch(err => {
        res.json({
            ok: false,
            err
        })
    });
});

//actualizar usuario

userRoutes.put("/update",verifyToken,(req: any, res: Response) => {
    const user = {
        name: req.body.name || req.user.name,
        email: req.body.email || req.user.email,
        avatar: req.body.avatar || req.user.avatar
    }

    User.findByIdAndUpdate(req.user._id, user, {new: true}, (err: any, userDB: any) => {
        if(err) throw err;

        if(!userDB){
            return res.json({
                ok: false,
                message: "User not found"
            });
        }

        const token = Token.getJwtToken({
            _id: userDB._id,
            name: userDB.name,
            email: userDB.email,
            avatar: userDB.avatar
        });

        res.json({
            ok: true,
            token: token
        });
    });
});

userRoutes.get("/", [verifyToken], (req: any, res: Response) => {

    const user = req.user;

    res.json({
        ok: true,
        user
    });

});

export default userRoutes;
