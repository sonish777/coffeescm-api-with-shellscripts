const express = require("express");
const consumerController = require("../controllers/consumerController");

const router = express.Router();

router.route("/batches").get(consumerController.getAllBatches);
router.route("/batches/:batchId").get(consumerController.getCurrentBatch);
router.route("/donate").post(consumerController.donate);

module.exports = router;
