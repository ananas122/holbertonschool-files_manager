import { v4 as uuidv4 } from 'uuid';
import sha1 from 'sha1';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AuthController {
  // Method to connect a user and generate an authentication token.
  static async getConnect(req, res) {
    // Extraction and decoding of the credentials of the authorization header.
    const authorizationHeader = req.headers.authorization || '';
    const [email, password] = Buffer.from(authorizationHeader.replace('Basic ', ''), 'base64').toString().split(':');
    if (!email || !password) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Search for the user in the database and verify the password.
    const user = await dbClient.db.collection('users').findOne({ email, password: sha1(password) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Creation of a new token and storage in Redis.
    const token = uuidv4();
    await redisClient.set(`auth_${token}`, user._id.toString(), 24 * 60 * 60);

    // Return of the generated token to the user.
    return res.status(200).json({ token });
  }

  // Method to disconnect a user by invalidating his token.
  static async getDisconnect(req, res) {
    // Retrieval of the user's authentication token from the header.
    const token = req.headers['x-token'];
    if (!token || !await redisClient.get(`auth_${token}`)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }

    // Removal of the token from the Redis cache.
    await redisClient.del(`auth_${token}`);
    return res.status(204).end();
  }
}

export default AuthController;
