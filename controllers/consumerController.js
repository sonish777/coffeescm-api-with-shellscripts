const translator = require("short-uuid")();
const axios = require("axios");

const { catchAsyncError, generateResourceClassname } = require("../helper");
const Batch = require("../models/Batch");
const Contract = require("../models/Contract");

module.exports.getAllBatches = catchAsyncError(async (req, res, next) => {
  const data = await Contract.get(
    JSON.stringify({
      where: {
        active: false,
      },
      include: "resolve",
    })
  );
  if (data.length > 0) {
    data.forEach((el) => {
      const batchId = el.batch.batchId.split("BAT_")[1];
      const shortBatchId = translator.fromUUID(batchId);
      el.batch.shortBatchId = shortBatchId;
    });
  }
  return res.status(200).json({
    status: "success",
    data,
  });
});

module.exports.getCurrentBatch = catchAsyncError(async (req, res, next) => {
  const { batchId } = req.params;
  if (!batchId) return next(new AppError(400, "Batch Id must be provided"));
  const data = await Batch.getById(
    { id: batchId },
    JSON.stringify({
      include: "resolve",
    })
  );
  return res.status(200).json({
    status: "success",
    data,
  });
});

// filter={"where": {"grower":"resource:org.coffeescm.Grower%23g1"}, "include":"resolve"}

module.exports.donate = catchAsyncError(async (req, res, next) => {
  let data = {
    token: req.body.token,
    amount: req.body.amount,
  };

  let config = {
    headers: {
      Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
    },
  };

  const response = await axios.post(
    "https://khalti.com/api/v2/payment/verify/",
    data,
    config
  );

  console.log(response.data);

  if (response.data) {
    const responseBlockchain = await axios.post(
      `${process.env.BLOCKCHAIN_URL}/Donation`,
      {
        $class: "org.coffeescm.Donation",
        donationId: translator.generate(),
        customer: {
          $class: "org.coffeescm.Customer",
          customerName: response.data.user.name,
          customerEmail: req.body.email ? req.body.email : "",
        },
        donationMessage: req.body.donationMessage
          ? req.body.donationMessage
          : "",
        donationAmt: response.data.amount / 100,
        grower: `${generateResourceClassname("grower")}${
          req.body.product_identity
        }`,
      }
    );
    if (responseBlockchain.data) {
      res.status(200).json({
        status: "success",
        data: responseBlockchain.data,
      });
    }
  }
});
