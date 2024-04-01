class AppController {
    static async getStatus(req, res) {
        // Implémentez la logique pour vérifier si Redis et la base de données sont en vie
        const redisAlive = true; //vérifier si Redis est vivant
        const dbAlive = true; //  vérifier si la base de données est vivante

        res.status(200).json({ redis: redisAlive, db: dbAlive });
    }

    static async getStats(req, res) {
        const users = await dbClient.nbUsers();
        const files = await dbClient.nbFiles();
        // console.log(users)
        res.status(200).json({ users, files });
    }
}

module.exports = AppController;