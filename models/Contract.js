const axios = require("axios");
const dotenv = require("dotenv");

const { generateResourceClassname, generateUUID } = require("../helper");
dotenv.config({ path: "../config.env" });

/*
[
    {
      "$class": "org.coffeescm.Contract",
      "contractId": "string",
      "createdDateTime": "2021-05-25T12:53:37.731Z",
      "active": "true",
      "batch": {},
      "grower": {},
      "farmInspector": {},
      "shipper": {},
      "processor": {}
    }
]

{
    "$class": "org.coffeescm.CreateContract",
    "contractId": "",
    "batchId": "",
    "grower": "resource:org.coffeescm.Grower#1126"
}
*/
class Contract {
  constructor({
    contractId,
    batchId,
    grower,
    active,
    farmInspector,
    shipper,
    processor,
  }) {
    this.contractId = contractId;
    this.batchId = batchId;
    this.grower = grower;
    this.active = active;
    this.farmInspector = farmInspector;
    this.shipper = shipper;
    this.processor = processor;
  }

  static async get(filter = null, blockchainUrl) {
    try {
      const result = await axios({
        method: "GET",
        url: filter
          ? `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Contract?filter=${filter}`
          : `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Contract`,
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
            }/Contract/${id}?filter=${filter}`
          : `${
              blockchainUrl ? blockchainUrl : process.env.BLOCKCHAIN_URL
            }/Contract/${id}`,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async set(blockchainUrl) {
    this.contractId = this.contractId || generateUUID("CON");
    this.batchId = this.batchId || generateUUID("BAT");
    try {
      const result = await axios({
        method: "POST",
        url: "http://192.168.246.128:3000/api/CreateContract",
        data: {
          $class: "org.coffeescm.CreateContract",
          ...this,
          grower: `${generateResourceClassname("grower")}${this.grower}`,
        },
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  async update({ farmInspector, shipper, processor }, blockchainUrl) {
    const data = {};
    if (farmInspector)
      data.farmInspector =
        generateResourceClassname("farminspector") + farmInspector;
    if (shipper) data.shipper = generateResourceClassname("shipper") + shipper;
    if (processor)
      data.processor = generateResourceClassname("processor") + processor;
    try {
      const result = await axios({
        method: "POST",
        url: `${
          blockchainUrl
            ? blockchainUrl
            : process.env.BLOCKCHAIN_URL || "http://192.168.246.128:3000/api"
        }/AddContractParticipants`,
        data: {
          $class: "org.coffeescm.AddContractParticipants",
          currentContract:
            generateResourceClassname("contract") + this.contractId,
          ...data,
        },
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = Contract;
