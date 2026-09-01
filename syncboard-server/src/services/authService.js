import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import userRepository from '../repositories/userRepository.js';
import boardRepository from '../repositories/boardRepository.js';
import { config } from '../config/config.js';

const SALT_ROUNDS = 10;

export const register = async ({ name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    const error = new Error('Email already in use');
    error.statusCode = 409;
    throw error;
  }

  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create a fresh private board for the new user
  const newBoard = await boardRepository.create({
    title: `${name.trim()}'s Workspace`,
    description: `Personal task board for ${name.trim()}`,
  });

  // Create user associated with their new personal board
  const user = await userRepository.create({
    name,
    email,
    password: hashedPassword,
    boards: [newBoard.id],
  });

  // Set the board owner and member
  await boardRepository.addMember(newBoard.id, user.id);
  const boardObj = await boardRepository.findById(newBoard.id);
  if (boardObj) {
    boardObj.ownerId = user.id;
  }

  return user;
};


export const login = async ({ email, password }) => {
  // includePassword=true — we need the hash to compare against
  const user = await userRepository.findByEmail(email, true);
  if (!user) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    const error = new Error('Invalid credentials');
    error.statusCode = 401;
    throw error;
  }

  const token = jwt.sign(
    { id: user.id, email: user.email },
    config.jwtSecret,
    { expiresIn: '1h' }
  );

  const { password: _omit, ...safeUser } = user;
  return { token, user: safeUser };
};