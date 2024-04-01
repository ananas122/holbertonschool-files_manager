import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.connect().catch((error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('connect', () => {
      console.log('Redis client connected to the server');
    });

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error}`);
    });
  }

  isAlive() {
    return this.client.isOpen;
  }

  get(key) {
    return this.client.get(key);
  }

  async set(key, value, duration) {
    return this.client.set(key, value, { EX: duration });
  }

  async del(key) {
    return this.client.del(key);
  }
}

const redisClient = new RedisClient();
export default redisClient;
