const express = require("express");
const contractController = require("../controllers/contractController");
const authController = require("../controllers/authController");

const router = express.Router();

router.use(authController.protect);
router
  .route("/")
  .get(contractController.getAllContracts)
  .post(
    authController.restrictedTo(["NETWORKADMIN", "GROWER"]),
    contractController.createContract
  );

router.route("/my").get(contractController.getMyContracts);

router
  .route("/:contractId")
  .get(contractController.getContract)
  .patch(
    authController.restrictedTo(["GROWER", "NETWORKADMIN"]),
    contractController.addContractParticipants
  );

module.exports = router;
