// Import du module nécessaire
const redis = require('redis');

// Création du client Redis
const { createClient } = redis; // Utilisation de la déstructuration pour obtenir createClient

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.connect().catch((error) => {
      console.log(`Redis client not connected to the server: ${error.message}`);
    });

    this.client.on('error', (error) => {
      console.log(`Redis client not connected to the server: ${error}`);
    });
  }

  isAlive() {
    return this.client.isOpen;
  }

  async get(key) {
    return this.client.get(key);
  }

  async set(key, value, duration) {
    await this.client.set(key, value, { EX: duration });
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = new RedisClient();
module.exports = redisClient;
