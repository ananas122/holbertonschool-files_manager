import sha1 from 'sha1';
import { ObjectId } from 'mongodb';
import redisClient from '../utils/redis';
import dbClient from '../utils/db';

class UsersController {
  "Méthode pour créer un nouvel user"
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
  static async getMe(request, response) {
    // Recupere l auth token depuis a requete header
    const token = request.headers['x-token'];

    // verifie l existence du token et de sa validité
    const userId = await redisClient.get(`auth_${token}`);
    if (!userId) {
      return response.status(401).json({ error: 'Unauthorized' });
    }

    // Recup le user corresponda
    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return response.status(401).json({ error: 'Unauthorized' });
    }
    return response.status(200).json({ id: user._id, email: user.email });
  }
}

export default UsersController;