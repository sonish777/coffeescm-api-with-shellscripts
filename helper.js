const AppError = require("./AppError");
const { PORT } = require("./port_mapping");

module.exports.portGenerator = (id) => {
  let port;
  PORT.forEach((portMap) => {
    if (portMap.id === id) port = portMap.port;
  });
  return port;
};

module.exports.urlGenerator = (url, userId) => {
  if (!this.portGenerator(userId)) {
    throw new AppError(401, "You are not authorized!");
  }
  const newUrl = url.replace("{{PORT}}", this.portGenerator(userId));
  console.log("URL :", newUrl);
  console.log("User ID :", userId);
  return newUrl;
};

module.exports.extractErrorMessage = (error) => {
  if (error.isAxiosError) {
    console.error("--------------------AXIOS ERROR---------------------");
    console.log(error.response.data);
    let message = error.response.data.error.message;
    if (message.includes("the object already exists")) {
      message = `The given id is already in use`;
    }
    const errors = message.split("Error: ");
    if (errors.length > 0) {
      message = errors[errors.length - 1];
      if (message.includes("Details: ")) {
        message = message.split("Details: ")[1];
        message = message.split(";");
      }
    }

    return message;
  }
};

module.exports.catchAsyncError = (fn) => (req, res, next) => {
  fn(req, res, next).catch((err) => {
    next(new AppError(500, this.extractErrorMessage(err) || err.message));
  });
};

module.exports.generateResourceClassname = (role) => {
  const NS = "resource:org.coffeescm.";
  switch (role.toUpperCase()) {
    case "GROWER":
      return NS + "Grower#";
    case "FARMINSPECTOR":
      return NS + "FarmInspector#";
    case "SHIPPER":
      return NS + "Shipper#";
    case "PROCESSOR":
      return NS + "Processor#";
    case "CONTRACT":
      return NS + "Contract#";
  }
};

module.exports.generateMapKey = (role) => {
  switch (role.toUpperCase()) {
    case "GROWER":
      return "grower";
    case "FARMINSPECTOR":
      return "farmInspector";
    case "SHIPPER":
      return "shipper";
    case "PROCESSOR":
      return "processor";
  }
};

module.exports.generateCapitalizedRole = (role) => {
  switch (role.toUpperCase()) {
    case "GROWER":
      return "Grower";
    case "FARMINSPECTOR":
      return "FarmInspector";
    case "SHIPPER":
      return "Shipper";
    case "PROCESSOR":
      return "Processor";
  }
};

module.exports.getUpdateType = (updateType) => {
  switch (updateType) {
    case "inspect":
      return "InspectBatch";
    case "harvest":
      return "Harvest";
    case "ship":
      return "ShipBatch";
    case "process":
      return "ProcessBatch";
  }
};

module.exports.generateUUID = (prefix) => {
  const translator = require("short-uuid")();
  translator.maxLength = 5;
  const uuid = translator.uuid();
  // console.log("SHORTENED 1", translator.fromUUID(uuid));
  // console.log("SHORTENED 2", translator.fromUUID(uuid));
  return prefix ? `${prefix}_${uuid}` : uuid;
};
