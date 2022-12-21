const router = require('express').Router();
const User = require('../models/User');

const ErrorResponse = require("../utils/errorResponse");

const successMessage = (res, stat, message, data) => {
   return res.status(stat).json({
      status: "success",
      message,
      data,
   });
};

router.post('/register', async(req, res, next) => {
   // console.log(req.body);
   const { name, email, password, confirmPassword } = req.body;
   if (!name || !email || !password || !confirmPassword) {
      return next(new ErrorResponse("Please enter all fields", 400));
   }
   if (password != confirmPassword) {
      return next(new ErrorResponse("Passwords do not match", 400));
   }
   try {
      const emailExist = await User.findOne({ email });
      if(emailExist) {
         return next(new ErrorResponse("User already exist. Please, login", 400));
      } 
      const user = await User.create({
         name, email, password
      })
      successMessage(res, 200, "User created successfully.", user);
   } catch (err) {
      next(err);
   }
})

router.post('/login', async(req, res, next) => {
   const { email, password } = req.body;

   // Check if email and password are provided
   if (!email || !password) {
      return next(
         new ErrorResponse("Please provide an email and password", 400)
      );
   }
   try {
      // Check that user exists by email
      const user = await User.findOne({ email });
      console.log(user);
      if (!user) {
         return next(new ErrorResponse("Invalid credentials", 401));
      }

      // Check that password match
      const isMatch = await user.matchPassword(password);

      if (!isMatch) {
         return next(new ErrorResponse("Invalid credentials", 401));
      }

      successMessage(res, 200, "logged in successfully.", user);
   } catch (err) {
      console.log(err);
      next(err);
   }
})

module.exports = router;