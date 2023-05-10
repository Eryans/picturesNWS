const express = require("express");
const router = express.Router();
const multer = require("multer"); // pour gérer le téléchargement de fichiers
const auth = require("../middlewares/auth"); // middleware pour vérifier le token JWT
const Picture = require("../models/Picture"); // modèle Mongoose pour les images
const User = require("../models/User");

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
router.get("/download/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res.status(404).json({ message: "Image not found" });
		}
		res.sendFile(image.filename, { root: "uploads/" });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Route pour récupérer toutes les images d'un utilisateur
router.get("/all", auth, async (req, res) => {
	try {
		const images = await Picture.find({ user: req.user.id });
		res.json({ success: true, image: images });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Route pour créer une nouvelle image
router.post("/upload", auth, upload.single("image"), async (req, res) => {
	try {
		const newImage = new Picture({
			filename: req.file.filename,
			originalName: req.file.originalname,
			mimetype: req.file.mimetype,
			size: req.file.size,
			user: req.user.id,
		});
		const savedImage = await newImage.save();
		const user = await User.findById(req.body.userId);
		if (!user) res.json({ success: false, message: "no user found" });
		user.pictures = [savedImage, ...user.pictures];
		await user.save()
		res.json({ success: true, image: savedImage });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Route pour mettre à jour une image
router.put("/:id", auth, async (req, res) => {
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
		res.json({ success: true, image: savedImage });
	} catch (error) {
		console.error(error);
		res.status(500).json({ success: false, message: "Server error" });
	}
});

// Route pour supprimer une image
router.delete("/:id", auth, async (req, res) => {
	try {
		const image = await Picture.findById(req.params.id);
		if (!image) {
			return res
				.status(404)
				.json({ success: false, message: "Image not found" });
		}
		if (image.user.toString() !== req.user.id) {
			return res
				.status(401)
				.json({ success: false, message: "Not authorized" });
		}
		await image.remove();
		res.json({ success: true, message: "Image deleted" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, error: error });
	}
});

router.delete("/all-user-images", auth, async (req, res) => {
	try {
		const user = await User.findById(req.body.userId);
		await Picture.deleteMany({ user: user._id });
		res.json({ success: true, message: "deleted all user pictures" });
	} catch (error) {
		console.log(error);
		res.json({ success: false, error: error });
	}
});

module.exports = router;
