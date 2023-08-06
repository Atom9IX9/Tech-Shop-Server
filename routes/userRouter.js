const { check, signIn, signUp } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

const Router = require("express");

const router = new Router();

router.post("/sign-up", signUp);
router.post("/sign-in", signIn);
router.get("/auth", authMiddleware, check);

module.exports = router;
