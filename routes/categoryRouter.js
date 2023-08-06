const { create, getAll } = require("../controllers/categoryController");

const Router = require("express");
const checkRole = require("../middleware/checkRoleMiddleware");

const router = new Router();

router.post("/", checkRole("ADMIN"), create);
router.get("/", getAll);

module.exports = router;
