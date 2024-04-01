import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class AppController {
    static async getStatus(req, res) {
        const redisAlive = await redisClient.isAlive();
        const dbAlive = await dbClient.isAlive();
        res.status(200).json({ redis: redisAlive, db: dbAlive });
    }

    static async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();
        res.status(200).json({ users, files });
    }
}

module.exports = AppController;
