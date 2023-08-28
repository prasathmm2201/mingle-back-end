import { Router } from "express";
import path from "path";
import { PubilcMiddleware , PrivateMiddleware } from "../middleware";

const routes = Router();

const publicApiNames = require("fs")
    .readdirSync(__dirname + "/public", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((item) => item.name);

publicApiNames.forEach(async (item) => {
    var route = await require(path.join(__dirname + "/public", item));
    routes.use(`/${item}/`, PubilcMiddleware , route);
});

const privateApiNames = require("fs")
    .readdirSync(__dirname + "/private", { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((item) => item.name);

privateApiNames.forEach(async (item) => {
    var route = await require(path.join(__dirname + "/private", item));
    routes.use(`/${item}/`,PrivateMiddleware, route);
});

export default routes;
