import initialUsers from '../data/users.js';

/**
 * UserRepository
 * Encapsulates in-memory user management and queries for authentication and permissions
 */
class UserRepository {
  constructor() {
    this.users = initialUsers.map((u) => ({ ...u, boards: [...u.boards] }));
    this.idCounter = this.users.length + 1;
  }

  /**
   * Retrieve all users (excluding raw passwords by default)
   * @param {boolean} includePassword - Whether to include password hashes
   * @returns {Array<Object>} List of users
   */
  async findAll(includePassword = false) {
    return this.users.map((u) => {
      const copy = { ...u, boards: [...u.boards] };
      if (!includePassword) delete copy.password;
      return copy;
    });
  }

  /**
   * Find a user by unique ID
   * @param {string} id - User ID (e.g. 'USR-01')
   * @param {boolean} includePassword - Whether to include password hash
   * @returns {Object|null} User object or null
   */
  async findById(id, includePassword = false) {
    const user = this.users.find((u) => u.id === id);
    if (!user) return null;

    const copy = { ...user, boards: [...user.boards] };
    if (!includePassword) delete copy.password;
    return copy;
  }

  /**
   * Find a user by case-insensitive email address
   * @param {string} email - Email address
   * @param {boolean} includePassword - Whether to include password hash (needed for login comparison)
   * @returns {Object|null} User object or null
   */
  async findByEmail(email, includePassword = false) {
    if (!email) return null;
    const normalizedEmail = email.trim().toLowerCase();
    const user = this.users.find(
      (u) => u.email.toLowerCase() === normalizedEmail
    );
    if (!user) return null;

    const copy = { ...user, boards: [...user.boards] };
    if (!includePassword) delete copy.password;
    return copy;
  }

  /**
   * Create a new user (registration)
   * @param {Object} userData - User details including hashed password
   * @returns {Object} Created user (without password hash)
   */
  async create(userData) {
    const paddedIndex = String(this.idCounter++).padStart(2, '0');
    const newId = userData.id || `USR-${paddedIndex}`;
    const now = new Date().toISOString();

    const initials = userData.name
      ? userData.name
          .split(' ')
          .map((n) => n[0])
          .join('')
          .toUpperCase()
          .slice(0, 2)
      : 'US';

    const newUser = {
      id: newId,
      name: userData.name,
      email: userData.email.trim().toLowerCase(),
      password: userData.password, // hashed password stored internally
      initials,
      boards: userData.boards || ['BOARD-01'], // Default to main project board
      createdAt: now,
    };

    this.users.push(newUser);

    // Return safe copy without password
    const safeUser = { ...newUser, boards: [...newUser.boards] };
    delete safeUser.password;
    return safeUser;
  }

  /**
   * Update user details or joined boards
   * @param {string} id - User ID
   * @param {Object} fields - Updated fields
   * @returns {Object|null}
   */
  async update(id, fields) {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) return null;

    const user = this.users[index];
    const updated = {
      ...user,
      ...fields,
      id: user.id,
      password: fields.password || user.password,
    };

    this.users[index] = updated;
    const safeUser = { ...updated };
    delete safeUser.password;
    return safeUser;
  }

  /**
   * Reset repository state to initial seed data
   */
  async reset() {
    this.users = initialUsers.map((u) => ({ ...u, boards: [...u.boards] }));
    this.idCounter = this.users.length + 1;
  }
}

export default new UserRepository();
