const AppError = require("../AppError");
const {
  catchAsyncError,
  generateResourceClassname,
  generateMapKey,
  urlGenerator,
} = require("../helper");
const Contract = require("../models/Contract");

module.exports.getAllContracts = catchAsyncError(async (req, res, next) => {
  const blockchainUrl = urlGenerator(
    process.env.BLOCKCHAIN_URI,
    req.user.userId
  );
  const data = await Contract.get(
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

module.exports.getContract = catchAsyncError(async (req, res, next) => {
  const { contractId } = req.params;
  if (!contractId)
    return next(new AppError(400, "Please provide a contract ID"));
  const data = await Contract.getById(
    { id: contractId },
    JSON.stringify({
      include: "resolve",
    })
  );
  return res.status(200).json({
    status: "success",
    data,
  });
});

module.exports.createContract = catchAsyncError(async (req, res, next) => {
  const grower = req.user.email === "admin" ? req.body.grower : req.user.userId;
  console.log("GROWER ISS", grower);
  console.log("CURRENT LOGGED IN USER", req.user.userId);
  const newContract = new Contract({
    ...req.body,
    grower: req.user.email === "admin" ? req.body.grower : req.user.userId,
  });
  const data = await newContract.set();
  return res.status(201).json({
    status: "success",
    data,
  });
});

module.exports.addContractParticipants = catchAsyncError(
  async (req, res, next) => {
    const blockchainUrl = urlGenerator(
      process.env.BLOCKCHAIN_URI,
      req.user.userId
    );
    const { contractId } = req.params;
    if (!contractId)
      return next(new AppError(400, "Please provide a contract ID"));
    const currentContract = await Contract.getById({ id: contractId });
    if (!currentContract)
      return next(new AppError(404, "Contract for given ID was not found"));
    const typecastedObject = new Contract({ ...currentContract });
    const updatedContract = await typecastedObject.update(
      { ...req.body },
      blockchainUrl
    );
    return res.status(200).json({
      status: "success",
      data: updatedContract,
    });
  }
);

module.exports.getMyContracts = catchAsyncError(async (req, res, next) => {
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
  res.status(200).json({
    status: "success",
    data: myContracts,
  });
});
