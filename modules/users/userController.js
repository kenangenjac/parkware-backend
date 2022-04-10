import jwt from "jsonwebtoken";

import User from "./userModel.js";
import bcrypt from "bcrypt";

export const signUp = async (req, res) => {
  const {
    firstName,
    lastName,
    email,
    password,
    confirmPassword,
    registrationPlates,
  } = req.body;
  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(403).json({ message: "User already exist." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords don't match" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(password, salt);

    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPass,
      registrationPlates,
    });

    const addedUser = await newUser.save();

    const user = {
      id: addedUser.id,
      firstName,
      lastName,
      email,
      registrationPlates,
    };

    const token = jwt.sign(user, process.env.TOKEN_SECRET);

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const signIn = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });

    if (!existingUser) {
      return res.status(404).json({ message: "User doesn't exist." });
    }

    const isPasswordCorrect = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const { id, firstName, lastName, registrationPlates } = existingUser;
    const user = { id, firstName, lastName, email, registrationPlates };

    const token = jwt.sign(user, process.env.TOKEN_SECRET);

    res.status(200).json({ user, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const changeUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    if (user._id == req.params.id) {
      if (req.body.password) {
        const salt = await bcrypt.genSalt(10);
        req.body.password = await bcrypt.hash(req.body.password, salt);
      }
      try {
        const updatedUser = await User.findByIdAndUpdate(
          req.params.id,
          { $set: req.body },
          { new: true }
        );
        res.status(200).json(updatedUser);
      } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You can only update Your account" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: "User doesn't exist." });
    }
    if (user._id == req.params.id) {
      try {
        await User.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "User deleted" });
      } catch (error) {
        res.status(500).json({ message: "Something went wrong" });
      }
    } else {
      return res
        .status(401)
        .json({ message: "You can delete only your account" });
    }
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};
