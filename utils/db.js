import mongodb from 'mongodb';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';
    const url = `mongodb://${host}:${port}`;

    // Connexion à la base de données MongoDB
    mongodb.MongoClient.connect(url, { useUnifiedTopology: true }, (error, client) => {
      // Assignation de la base de données à l'instance de DBClient
      this.db = client.db(database);
    });
  }

  // Méthode pour vérifier si la connexion à la base de données est active
  isAlive() {
    return !!this.db;
  }

  // Méthode pour obtenir le nombre d'utilisateurs dans la base de données
  async nbUsers() {
    return this.db.collection('users').countDocuments();
  }

  // Méthode pour obtenir le nombre de fichiers dans la base de données
  async nbFiles() {
    return this.db.collection('files').countDocuments();
  }
}

// Création d'une instance de DBClient
const dbClient = new DBClient();
// Exportation de l'instance pour être utilisée dans d'autres fichiers
export default dbClient;
