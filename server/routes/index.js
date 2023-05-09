var express = require("express");
var router = express.Router();
const app = express()
const usersRouter = require("./users");
/* GET home page. */
router.get("/", function (req, res, next) {
	res.render("index", { title: "Express" });
});

app.use("/users", usersRouter);

module.exports = router;

