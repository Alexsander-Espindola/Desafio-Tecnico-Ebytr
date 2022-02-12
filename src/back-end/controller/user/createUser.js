const { StatusCodes } = require('http-status-codes');
const userService = require('../../service/user');

module.exports = async (req, res, next) => {
  const user = req.body;
  try {
    const result = await userService.createUser(user);
    return res.status(StatusCodes.CREATED).json(result);
  } catch (error) {
    return next(error);
  }
};
