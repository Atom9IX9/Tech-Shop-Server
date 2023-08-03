const { create, getAll, getOne } = require("../controllers/productController")

const Router = require("express")

const router = new Router()

router.post("/", create)
router.get("/", getAll)
router.get("/:id", getOne)

module.exports = router