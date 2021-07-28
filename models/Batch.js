const axios = require("axios");

class Batch {
  constructor({
    batchId,
    status,
    typeOfSeed,
    coffeeFamily,
    fertilizersUsed,
    harvestedDateTime,
    dryPartchmentQunatity,
    warehouseName,
    warehouseAddress,
    shippingQuantity,
    shipId,
    shipName,
    packagingDateTime,
    packagedCount,
    temperature,
    roastingTime,
    contract,
  }) {
    this.batchId = batchId;
    this.status = status;
    this.typeOfSeed = typeOfSeed;
    this.coffeeFamily = coffeeFamily;
    this.fertilizersUsed = fertilizersUsed;
    this.harvestedDateTime = harvestedDateTime;
    this.dryPartchmentQunatity = dryPartchmentQunatity;
    this.warehouseName = warehouseName;
    this.warehouseAddress = warehouseAddress;
    this.shippingQuantity = shippingQuantity;
    this.shipId = shipId;
    this.shipName = shipName;
    this.packagingDateTime = packagingDateTime;
    this.packagedCount = packagedCount;
    this.temperature = temperature;
    this.roastingTime = roastingTime;
    this.contract = contract;
  }

  static async get(filter = null, blockchainUrl) {
    try {
      const result = await axios({
        methood: "GET",
        url: filter
          ? `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Batch?filter=${filter}`
          : `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Batch`,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  static async getById({ id }, filter = null, blockchainUrl) {
    try {
      const result = await axios({
        method: "GET",
        url: filter
          ? `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Batch/${id}?filter=${filter}`
          : `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Batch/${id}`,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async update({ type, ...args }, blockchainUrl) {
    let url = "";
    let className = "";
    switch (type.toUpperCase()) {
      case "INSPECTBATCH":
        url = `${
          blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
        }/InspectBatch`;
        className = "org.coffeescm.InspectBatch";
        return updateBatchAs(url, className, args, this);

      case "HARVEST":
        url = `${
          blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
        }/Harvest`;
        className = "org.coffeescm.Harvest";
        return updateBatchAs(url, className, args, this);

      case "SHIPBATCH":
        url = `${
          blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
        }/ShipBatch`;
        className = "org.coffeescm.ShipBatch";
        return updateBatchAs(url, className, args, this);

      case "PROCESSBATCH":
        console.log(blockchainUrl);
        url = `${process.env.BLOCKCHAIN_URL}/ProcessBatch`;
        className = "org.coffeescm.ProcessBatch";
        return updateBatchAs(url, className, args, this);
    }
  }
}

async function updateBatchAs(url, $class, args, obj) {
  try {
    const result = await axios({
      method: "POST",
      url,
      data: {
        $class,
        ...args,
        currentContract: obj.contract,
      },
    });
    return result.data;
  } catch (error) {
    throw error;
  }
}

module.exports = Batch;

/*
[
  {
    "$class": "org.coffeescm.Batch",
    "batchId": "string",
    "status": "GROWING",
    "typeOfSeed": "string",
    "coffeeFamily": "string",
    "fertilizersUsed": [],
    "harvestedDateTime": "2021-05-25T15:16:04.282Z",
    "dryParchmentQuantity": 0,
    "warehouseName": "string",
    "warehouseAddress": "string",
    "shippingQuantity": 0,
    "shipId": "string",
    "shipName": "string",
    "estimatedDateTime": "2021-05-25T15:16:04.282Z",
    "packagingDateTime": "2021-05-25T15:16:04.282Z",
    "packagedCount": 0,
    "temperature": 0,
    "roastingTime": 0,
    "contract": {}
  }
]
*/
