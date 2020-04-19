import Redis from "redis";
import Pool from "generic-pool";

const redisUrl = process.env.REDIS_URL || "redis://localhost";

export const RedisFactory: Pool.Factory<Redis.RedisClient> = {
  create: () => {
    return Promise.resolve(Redis.createClient(redisUrl));
  },
  destroy: (client) => {
    return new Promise<void>((resolve, reject) => {
      client.quit((err, reply) => {
        if (reply === "OK") {
          resolve();
        } else {
          reject(err);
        }
      })
    });
  }
}

export const RedisPool = Pool.createPool(RedisFactory, { min: 1, max: 10 });

export const roomExpiry = 3600 * 5;
export function getKeys(roomId: string) {
  return {
    config: `config/${roomId}`,
    tx: `tx/${roomId}`,
    txid: `txid/${roomId}`,
  }
}