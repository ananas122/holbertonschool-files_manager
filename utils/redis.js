// utils/redis.js

import redis from 'redis';

class RedisClient {
    constructor() {
        this.client = redis.createClient();

        // Gérer les erreurs du client Redis
        this.client.on('error', (err) => {
            console.error('Error: Redis client is not connected', err);
        });
    }

    async isAlive() {
        return new Promise((resolve) => {
            this.client.ping('RedisServer', (error, result) => {
                if (error) resolve(false);
                resolve(result === 'RedisServer');
            });
        });
    }

    async get(key) {
        return new Promise((resolve) => {
            this.client.get(key, (error, result) => {
                if (error) resolve(null);
                resolve(result);
            });
        });
    }

    async set(key, value, duration) {
        this.client.set(key, value);
        this.client.expire(key, duration);
    }

    async del(key) {
        this.client.del(key);
    }
}

// Créer une instance de RedisClient et l'exporter
const redisClient = new RedisClient();
export default redisClient;
