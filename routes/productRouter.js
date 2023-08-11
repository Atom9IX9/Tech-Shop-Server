const {
  create,
  getAll,
  getOne,
  addLike,
  removeLike,
  getLikedProductIds,
} = require("../controllers/productController");

const Router = require("express");
const checkRole = require("../middleware/checkRoleMiddleware");
const authMiddleware = require("../middleware/authMiddleware");

const router = new Router();

router.post("/", checkRole("ADMIN"), create);
router.post("/like/:productId", authMiddleware, addLike);
router.delete("/like/:productId", authMiddleware, removeLike);
router.get("/like", authMiddleware, getLikedProductIds);
router.get("/", getAll);
router.get("/:id", getOne);

module.exports = router;
