const userRouter = require("./userRouter");
const productRouter = require("./productRouter");
const categoryRouter = require("./categoryRouter");

const Router = require("express");

const router = new Router();

router.use("/user", userRouter);
router.use("/category", categoryRouter);
router.use("/product", productRouter);

module.exports = router;
