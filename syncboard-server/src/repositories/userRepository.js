import mongoose from 'mongoose';
import User from '../models/User.js';
import initialUsers from '../data/users.js';

/**
 * UserRepository
 * Encapsulates MongoDB database operations for users using Mongoose.
 */
class UserRepository {
  /**
   * Retrieve all users (excluding raw passwords by default)
   * @param {boolean} includePassword - Whether to include password hashes
   * @returns {Promise<Array<Object>>} List of users
   */
  async findAll(includePassword = false) {
    const users = await User.find();
    return users.map((u) => (includePassword ? u.toObject() : u.toJSON()));
  }

  /**
   * Find a user by unique ID
   * @param {string} id - User ObjectId string
   * @param {boolean} includePassword - Whether to include password hash
   * @returns {Promise<Object|null>} User object or null
   */
  async findById(id, includePassword = false) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const user = await User.findById(id);
    if (!user) return null;

    return includePassword ? user.toObject() : user.toJSON();
  }

  /**
   * Find a user by case-insensitive email address
   * @param {string} email - Email address
   * @param {boolean} includePassword - Whether to include password hash (needed for login comparison)
   * @returns {Promise<Object|null>} User object or null
   */
  async findByEmail(email, includePassword = false) {
    if (!email) return null;

    const normalizedEmail = email.trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (!user) return null;

    return includePassword ? user.toObject() : user.toJSON();
  }

  /**
   * Create a new user (registration)
   * @param {Object} userData - User details including hashed password
   * @returns {Promise<Object>} Created user (without password hash)
   */
  async create(userData) {
    const initials =
      userData.initials ||
      (userData.name
        ? userData.name
            .trim()
            .split(/\s+/)
            .map((n) => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2)
        : 'US');

    const user = await User.create({
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      initials,
      boards: userData.boards || ['BOARD-01'],
    });

    return user.toJSON();
  }

  /**
   * Update user details or joined boards
   * @param {string} id - User ObjectId string
   * @param {Object} fields - Updated fields
   * @returns {Promise<Object|null>} Updated user or null
   */
  async update(id, fields) {
    if (!id || !mongoose.Types.ObjectId.isValid(id)) {
      return null;
    }

    const updated = await User.findByIdAndUpdate(
      id,
      { $set: fields },
      { new: true, runValidators: true }
    );

    if (!updated) return null;

    return updated.toJSON();
  }

  /**
   * Reset repository state to initial seed data in MongoDB
   */
  async reset() {
    await User.deleteMany({});
    const seedDocs = initialUsers.map((u) => ({
      name: u.name,
      email: u.email.trim().toLowerCase(),
      password: u.password,
      initials: u.initials,
      boards: u.boards,
    }));
    await User.insertMany(seedDocs);
  }
}

export default new UserRepository();
