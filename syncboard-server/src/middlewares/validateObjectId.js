import mongoose from 'mongoose';
import AppError from '../utils/AppError.js';

/**
 * Middleware to validate whether route parameter is a valid MongoDB ObjectId.
 * Uses mongoose.Types.ObjectId.isValid(id) so malformed IDs in route parameters
 * return a clean 404 Not Found rather than an unhandled 500 error.
 *
 * Supports direct middleware usage:
 *   router.get('/:id', validateObjectId, controller)
 * Supports factory usage with custom parameter name:
 *   router.get('/:taskId', validateObjectId('taskId'), controller)
 */
export default function validateObjectId(paramName = 'id', res, next) {
  // Direct middleware invocation: validateObjectId(req, res, next)
  if (paramName && typeof paramName === 'object' && paramName.params) {
    const req = paramName;
    const nextFn = next;
    const id = req.params?.id;

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return nextFn(new AppError(`Invalid ID format: '${id}'. Resource not found.`, 404));
    }
    return nextFn();
  }

  // Factory invocation: validateObjectId('paramName') -> (req, res, next)
  const param = typeof paramName === 'string' ? paramName : 'id';
  return (req, res, nextFn) => {
    const id = req.params?.[param];

    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return nextFn(new AppError(`Invalid ID format: '${id}'. Resource not found.`, 404));
    }
    return nextFn();
  };
}
