// File whisper.mjs berfungsi sebagai sistem untuk mencari user, mengupdate user
// menambahkan user, dan menghapus user.

import { Whisper } from "../database.mjs";

const getAll = () => Whisper.find().populate("author", "username");
const getById = (id) =>
  Whisper.findById({ _id: id }).populate("author", "username");
const create = async (message, authorId) => {
  const whisper = new Whisper({ message, author: authorId });
  await whisper.save();
  return whisper;
};
const updateById = async (id, message) =>
  Whisper.findOneAndUpdate({ _id: id }, { message }, { new: false });
const deleteById = async (id) => Whisper.deleteOne({ _id: id });

export { getAll, getById, create, updateById, deleteById };
