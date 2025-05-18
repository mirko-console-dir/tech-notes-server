const User = require("../models/User");
const Note = require("../models/Note");
const asyncHandler = require("express-async-handler"); // keep us to use try catch block, due we use mongoose to Create Update Delete data
const bcrypt = require("bcrypt"); // encypt psw

/** ERROR CODES
 * 400 BAD REQUEST
 * 409 CONFLICT
 *
 */

// @desc Get all users
// @route Get / users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  // -password is not returning the psw
  // lean give us data that is like json without extra from mongoose
  // mongoose usually return a document with methods (save) and other methods attached
  const users = await User.find().select("-password").lean();

  if (!users?.length) {
    // if not put the return here we could have problem with the headers if already setted (where you try to send multiple responses for a single request.)
    return res.status(400).json({ message: "No users found" });
  }
  res.json(users);
});

// @desc Create new user
// @route POST / users
// @access Private
const createNewUser = asyncHandler(async (req, res) => {
  const { username, password, roles } = req.body;

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const duplicate = await User.findOne({ username }).lean().exec(); // exec to receive a response as doc

  if (duplicate) {
    return res.status(409).json({ message: "Duplicate username" });
  }

  const hashedPsw = await bcrypt.hash(password, 10); // 10 salt rounds (secured even from admin in DB)

  const userObject = { username, password: hashedPsw, roles };

  const user = await User.create(userObject);

  if (user) {
    res.status(201).json({ message: `New user ${username} created` });
  } else {
    res.status(400).json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH / users
// @access Private
const updateUser = asyncHandler(async (req, res) => {
  const { id, username, password, roles, active } = req.body;

  if (
    !id ||
    !username ||
    !password ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    return res.status(400).json({ message: "All field are required" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const duplicate = await User.findOne({ username }).lean().exec();

  // Allow updates to the original user
  if (duplicate && duplicate?._id.toString() !== id) {
    return res.status(409).json({ message: "Duplicate usename" });
  }

  user.username = username;
  user.roles = roles;
  user.active = active;

  if (password) {
    user.password = await bcrypt.hash(password, 10);
  }

  const updatedUser = await user.save();

  res.json({ message: `${updatedUser.username} updated` });
});

// @desc Delete a user
// @route DELETE / users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { id } = req.body;

  if (!id) {
    return res.status(400).json({ message: "User id required" });
  }

  const notes = await Note.findOne({ user: id }).lean().exec();

  if (notes?.length) {
    return res.status(400).json({ message: "User has assigned notes" });
  }

  const user = await User.findById(id).exec();

  if (!user) {
    return res.status(400).json({ message: "User not found" });
  }

  const result = await user.deleteOne();

  const reply = `Username ${result.username} with ID ${result._id} deleted`;

  res.json(reply);
});

module.exports = {
  getAllUsers,
  createNewUser,
  updateUser,
  deleteUser,
};
