const express = require("express");
const batchController = require("../controllers/batchController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router.route("/").get(batchController.getAllBatches);
router.route("/my").get(batchController.getMyBatches);

router.route("/:batchId").get(batchController.getBatch);

router.route("/:batchId/:updateType").patch(batchController.updateBatch);

module.exports = router;
