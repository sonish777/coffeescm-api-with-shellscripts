const axios = require("axios");

class SystemHistorian {
  constructor({}) {}

  static async get() {
    try {
      const result = await axios({
        method: "GET",
        url: `${process.env.BLOCKCHAIN_URL}/system/historian`,
      });

      return result.data;
    } catch (error) {
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      const result = await axios({
        method: "GET",
        url: `${process.env.BLOCKCHAIN_URL}/system/historian/${id}`,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

class SystemIdentities {
  constructor({}) {}

  static async get() {
    try {
      const result = await axios({
        method: "GET",
        url: `${process.env.BLOCKCHAIN_URL}/system/identities`,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }

  static async getById({ id }) {
    try {
      const result = await axios({
        method: "GET",
        url: `${process.env.BLOCKCHAIN_URL}/system/identities/${id}`,
      });
      return result.data;
    } catch (error) {
      throw error;
    }
  }
}

module.exports.SystemHistorian = SystemHistorian;
module.exports.SystemIdentities = SystemIdentities;
