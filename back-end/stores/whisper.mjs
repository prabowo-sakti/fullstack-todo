// File whisper.mjs berfungsi sebagai sistem untuk mencari user, mengupdate user
// menambahkan user, dan menghapus user.

import { Whisper } from "../database.mjs";

const getAll = async () => await Whisper.find().populate("author", "username");

const getById = async (id) => {
  console.log("Fetching before populate:", id);
  const whisper = await Whisper.findById(id).populate("author", "username");
  console.log("Fetching after populate:", whisper);
  return whisper;
};

const create = async (message, authorId) => {
  const whisper = new Whisper({ message, author: authorId });
  await whisper.save();
  return whisper;
};

const updateById = async (id, message) =>
  Whisper.findOneAndUpdate({ _id: id }, { message }, { new: true });

const deleteById = async (id) => Whisper.deleteOne({ _id: id });

export { getAll, getById, create, updateById, deleteById };
