import WebSocket from "ws";
import { IncomingMessage } from "http";
import { v4 as uuidv4 } from "uuid";

class WsServer {
  private wss = new WebSocket.Server({ noServer: true });
  private clients: Map<string, Map<string, WebSocket>> = new Map();

  public handleUpgrade = this.wss.handleUpgrade.bind(this.wss);
  public emit = this.wss.emit.bind(this.wss);

  constructor() {
    this.wss.on("connection", (ws: WebSocket, req: IncomingMessage, roomId: string) => {
      const clientId = uuidv4();
      const roomMap = this.clients.get(roomId) || new Map();
      roomMap.set(clientId, ws);
      this.clients.set(roomId, roomMap);

      this.keepAlive(ws);

      ws.on("close", (code: number, reason: string) => {
        const closingRoomMap = this.clients.get(roomId);
        closingRoomMap?.delete(clientId);
        if (!closingRoomMap?.size) {
          this.clients.delete(roomId);
        }
      });
    });
  }

  public broadcastToRoom(roomId: string, message: string) {
    this.clients.get(roomId)?.forEach(ws => {
      ws.send(message);
    })
  }

  private keepAlive(ws: WebSocket) {
    let isAlive = true;
    const interval = setInterval(() => {
      if (ws.readyState === ws.CLOSED) {
        clearInterval(interval);
        return;
      }
      if (!isAlive) {
        ws.terminate();
        clearInterval(interval);
        return;
      }
      isAlive = false;
      ws.ping();
    }, 8000);

    ws.on("pong", () => {
      isAlive = true;
    });
  }
}

export default new WsServer();
