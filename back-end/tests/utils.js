import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
import { Whisper, User } from "../database.mjs";
import { generateToken } from "../utils";

const ensureDbConnection = async () => {
  try {
    if (mongoose.connection.readyState !== 1) {
      await mongoose.connect(process.env.MONGODB_URI);
    }
  } catch (err) {
    console.error("Error connecting to the database", err);
    throw err;
  }
};

const closeDbConnection = async () => {
  if (mongoose.connection.readyState === 1) {
    await mongoose.disconnect();
  }
};

const restoreDb = async () => {
  await Promise.all([Whisper.deleteMany({}), User.deleteMany({})]);
};

const getUsersFixtures = () => [
  {
    username: "prabowo",
    password: "qg82H0Zt1Ee6F2ESNwI!ZN8iq7N",
    email: "prabowo@prabowo.com",
  },
  {
    username: "sakti",
    password: "nnO864BTxe#103Hl8eI!Qx#0xCw",
    email: "sakti@sakti.com",
  },
];

const populateDb = async () => {
  const users = [];
  console.log(users);
  for (const user of getUsersFixtures()) {
    const storedWhisper = await User.create(user);
    users.push(storedWhisper);
  }
  const messages = [
    {
      message: "sakti testing",
      author: users[0]._id,
    },
    {
      message: "hello world from sakti",
      author: users[0]._id,
    },
  ];
  for (const message of messages) {
    await Whisper.create(message);
  }
};

const getFixtures = async () => {
  const data = await Whisper.find().populate("author", "username");
  const whispers = JSON.parse(JSON.stringify(data));
  const inventedId = "64e0e5c75a4a3c715b7c1074";
  const existingId = data[0].id;
  const storedUsers = await User.find();
  const [firstUser, secondUser] = getUsersFixtures();
  firstUser.id = storedUsers[0]._id.toString();
  secondUser.id = storedUsers[1]._id.toString();
  firstUser.token = generateToken({
    id: firstUser.id,
    username: firstUser.username,
  });
  secondUser.token = generateToken({
    id: secondUser.id,
    username: secondUser.username,
  });

  return { inventedId, existingId, whispers, firstUser, secondUser };
};

const normalize = (data) => JSON.parse(JSON.stringify(data));

export {
  restoreDb,
  populateDb,
  getFixtures,
  ensureDbConnection,
  normalize,
  closeDbConnection,
};
