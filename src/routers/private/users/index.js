import { Router } from "express";
import { getAllUsers } from "../../../controllers";

const routes = Router();

routes.post("/", async (req, res) => {
  try {
    const date = await getAllUsers(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = routes;
