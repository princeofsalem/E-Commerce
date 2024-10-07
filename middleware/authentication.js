const CustomError = require('../errors');
const { isTokenValid } = require('../utils');
const Token = require('../models/Token');
const { attachCookiesToResponse } = require('../utils');

const authenticateUser  = async (req, res, next) => {
  const { refreshToken, accessToken } = req.signedCookies;

  if (!accessToken && !refreshToken) {
    throw new CustomError.UnauthenticatedError('No token provided');
  }

  try {
    let payload;
    if (accessToken) {
      payload = isTokenValid(accessToken);
      console.log('Access Token Payload:', payload);
    } else {
      payload = isTokenValid(refreshToken);
      console.log('Refresh Token Payload:', payload);
    }

    req.user = payload.user;

    let existingToken = await Token.findOne({
      user: payload.user.userId,
      refreshToken: payload.refreshToken,
    });
    console.log('Existing Token:', existingToken);

    if (!existingToken) {
      // If the token is not found, create a new one
      const userAgent = req.headers['user-agent'];
      const ip = req.ip;
      existingToken = await Token.create({
        user: payload.user.userId,
        refreshToken: payload.refreshToken,
        userAgent,
        ip,
      });
      console.log('New Token:', existingToken);
    } else if (!existingToken?.isValid) {
      throw new CustomError.UnauthenticatedError('Authentication Invalid');
    }

    attachCookiesToResponse({
      res,
      user: payload.user,
      refreshToken: existingToken.refreshToken,
    });
    req.user = payload.user;
    next();
  } catch (error) {
    console.error(error);
    throw new CustomError.UnauthenticatedError('Authentication Invalid!');
  }
};
const authorizePermissions = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomError.UnauthorizedError(
        'Unauthorized to access this route'
      );
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermissions,
};
