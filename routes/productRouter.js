const { create, getAll, getOne } = require("../controllers/productController")

const Router = require("express")
const checkRole = require("../middleware/checkRoleMiddleware")

const router = new Router()

router.post("/", checkRole("ADMIN"), create)
router.get("/", getAll)
router.get("/:id", getOne)

module.exports = router