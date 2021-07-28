module.exports = (err, req, res, next) => {
  console.log(err);
  return res.status(err.statusCode).json({
    status: "fail",
    error: Array.isArray(err.message) ? err.message : [err.message],
  });
};
