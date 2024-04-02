const redis = require('redis');
const { promisify } = require('util');

// Définition de la classe RedisClient
class RedisClient {
  constructor() {
    // Création d'un client Redis
    this.client = redis.createClient();

    // Conversion des méthodes du client en versions asynchrones avec promisify
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
    this.delAsync = promisify(this.client.del).bind(this.client);

    // Gestion des erreurs du client Redis
    this.client.on('error', (ERROR) => {
      console.error(`error redis client: ${ERROR}`);
    });
  }

  // Méthode pour vérifier si le client Redis est connecté
  isAlive() {
    return this.client.connected;
  }

  // Méthode pour récupérer une valeur à partir d'une clé
  async get(key) {
    return this.getAsync(key);
  }

  // Méthode pour stocker une valeur avec une durée d'expiration
  async set(key, value, duration) {
    return this.setAsync(key, value, 'EX', duration);
  }

  // Méthode pour supprimer une clé et sa valeur correspondante
  async del(key) {
    return this.delAsync(key);
  }
}

// Création d'une instance de RedisClient
const redisClient = new RedisClient();
module.exports = redisClient;
