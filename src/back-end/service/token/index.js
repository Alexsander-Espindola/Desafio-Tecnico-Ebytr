require('dotenv').config();

const status = require('http-status-codes').StatusCodes;
const jwt = require('jsonwebtoken');

const secret = process.env.SECRET || 'segredinho';
const { errorHandler } = require('../../utils');

const validate = async (token) => {
  if (!token) throw errorHandler(status.UNAUTHORIZED, 'Cade o token');
  try {
    const result = jwt.verify(token, secret);
    return !!result;
  } catch (e) {
    throw errorHandler(status.UNAUTHORIZED, 'jwt malformed or token expired');
  }
};

module.exports = {
  validate,
};
