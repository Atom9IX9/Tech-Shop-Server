const { create, getAll, getOne } = require("../controllers/productController")

const Router = require("express")

const router = new Router()

router.post("/", create)
router.get("/", getAll)
router.get("/product/:id", getOne)

module.exports = router