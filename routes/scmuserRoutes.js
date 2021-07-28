const express = require("express");

const authController = require("../controllers/authController");

const scmuserController = require("../controllers/scmuserController");

const router = express.Router();

router
  .route("/")
  .post(scmuserController.upload, scmuserController.createSCMUser);
router.route("/login").post(authController.login);
router.route("/me").get(authController.protect, authController.getMyProfile);
router
  .route("/donations")
  .get(authController.protect, scmuserController.getMyDonations);

router
  .route("/:role/:userId")
  .get(authController.protect, scmuserController.getSCMUserById);
router
  .route("/:role")
  .get(authController.protect, scmuserController.getSCMUsers);

module.exports = router;
