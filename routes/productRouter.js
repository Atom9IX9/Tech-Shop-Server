const {
  create,
  getAll,
  getOne,
  addLike,
  removeLike,
  getLikedProductIds,
  getLikedProducts,
  updateDescription,
  addRate,
  getProductsWithSubcategory
} = require("../controllers/productController");

const Router = require("express");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/", checkRole("ADMIN"), create);
router.post("/like/:productId", authMiddleware, addLike);
router.post("/rating/:productId", authMiddleware, addRate);
router.delete("/like/:productId", authMiddleware, removeLike);
router.get("/liked-ids", authMiddleware, getLikedProductIds);
router.get("/liked-products", authMiddleware, getLikedProducts);
router.put("/:id/description", checkRole("ADMIN"), updateDescription)
router.get("/", getAll);
router.get("/:id/user/:userId", getOne);
router.get("/subcategory/:subcategoryCode", getProductsWithSubcategory);

module.exports = router;
