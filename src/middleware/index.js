import knex from "knex";
import DB from "../../DB";
import { verify } from "../helper/function";

export const PubilcMiddleware=async(req, res, next)=>{
    try{
        req.body["tenantDB"] = knex(DB)
        return next();
    }
    catch(err){
        console.log(err)
        return res.status(500).send(err);

    }
}

export const PrivateMiddleware=async(req, res, next)=>{
    try {
        if (
          req.headers.authorization &&
          req.headers.authorization.split(" ")[1] &&
          req.headers.authorization.split(" ")[1] != "null" &&
          req.headers.authorization.split(" ")[1] != "undefined"
        ) {
          const token = req.headers.authorization.split(" ")[1];
          const payload = await verify(token);
          res.locals.user = payload;

          req.body["tenantDB"] = knex(DB)
          req.body["user_id"] = payload?.user_id
          return next();
        }
        return next({
          code: 403,
          message: "You are not an authorized user!",
        });
      } catch (err) {
        console.log(err , 'err')
        return next({
          code: 400,
          message: err.message,
        });
      }
}