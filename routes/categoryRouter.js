const {
  create,
  getAll,
  removeCategory,
  createSubcategory,
  createProductSubcategory,
  getProductSubcategories,
  getSubcategoriesWithCategory
} = require("../controllers/categoryController");

const Router = require("express");
const checkRole = require("../middleware/checkRoleMiddleware");

const router = new Router();

router.post("/", checkRole("ADMIN"), create);
router.post("/subcategory", checkRole("ADMIN"), createSubcategory);
router.post("/productSubcategory", checkRole("ADMIN"), createProductSubcategory);
router.get("/productSubcategory/:productId", getProductSubcategories);
router.delete("/:code", checkRole("ADMIN"), removeCategory);
router.get("/:categoryCode/:order?", getSubcategoriesWithCategory);
router.get("/", getAll);

module.exports = router;
