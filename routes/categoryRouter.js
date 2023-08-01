const { create, getAll } = require("../controllers/categoryController");

const Router = require("express");

const router = new Router();

router.post("/", create);
router.get("/", getAll);

module.exports = router;
