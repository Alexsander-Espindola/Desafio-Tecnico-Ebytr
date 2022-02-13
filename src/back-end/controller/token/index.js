const { StatusCodes } = require('http-status-codes');
const tokenService = require('../../service/token');

const validate = async (req, res, next) => {
  const token = req.body;
  try {
    const result = await tokenService.validate(token);
    return res.status(StatusCodes.OK).json(result);
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  validate,
};
