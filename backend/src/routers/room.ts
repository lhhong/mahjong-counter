import express from "express";
import { v4 as uuidv4 } from "uuid";
import { RedisPool, getKeys, roomExpiry } from "../redis";
import wss from "../wsServer";

const room = express.Router({ mergeParams: true });

room.route("/config")
  .get((req, res) => {
    RedisPool.acquire().then((client) => {
      client.get(getKeys(req.params.roomId).config, (err, val) => {
        if (err) {
          res.status(500).send(err);
        } else if (!val) {
          res.status(204).send();
        } else {
          res.send(JSON.parse(val));
        }
        RedisPool.release(client);
      })
    })
  })
  .post((req, res) => {
    RedisPool.acquire().then((client) => {
      client.setex(getKeys(req.params.roomId).config, roomExpiry, JSON.stringify(req.body), (err, value) => {
        if (err) {
          res.status(500).send(err)
        } else {
          res.sendStatus(201);
          wss.broadcastToRoom(req.params.roomId, "config")
        }
        RedisPool.release(client);
      })
    })
  })

room.route("/tx")
  .get((req, res) => {
    RedisPool.acquire().then((client) => {
      client.multi()
        .lrange(getKeys(req.params.roomId).txid, 0, -1)
        .hgetall(getKeys(req.params.roomId).tx)
        .exec((err, val) => {
          if (err) {
            res.status(500).send(err);
          } else if (!val || !val[0]) {
            res.sendStatus(404);
          } else {
            res.send(val[0].map((v: string) => JSON.parse(val[1][v])));
          }
          RedisPool.release(client);
      });
    });
  })
  .post((req, res) => {
    RedisPool.acquire().then((client) => {
      const keys = getKeys(req.params.roomId);
      const tx = req.body;
      const id = uuidv4();
      tx.id = id;
      client.multi()
        .lpush(keys.txid, id)
        .hset(keys.tx, id, JSON.stringify(tx))
        .exec((err, value) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.sendStatus(201);
            wss.broadcastToRoom(req.params.roomId, "tx")
          }
          RedisPool.release(client);
        });
    });
  })
  .delete((req, res) => {
    RedisPool.acquire().then((client) => {
      const keys = getKeys(req.params.roomId);
      client.del(keys.txid, keys.tx, (err, val) => {
        if (err) {
          res.status(500).send(err);
        } else {
          res.sendStatus(204);
          wss.broadcastToRoom(req.params.roomId, "tx")
        }
        RedisPool.release(client);
      });
    });
  });

room.route("/tx/:txid")
  .delete((req, res) => {
    RedisPool.acquire().then((client) => {
      const keys = getKeys(req.params.roomId);
      client.multi()
        .lrem(keys.txid, 1, req.params.txid)
        .hdel(keys.tx, req.params.txid)
        .exec((err, val) => {
          if (err) {
            res.status(500).send(err);
          } else {
            res.sendStatus(204);
            wss.broadcastToRoom(req.params.roomId, "tx")
          }
          RedisPool.release(client);
        });
    });
  });

export default room;

