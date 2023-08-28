import { Router } from "express";
import { Login, createSignUp } from "../../../controllers";

const routes = Router();

routes.post("/sign_up", async (req, res) => {
  try {
    const date = await createSignUp(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

routes.post("/login", async (req, res) => {
  try {
    console.log('slsslls')
    const date = await Login(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});


module.exports = routes;
