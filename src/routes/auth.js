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
  // console.log(req.body);
  const { firstname, lastname, email, address } = req.body;
  if (!firstname || !lastname || !email) {
    return next(new ErrorResponse("Please enter all fields", 400));
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
  const { email, password } = req.body;

  // Check if email and password are provided
  if (!email) {
    return next(new ErrorResponse("Please provide an email and password", 400));
  }
  try {
    // Check that user exists by email
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
  const users = await User.find();
  let filteredUsers = users;

  if (req.query.firstname) {
    const firstnameFilter = req.query.firstname.toLowerCase();
    filteredUsers = users.filter(user =>
      user.firstname.toLowerCase().includes(firstnameFilter)
    );
  }

  // check if age query param is provided
  if (req.query.lastname) {
    const lastnameFilter = req.query.lastname.toLowerCase();
    filteredUsers = users.filter(user =>
      user.lastname.toLowerCase().includes(lastnameFilter)
    );
  }

  return res.json({
    status: "success",
    users: filteredUsers,
  });
});
router.patch("/:id", async (req, res, next) => {
  const users = await User.find();
  return res.json({
    status: "success",
    users,
  });
});
router.delete("/:id", async (req, res, next) => {
  const users = await User.find();
  return res.json({
    status: "success",
    users,
  });
});

module.exports = router;
