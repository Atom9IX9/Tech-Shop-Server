const { check, signIn, signUp } = require("../controllers/userController");

const Router = require("express");

const router = new Router();

router.post("/sign-up", signUp);
router.post("/sing-in", signIn);
router.get("/auth", check);

module.exports = router;
