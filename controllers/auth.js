const User = require("../models/user");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const user = await User.create({ ...req.body });
  const token = user.createJWT();
  res.status(StatusCodes.CREATED).json({ user, token });
};

const login = async (req, res) => {
  const { data, password } = req.body;

  if (!data || !password) {
    throw new BadRequestError("Please provide email or username and password");
  }
  // FIND USER BY EMAIL
  const user = await User.findOne({ email: data });

  if (!user) {
    // FIND USER BY USERNAME
    const user = await User.findOne({ username: data });
    if (!user) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const isPasswordCorrect = await user.comparePassword(password);

    if (!isPasswordCorrect) {
      throw new UnauthenticatedError("Invalid Credentials");
    }

    const token = user.createJWT();
    res.json({
      user: { name: user.name, email: user.email },
      token,
    });
  }

  const isPasswordCorrect = await user.comparePassword(password);

  if (!isPasswordCorrect) {
    throw new UnauthenticatedError("Invalid Credentials");
  }

  const token = user.createJWT();

  res.json({
    user: { name: user.name, email: user.email },
    token,
  });
};

module.exports = {
  register,
  login,
};
