const router = require("express").Router();
const User = require("../models/User");

const ErrorResponse = require("../utils/errorResponse");

const successMessage = (res, stat, message, data) => {
  return res.status(stat).json({
    status: "success",
    message,
    data,
  });
};

router.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, address } = req.body;
  if (!firstname || !lastname || !email) {
    return next(new ErrorResponse("Please enter all fields", 400));
  }

  const userExists = await User.findOne({ email });
  if (userExists) {
    return next(new ErrorResponse("User already exists", 400));
  }

  try {
    const user = await User.create({
      firstname,
      lastname,
      email,
      address,
    });
    successMessage(res, 200, "User created successfully.", user);
  } catch (err) {
    next(err);
  }
});

router.post("/login", async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  try {
    const user = await User.findOne({ email });
    if (!user) {
      return next(new ErrorResponse("Invalid credentials", 401));
    }

    successMessage(res, 200, "logged in successfully.", user);
  } catch (err) {
    console.log(err);
    next(err);
  }
});

router.get("/", async (req, res, next) => {
  let users = await User.find();

  if (req.query.firstname) {
    const firstnameFilter = req.query.firstname.toLowerCase();
    users = users.filter(user =>
      user.firstname.toLowerCase().includes(firstnameFilter)
    );
  }

  if (req.query.lastname) {
    const lastnameFilter = req.query.lastname.toLowerCase();
    users = users.filter(user =>
      user.lastname.toLowerCase().includes(lastnameFilter)
    );
  }
  users = { users, total: users.length };
  successMessage(res, 200, "Users fetched successfully.", users);
});

router.patch("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const findUser = await User.findById(id);
    if (!findUser) return next(new ErrorResponse("Error updating user", 400));

    const user = await User.findByIdAndUpdate(id, req.body);
    successMessage(res, 200, "User updated successfully.", user);
  } catch (err) {
    next(err);
  }
});

router.delete("/:id", async (req, res, next) => {
  const { id } = req.params;
  try {
    const deleteUser = await User.findByIdAndDelete(id);
    if (!deleteUser) return next(new ErrorResponse("Error deleting user", 400));

    successMessage(res, 200, "User deleted successfully.");
  } catch (err) {
    next(err);
  }
});

module.exports = router;
