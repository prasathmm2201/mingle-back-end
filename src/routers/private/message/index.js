import { Router } from "express";
import { createGroup, createMessage, getGroupMessage, getMessage, getMessageByUser } from "../../../controllers";

const routes = Router();

routes.post("/create", async (req, res) => {
  try {
    const date = await createMessage(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

routes.post("/get_message", async (req, res) => {
  try {
    const date = await getMessageByUser(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

routes.post("/get_group_message", async (req, res) => {
  try {
    const date = await getGroupMessage(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

routes.post("/get_all_message", async (req, res) => {
  try {
    const date = await getMessage(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

routes.post("/group/create", async (req, res) => {
  try {
    const date = await createGroup(req?.body)
    res.status(200).send(date);
  } catch (error) {
    console.log(error);
    res.status(400).send(error);
  }
});

module.exports = routes;
