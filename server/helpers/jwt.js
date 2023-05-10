const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Création et envoi du token JWT
const createToken = (user) => {
	// Création du payload du JWT
	const payload = {
		user: {
			id: user.id,
		},
	};

	// Création du token JWT avec une clé secrète
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: "1h", // Durée d'expiration du token
	});

	// Hashage du token avant de l'envoyer dans la réponse
	const hashedToken = bcrypt.hashSync(token, 10);

	return hashedToken;
};

module.exports = { createToken };
