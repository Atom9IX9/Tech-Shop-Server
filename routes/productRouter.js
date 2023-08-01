const { create, getAll, getProduct } = require("../controllers/productController")

const Router = require("express")

const router = new Router()

router.post("/product", create)
router.get("/product", getAll)
router.get("/product/:id", getProduct)

module.exports = router