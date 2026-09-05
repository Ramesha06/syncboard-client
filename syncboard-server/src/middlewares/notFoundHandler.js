import AppError from '../utils/AppError.js';

const notFoundHandler = (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
};

export default notFoundHandler;