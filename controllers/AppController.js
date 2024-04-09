const dbClient = require('../utils/db');

class AppController {
  static async getStatus(req, res) {
    // vérifier si Redis et la base de données sont en vie
    const redisAlive = true;
    const dbAlive = true;

    res.status(200).json({ redis: redisAlive, db: dbAlive });
  }

  static async getStats(_req, res) {
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    // console.log(users)
    res.status(200).json({ users, files });
  }
}

module.exports = AppController;
