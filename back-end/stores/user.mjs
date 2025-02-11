import { User } from "../database.mjs";

const create = async (username, password, email) => {
  const user = new User({ username, password, email });
  await user.save();
  return user;
  console.log(user);
};

const getUserByCredentials = async (username, password) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error("User not found!");
  }
  //pada block kode dibawah ini, user.comparePassword berada di database.mjs
  // baris kode 76 - 79
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new Error("Password is incorrect");
  }
  return user;
};

export { create, getUserByCredentials };
