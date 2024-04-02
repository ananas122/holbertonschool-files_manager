// controllers/UsersController.js

const dbClient = require('../utils/db');
const crypto = require('crypto');

class UsersController {
    static async postNew(req, res) {
        // Récupération des données du corps de la requête
        const { email, password } = req.body;

        // Affichage des données reçues dans la console pour débogage
        console.log('Received email:', email);
        console.log('Received password:', password);


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
            const email = result.ops[0].email;
            const id = result.insertedId;

            // Retourner le nouvel utilisateur avec l'email et l'id généré par MongoDB
            return res.status(201).json({ email, id });
        });
    }
}

module.exports = UsersController;
