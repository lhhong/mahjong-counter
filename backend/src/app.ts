import express from "express";
import api from "./routers/api";
import ws from "./routers/ws";
import bodyParser from "body-parser";
import { IncomingMessage, Server as HttpServer, ServerResponse } from "http";
import { Socket } from "net";

const app = express();
app.use(bodyParser.json())

app.use("/api", api);
app.use("/ws", ws);

if (process.env.NODE_ENV === "production") {
    app.use("/", express.static("./frontend/build"));
    app.get('*', (req, res) => {
        res.sendFile('index.html', {root: "./frontend/build"});
    });
}

const server = new HttpServer(app);
server.on("upgrade", (req: IncomingMessage, socket: Socket, head: Buffer) => {
  const res = new ServerResponse(req) as express.Response;
  res.assignSocket(socket);
  res.on("finish", () => {
    res.detachSocket(socket);
    socket.destroy();
  });
  res.locals = {
    ws: { socket, head },
  };
  app(req, res);
});

server.listen(process.env.PORT || 8080, () => console.log("Server listening"));
