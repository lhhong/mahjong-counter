import express from "express";
import wss from "../wsServer";

const ws = express.Router()

ws.use("/:roomId/*", (req, res) => res.sendStatus(404));

ws.use("/:roomId", (req, res) => {
  if (res.locals.ws === undefined) {
    res.sendStatus(400);
    return;
  }
  wss.handleUpgrade(req, res.locals.ws.socket, res.locals.ws.head, (client) => {
    wss.emit("connection", client, req, req.params.roomId);
  });
})

export default ws;