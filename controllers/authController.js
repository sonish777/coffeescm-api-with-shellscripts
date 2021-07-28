const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const SCMUser = require("../models/SCMUser");
const AppError = require("../AppError");
const { catchAsyncError } = require("../helper");

module.exports.loginAdmin = async (req, res, next) => {};

module.exports.login = catchAsyncError(async (req, res, next) => {
  const { role, email, password } = req.body;
  console.log(role, email, password);
  if (!email || !password) {
    return next(new AppError(400, "Please provide you email and password"));
  }
  const user = (await SCMUser.get({ role, email }))[0];
  if (!user) return next(new AppError(404, "Invalid email or password"));

  if (!(await bcrypt.compare(password, user.password)))
    return next(new AppError(400, "Invalid email or password"));

  const token = jwt.sign(
    { id: user.userId, role: user.role },
    process.env.JWT_SECRET_KEY,
    {
      expiresIn: "24h",
    }
  );
  if (!token)
    return next(new AppError(500, "Something went wrong while creating token"));

  res.cookie("jwt", token, {
    expires: new Date(Date.now() + 24 * 60 * 60 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    status: "success",
    data: user,
    token,
  });
});

module.exports.protect = catchAsyncError(async (req, res, next) => {
  console.log("Accessing Proteceted route.........");
  const token = req.cookies.jwt || req.header("x-auth-token");
  console.log("TOKEN IN COOKIES", req.cookies.jwt);
  console.log("TOKEN IN HEADER", req.header("x-auth-token"));
  if (!token) return next(new AppError(401, "You are not authorized"));

  const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
  if (!decodedToken)
    return next(new AppError(400, "Your token is no longer valid"));

  if (decodedToken.isAdmin) {
    req.user = {
      userId: decodedToken.id,
      name: "Network Admin",
      email: "admin",
      contact: "-",
      address: "-",
      role: "NETWORKADMIN",
    };
    return next();
  }

  const user = await SCMUser.getById({
    role: decodedToken.role,
    id: decodedToken.id,
  });
  if (!user)
    return next(
      new AppError(404, "The token belonging to the user doesn't exist")
    );

  req.user = user;

  next();
});

module.exports.restrictedTo =
  ([...roles]) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(403, "You are forbidden from performing this action")
      );
    } else next();
  };

module.exports.getMyProfile = catchAsyncError(async (req, res, next) => {
  const data = await SCMUser.getById({
    role: req.user.role,
    id: req.user.userId,
  });
  return res.status(200).json({
    status: "success",
    data,
  });
});
