const crypto = require('crypto');
const dbClient = require('../utils/db');
const redisClient = require('../utils/redis');

class UsersController {
  // Méthode pour créer un nouvel utilisateur
  static async postNew(req, res) {
    // Récupération des données du corps de la requête
    const { email, password } = req.body;

    // Vérification de la présence de l'email et du mot de passe
    if (!email) {
      return res.status(400).json({ error: 'Missing email' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Missing password' });
    }

    // Vérification si l'email existe déjà dans la base de données
    const existingUser = await dbClient.db.collection('users').findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'Already exist' });
    }

    // Hachage du mot de passe en utilisant SHA1
    const hash = crypto.createHash('sha1'); // Création de l'objet de hachage SHA1
    hash.update(password); // Mise à jour du hachage avec le mot de passe
    const hashedPassword = hash.digest('hex'); // Obtention du hachage au format hexadécimal

    // Création du nouvel utilisateur
    const newUser = {
      email,
      password: hashedPassword,
    };

    // Enregistrement du nouvel utilisateur dans la collection 'users'
    dbClient.db.collection('users').insertOne(newUser, (error, result) => {
      if (error) {
        console.error('Error creating user:', error);
        return res.status(500).json({ error: 'Internal server error' });
      }

      // Récupération de l'email de l'utilisateur créé et de l'id généré par MongoDB
      const { email } = result.ops[0];
      const id = result.insertedId;

      // Retourner le nouvel utilisateur avec l'email et l'id généré par MongoDB
      return res.status(201).json({ email, id });
    });

    // Ajout d'une instruction de retour à la fin de la méthode
    return res.status(500).json({ error: 'Internal server error' });
  }

  // Méthode pour récupérer les informations de l'utilisateur actuel
  static async getMe(req, res) {
    // Récupération du token d'authentification depuis l'en-tête
    const { 'x-token': token } = req.headers;

    // Vérification de la présence du token
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Récupération de l'ID de l'utilisateur à partir du token dans Redis
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Récupération des informations de l'utilisateur à partir de l'ID
    const user = await dbClient.db.collection('users').findOne({ _id: userId });

    // Vérification de l'existence de l'utilisateur
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Retour des informations de l'utilisateur (email et ID)
    return res.status(200).json({ email: user.email, id: user._id });
  }
}

// Export de la classe UsersController
module.export = UsersController;
