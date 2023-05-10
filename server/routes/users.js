const express = require("express");
const bcrypt = require("bcrypt");
const User = require("../models/User");
const auth = require("../middlewares/auth");
const createToken = require("../helpers/jwt");
var router = express.Router();

// Créer un nouvel utilisateur
router.post("/create", async (req, res) => {
	try {
		const { name, password } = req.body;

		// Vérifier si l'utilisateur existe déjà
		const existingUser = await User.findOne({ name });
		if (existingUser) {
			return res
				.status(400)
				.json({ message: "Cet utilisateur existe déjà" });
		}

		// Hasher le mot de passe avant de le stocker
		const hashedPassword = await bcrypt.hash(password, 10);

		// Créer un nouvel utilisateur avec le mot de passe hashé
		const newUser = new User({ name, password: hashedPassword });
		const savedUser = await newUser.save();
		const token = createToken(savedUser);
		res.json({ token: token, newUser: savedUser });
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

// Récupérer tous les utilisateurs
router.get("/all", auth, async (req, res) => {
	try {
		const users = await User.find();
		res.json(users);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

// Récupérer un utilisateur par son ID
router.get("/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findById(id);
		if (!user) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}
		res.json(user);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

// Mettre à jour un utilisateur par son ID
router.put("/update/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;
		const { name, password } = req.body;

		// Vérifier si l'utilisateur existe
		const existingUser = await User.findById(id);
		if (!existingUser) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		// Hasher le nouveau mot de passe avant de le stocker
		const hashedPassword = await bcrypt.hash(password, 10);

		// Mettre à jour l'utilisateur avec le nouveau nom et le nouveau mot de passe hashé
		existingUser.name = name;
		existingUser.password = hashedPassword;
		const updatedUser = await existingUser.save();

		res.json(updatedUser);
	} catch (err) {
		console.error(err);
		res.status(500).json({ message: "Erreur serveur" });
	}
});

// Supprimer un utilisateur par son ID
router.delete("/:id", auth, async (req, res) => {
	try {
		const { id } = req.params;

		// Vérifier si l'utilisateur existe
		const existingUser = await User.findById(id);
		if (!existingUser) {
			return res.status(404).json({ message: "Utilisateur non trouvé" });
		}

		// Supprimer l'utilisateur
		await existingUser.remove();

		res.json({ message: "Utilisateur supprimé" });
	} catch (err) {
		console.error(err);
		res.status(500);
	}
});

// LOGIN
router.post("/login", async (req, res) => {
	try {
		const { name, password } = req.body;
		const user = await User.findOne({ name });
		if (!user) throw Error("User not found");

		const isMatch = await bcrypt.compare(password, user.password);
		if (!isMatch) throw Error("Invalid credentials");

		const token = createToken(user);
		res.status(200).json({
			token: token,
			user: { id: user._id, name: user.name },
		});
	} catch (err) {
		res.status(400).json({ msg: err.message });
	}
});

module.exports = router;
