const {
  create,
  getAll,
  getOne,
  addLike,
  removeLike,
  getLikedProductIds,
  getLikedProducts,
  updateDescription
} = require("../controllers/productController");

const Router = require("express");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/", checkRole("ADMIN"), create);
router.post("/like/:productId", authMiddleware, addLike);
router.delete("/like/:productId", authMiddleware, removeLike);
router.get("/liked-ids", authMiddleware, getLikedProductIds);
router.get("/liked-products", authMiddleware, getLikedProducts);
router.put("/:id/description", checkRole("ADMIN"), updateDescription)
router.get("/", getAll);
router.get("/:id", getOne);

module.exports = router;
