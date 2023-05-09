const express = require("express");
const router = express.Router();
const multer = require("multer"); // pour gérer le téléchargement de fichiers
const auth = require("../middlewares/auth"); // middleware pour vérifier le token JWT
const Picture = require("../models/Picture"); // modèle Mongoose pour les images

// Configuration de Multer pour gérer le téléchargement de fichiers
const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, "uploads/");
	},
	filename: (req, file, cb) => {
		const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
		cb(null, uniqueSuffix + "-" + file.originalname);
	},
});
const upload = multer({ storage });

// Route pour télécharger une image
router.get("/images/:id", async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		res.sendFile(image.filename, { root: "uploads/" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

// Route pour récupérer toutes les images d'un utilisateur
router.get("/images", auth, async (req, res) => {
	try {
		const images = await Picture.find({ user: req.user.id });
		res.json(images);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

// Route pour créer une nouvelle image
router.post("/images", auth, upload.single("image"), async (req, res) => {
	try {
		const newImage = new Picture({
			filename: req.file.filename,
			originalName: req.file.originalname,
			mimetype: req.file.mimetype,
			size: req.file.size,
			user: req.user.id,
		});
		const savedImage = await newImage.save();
		res.json(savedImage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

// Route pour mettre à jour une image
router.put("/images/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		if (image.user.toString() !== req.user.id) {
			return res.status(401).json({ message: "Not authorized" });
		}
		image.originalName = req.body.originalName;
		const savedImage = await image.save();
		res.json(savedImage);
	} catch (error) {
		console.error(error);
		res.status(500).json({ message: "Server error" });
	}
});

// Route pour supprimer une image
router.delete("/images/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		if (image.user.toString() !== req.user.id) {
			return res.status(401).json({ message: "Not authorized" });
		}
		await image.remove();
		res.json({ message: "Image deleted" });
	} catch (error) {
		console.log(error);
	}
});

module.exports = router