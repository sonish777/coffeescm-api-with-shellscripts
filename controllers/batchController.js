const AppError = require("../AppError");
const {
  catchAsyncError,
  getUpdateType,
  generateResourceClassname,
  generateMapKey,
  urlGenerator,
} = require("../helper");
const Batch = require("../models/Batch");
const Contract = require("../models/Contract");

module.exports.getAllBatches = catchAsyncError(async (req, res, next) => {
  const blockchainUrl = urlGenerator(
    process.env.BLOCKCHAIN_URI,
    req.user.userId
  );
  const data = await Batch.get(
    JSON.stringify({
      include: "resolve",
    }),
    blockchainUrl
  );
  return res.status(200).json({
    status: "success",
    data,
  });
});

module.exports.getBatch = catchAsyncError(async (req, res, next) => {
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

module.exports.updateBatch = catchAsyncError(async (req, res, next) => {
  const blockchainUrl = urlGenerator(
    process.env.BLOCKCHAIN_URI,
    req.user.userId
  );
  const { batchId, updateType } = req.params;
  if (!batchId) return next(new AppError(400, "Batch Id must be provided"));
  if (!updateType)
    return next(new AppError(400, "Update type must be provided"));
  const currentBatch = await Batch.getById({ id: batchId });
  if (!currentBatch)
    return next(new AppError(404, "Batch for given ID was not found"));
  const typecastedObj = new Batch({ ...currentBatch });
  const updateTypeString = getUpdateType(updateType);
  const updatedBatch = await typecastedObj.update(
    {
      type: updateTypeString,
      ...req.body,
    },
    blockchainUrl
  );
  return res.status(200).json({
    status: "success",
    data: updatedBatch,
  });
});

module.exports.getMyBatches = catchAsyncError(async (req, res, next) => {
  const blockchainUrl = urlGenerator(
    process.env.BLOCKCHAIN_URI,
    req.user.userId
  );
  const userId = req.user.userId;
  const resourceString = generateResourceClassname(req.user.role);
  const myContracts = await Contract.get(
    JSON.stringify({
      where: {
        [generateMapKey(req.user.role)]:
          resourceString.replace("#", "%23") + userId,
      },
      include: "resolve",
    }),
    blockchainUrl
  );
  const myBatches = myContracts.map((el) => el.batch);
  res.status(200).json({
    status: "success",
    data: myBatches,
  });
});
