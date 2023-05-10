const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// middleware pour vérifier le jeton d'authentification
const auth = (req, res, next) => {
  const token = req.header('auth-token');
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  try {
    // Vérification du token hashé avec bcrypt.compareSync()
    const decodedToken = bcrypt.compareSync(token, process.env.JWT_SECRET);
    if (!decodedToken) throw new Error();

    // Décodage du token avec jwt.verify()
    const decoded = jwt.verify(decodedToken, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(400).json({ msg: 'Invalid token' });
  }
};

module.exports = auth;
