const { default: axios } = require("axios");
const dotenv = require("dotenv");

const Contract = require("./models/Contract");
const SCMUser = require("./models/SCMUser");
dotenv.config({ path: "./config.env" });

const users = [
  {
    userId: "3f6972f2-6097-49e1-b801-640658932991",
    role: "GROWER",
    name: "Grower 1",
    email: "g1@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "f5b8cffd-11a7-4fc8-85f3-f392d4f2ed9c",
    role: "GROWER",
    name: "Grower 2",
    email: "g2@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "21b6f8e7-8a4e-4101-bfae-3f3259c50e72",
    role: "FARMINSPECTOR",
    name: "Farm Inspector 1",
    email: "fi1@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "7b179b86-89ad-4269-8727-dbd26a2bcd48",
    role: "FARMINSPECTOR",
    name: "Farm Inspector 2",
    email: "fi2@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "3c4feafe-5b11-4c8b-b3e1-db3d8ef16ffa",
    role: "SHIPPER",
    name: "Shipper 1",
    email: "s1@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "af2e31f3-c1eb-43b3-8233-adb59fc41e73",
    role: "SHIPPER",
    name: "Shipper 2",
    email: "s2@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "19703578-c15a-44ca-bdea-64d726092bf8",
    role: "PROCESSOR",
    name: "Processor 1",
    email: "p1@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
  {
    userId: "27cb973d-86fa-4aa3-806d-10aac71563da",
    role: "PROCESSOR",
    name: "Processor 2",
    email: "p2@email.com",
    password: "test1234",
    contact: "98989898",
    avatarPath: "default.jpg",
  },
];

const contracts = [
  {
    contractId: "CON_2b6f07f2-d73c-4d91-9955-5130466660d2",
    batchId: "BAT_2ccb55f0-9632-4e90-89e4-8b97a3fc5c8f",
    grower: "3f6972f2-6097-49e1-b801-640658932991",
    farmInspector: "21b6f8e7-8a4e-4101-bfae-3f3259c50e72",
    shipper: "af2e31f3-c1eb-43b3-8233-adb59fc41e73",
    processor: "27cb973d-86fa-4aa3-806d-10aac71563da",
  },
  {
    contractId: "CON_e693fe01-c5f7-4a4c-8881-aa3ebaeee0cc",
    batchId: "BAT_040b3205-176d-47ed-8fbc-00cf96b57a6e",
    grower: "f5b8cffd-11a7-4fc8-85f3-f392d4f2ed9c",
    farmInspector: "7b179b86-89ad-4269-8727-dbd26a2bcd48",
    shipper: "3c4feafe-5b11-4c8b-b3e1-db3d8ef16ffa",
    processor: "19703578-c15a-44ca-bdea-64d726092bf8",
  },
  {
    contractId: "CON_98dd86bf-3e8e-4e6c-ab26-b7683d062227",
    batchId: "BAT_5362fba7-4444-4e04-9427-753c2339a5ec",
    grower: "3f6972f2-6097-49e1-b801-640658932991",
    farmInspector: "21b6f8e7-8a4e-4101-bfae-3f3259c50e72",
    shipper: "af2e31f3-c1eb-43b3-8233-adb59fc41e73",
    processor: "19703578-c15a-44ca-bdea-64d726092bf8",
  },
  {
    contractId: "CON_589e5647-6d50-4c4a-931d-a9515ed3567d",
    batchId: "BAT_e1a4ba71-c1ff-4b12-88d0-354fe9771792",
    grower: "f5b8cffd-11a7-4fc8-85f3-f392d4f2ed9c",
    farmInspector: "7b179b86-89ad-4269-8727-dbd26a2bcd48",
    shipper: "3c4feafe-5b11-4c8b-b3e1-db3d8ef16ffa",
    processor: "27cb973d-86fa-4aa3-806d-10aac71563da",
  },
  {
    contractId: "CON_86a54d39-7ef0-4b12-93dd-1658b9ca6eb1",
    batchId: "BAT_ec4258e5-3717-4329-8610-e55153a9b809",
    grower: "3f6972f2-6097-49e1-b801-640658932991",
    farmInspector: "21b6f8e7-8a4e-4101-bfae-3f3259c50e72",
    shipper: "af2e31f3-c1eb-43b3-8233-adb59fc41e73",
    processor: "27cb973d-86fa-4aa3-806d-10aac71563da",
  },
];

const batches = [
  {
    batchId: "BAT_2ccb55f0-9632-4e90-89e4-8b97a3fc5c8f",
    $class: "org.coffeescm.Batch",
    status: "SHIPPING",
    createdDateTime: "2021-07-21T15:33:35.397Z",
    typeOfSeed: "Arabica",
    coffeeFamily: "Irish",
    fertilizersUsed: ["Compost", "Manure"],
    inspectedDateTime: "2021-07-21T15:33:35.397Z",
    harvestedDateTime: "2021-07-21T15:33:35.397Z",
    dryParchmentQuantity: 1200,
    warehouseName: "KTM Express",
    warehouseAddress: "Kathmandu",
    shippingQuantity: 1100,
    shipId: "ship_001",
    shipName: "Boyce 1NA",
    shippedDateTime: "2021-07-21T15:33:35.397Z",
    contract:
      "resource:org.coffeescm.Contract#CON_2b6f07f2-d73c-4d91-9955-5130466660d2",
  },
  {
    batchId: "BAT_040b3205-176d-47ed-8fbc-00cf96b57a6e",
    $class: "org.coffeescm.Batch",
    status: "GROWING",
    createdDateTime: "2021-07-21T15:33:35.397Z",
    contract:
      "resource:org.coffeescm.Contract#CON_e693fe01-c5f7-4a4c-8881-aa3ebaeee0cc",
  },
  {
    batchId: "BAT_5362fba7-4444-4e04-9427-753c2339a5ec",
    $class: "org.coffeescm.Batch",
    status: "PROCESSING",
    createdDateTime: "2021-07-21T15:33:35.397Z",
    typeOfSeed: "Arabica",
    coffeeFamily: "Italian",
    fertilizersUsed: ["Amonia", "Nitrate"],
    inspectedDateTime: "2021-07-21T15:33:35.397Z",
    harvestedDateTime: "2021-07-21T15:33:35.397Z",
    dryParchmentQuantity: 2300,
    warehouseName: "CCU Kathmandu",
    warehouseAddress: "Kathmandu",
    shippingQuantity: 2000,
    shipId: "ship_092",
    shipName: "Boyce N90",
    shippedDateTime: "2021-07-21T15:33:35.397Z",
    packagingDateTime: "2021-07-21T15:33:35.397Z",
    packagedCount: 5050,
    temperature: 190,
    roastingTime: 90,
    processedDateTime: "2021-07-21T15:33:35.397Z",
    contract:
      "resource:org.coffeescm.Contract#CON_98dd86bf-3e8e-4e6c-ab26-b7683d062227",
  },
  {
    batchId: "BAT_e1a4ba71-c1ff-4b12-88d0-354fe9771792",
    $class: "org.coffeescm.Batch",
    status: "INSPECTION",
    createdDateTime: "2021-07-21T15:33:35.397Z",
    typeOfSeed: "Robusta",
    coffeeFamily: "Arabic",
    fertilizersUsed: ["Manure"],
    inspectedDateTime: "2021-07-21T15:33:35.397Z",
    contract:
      "resource:org.coffeescm.Contract#CON_589e5647-6d50-4c4a-931d-a9515ed3567d",
  },
  {
    batchId: "BAT_ec4258e5-3717-4329-8610-e55153a9b809",
    $class: "org.coffeescm.Batch",
    status: "HARVESTED",
    createdDateTime: "2021-07-21T15:33:35.397Z",
    typeOfSeed: "Robusta",
    coffeeFamily: "Terai",
    fertilizersUsed: ["Potassium", "Nitrate"],
    inspectedDateTime: "2021-07-21T15:33:35.397Z",
    harvestedDateTime: "2021-07-21T15:33:35.397Z",
    dryParchmentQuantity: 1920,
    contract:
      "resource:org.coffeescm.Contract#CON_86a54d39-7ef0-4b12-93dd-1658b9ca6eb1",
  },
];

const insertUsers = () => {
  console.log(
    "----------------------------CREATING USERS-------------------------------"
  );
  let newUser;
  const usersPromises = users.map(async (user) => {
    newUser = new SCMUser(user);
    return await newUser.set();
  });
  Promise.all(usersPromises)
    .then((values) => {
      console.log(values);
      createContracts();
    })
    .catch((err) => console.log(err));
};

const createContracts = () => {
  console.log(
    "----------------------------CREATING CONTRACTS-------------------------------"
  );
  let newContract;
  const contractPromises = contracts.map(async (con, i) => {
    newContract = new Contract({
      contractId: con.contractId,
      batchId: con.batchId,
      grower: con.grower,
    });
    return await newContract.set();
  });
  Promise.all(contractPromises)
    .then((values) => {
      console.log(values);
      addContractParticipants();
    })
    .catch((err) => console.log(err));
};

const addContractParticipants = () => {
  console.log(
    "----------------------------ADDING CONTRACT USERS-------------------------------"
  );
  const updatedContractPromises = contracts.map(async (con) => {
    const typecastedObject = new Contract({
      contractId: con.contractId,
      batchId: con.batchId,
      grower: con.grower,
    });
    return await typecastedObject.update({
      farmInspector: con.farmInspector,
      shipper: con.shipper,
      processor: con.processor,
    });
  });
  Promise.all(updatedContractPromises)
    .then((values) => {
      console.log(values);
      updateBatches();
    })
    .catch((err) => console.log(err));
};

const updateBatches = () => {
  console.log(
    "----------------------------UPDATING BATCHES-------------------------------"
  );
  const updateBatchPromises = batches.map(async (batch) => {
    return await axios({
      method: "PUT",
      url: `http://192.168.246.128:3000/api/Batch/${batch.batchId}`,
      data: {
        ...batch,
      },
    });
  });
  Promise.all(updateBatchPromises)
    .then((values) => {
      console.log(values);
      updateContracts();
    })
    .catch((err) => console.log(err));
};

const updateContracts = async () => {
  console.log(
    "----------------------------FINAL CONTRACT UPDATE-------------------------------"
  );
  const updatedContract = await axios({
    method: "PUT",
    url: `http://192.168.246.128:3000/api/Contract/CON_98dd86bf-3e8e-4e6c-ab26-b7683d062227`,
    data: {
      $class: "org.coffeescm.Contract",
      contractId: "CON_98dd86bf-3e8e-4e6c-ab26-b7683d062227",
      createdDateTime: "2021-07-21T15:16:40.638Z",
      active: false,
      batch:
        "resource:org.coffeescm.Batch#BAT_5362fba7-4444-4e04-9427-753c2339a5ec",
      grower:
        "resource:org.coffeescm.Grower#3f6972f2-6097-49e1-b801-640658932991",
      farmInspector:
        "resource:org.coffeescm.FarmInspector#21b6f8e7-8a4e-4101-bfae-3f3259c50e72",
      shipper:
        "resource:org.coffeescm.Shipper#af2e31f3-c1eb-43b3-8233-adb59fc41e73",
      processor:
        "resource:org.coffeescm.Processor#19703578-c15a-44ca-bdea-64d726092bf8",
    },
  });
  console.log(updatedContract.data);
  console.log(
    "----------------------------SETUP COMPLETED-------------------------------"
  );
};

const setup = () => {
  console.log(
    "----------------------------SETUP INITIATED-------------------------------"
  );
  insertUsers();
};

setup();
