const router = require("express").Router();
const systemController = require("../controllers/systemController");
const authController = require("../controllers/authController");

router.route("/login").post(systemController.login);
router.route("/me").get(systemController.getMyProfile);

router.use(authController.protect);
router.route("/historian").get(systemController.getSystemHistorian);
router.route("/identities").get(systemController.getSystemIdentities);
router.route("/historian/:id").get(systemController.getSystemHistorianById);
// router.route("/me").get(systemController.getMySystemIdentity);

module.exports = router;
