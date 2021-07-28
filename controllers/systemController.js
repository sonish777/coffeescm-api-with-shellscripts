const jwt = require("jsonwebtoken");
const AppError = require("../AppError");
const { catchAsyncError } = require("../helper");
const { SystemHistorian, SystemIdentities } = require("../models/System");

module.exports.getSystemHistorian = catchAsyncError(async (req, res, next) => {
  const data = await SystemHistorian.get();
  res.status(200).json({
    status: "success",
    data,
  });
});

module.exports.getSystemIdentities = catchAsyncError(async (req, res, next) => {
  const data = await SystemIdentities.get();
  res.status(200).json({
    status: "success",
    data,
  });
});

module.exports.getSystemHistorianById = catchAsyncError(
  async (req, res, next) => {
    const { id } = req.params;
    const data = await SystemHistorian.getById({ id });
    res.status(200).json({
      status: "success",
      data,
    });
  }
);

// module.exports.getMySystemIdentity = catchAsyncError(async (req, res, next) => {
//   console.log("INSIDEEEE");
//   const userId = req.user.userId;
//   const result = await SystemIdentities.get();
//   // console.log(result);
//   // const data = result.find((el) => el.participant.split("#")[1] === userId);
//   res.status(200).json({
//     status: "success",
//     data: result,
//   });
// });

module.exports.getMyProfile = (req, res, next) => {
  const token = req.cookies.adminJwt || req.header("x-auth-token");
  if (!token) return next(new AppError(401, "You are not authorized"));

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedToken)
    return next(new AppError(400, "Your token is no longer valid"));

  if (decodedToken.id !== "admin" || !decodedToken.isAdmin) {
    return next(
      new AppError(404, "The token belonging to the user doesn't exist")
    );
  }

  return res.status(200).json({
    status: "success",
    data: {
      userId: decodedToken.id,
      name: "Network Admin",
      email: "admin",
      contact: "-",
      address: "-",
    },
  });
};

module.exports.login = (req, res, next) => {
  const { username, password, isAdmin } = req.body;

  if (!username || !password) {
    return next(new AppError(400, "Please provide you email and password"));
  }

  if (isAdmin) {
    if (username === "admin" && password === "adminpw") {
      console.log("inside");
      const token = jwt.sign(
        { id: username, isAdmin: true },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "24h",
        }
      );
      if (!token)
        return next(
          new AppError(500, "Something went wrong while creating token")
        );

      res.cookie("adminJwt", token, {
        expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
        httpOnly: true,
      });

      res.status(200).json({
        status: "success",
        data: {
          userId: username,
          name: "Network Admin",
          email: "admin",
          contact: "-",
          address: "-",
          role: "NETWORKADMIN",
        },
        token,
      });
    } else {
      res.status(400).json({
        status: "fail",
        error: ["Invalid username or password"],
      });
    }
  } else {
    res.status(400).json({
      status: "fail",
      error: ["You are not authorized"],
    });
  }
};
