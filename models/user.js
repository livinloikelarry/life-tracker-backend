const bcrypt = require("bcrypt");
const { BCRYPT_WORK_FACTOR } = require("../config");
const db = require("../db");
const { BadRequestError, UnauthorizedError } = require("../utils/errors");

class User {
  static makePublicUser(user) {
    return {
      id: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      isAdmin: user.is_admin,
      createdAt: user.created_at,
    };
  }

  // these methods are all hitting postgres / using the database

  // make sure that the user exists
  static async login(credentials) {
    const requiredFields = ["email", "password"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });

    const user = await User.fetchUserByEmail(credentials.email);
    if (user) {
      const isValid = await bcrypt.compare(credentials.password, user.password);
      if (isValid) {
        return User.makePublicUser(user);
      }
    }

    throw new UnauthorizedError("Invalid email/password");
  }

  // this method is called when a user is signing up
  static async register(credentials) {
    const requiredFields = ["first_name", "email", "password", "isAdmin"];
    requiredFields.forEach((property) => {
      if (!credentials.hasOwnProperty(property)) {
        throw new BadRequestError(`Missing ${property} in request body.`);
      }
    });

    if (credentials.email.indexOf("@") <= 0) {
      throw new BadRequestError("Invalid email.");
    }

    const existingUser = await User.fetchUserByEmail(credentials.email);
    if (existingUser) {
      throw new BadRequestError(
        `A user already exists with email: ${credentials.email}`
      );
    }

    const hashedPassword = await bcrypt.hash(
      credentials.password,
      BCRYPT_WORK_FACTOR
    );
    const normalizedEmail = credentials.email.toLowerCase();

    const userResult = await db.query(
      `INSERT INTO users (first_name, last_name, email, password, is_admin)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, first_name, last_name, email, is_admin, created_at;
      `,
      [
        credentials.first_name,
        credentials.last_name,
        normalizedEmail,
        hashedPassword,
        credentials.isAdmin,
      ]
    );
    const user = userResult.rows[0];
    return User.makePublicUser(user);
  }

  static async fetchUserByEmail(email) {
    if (!email) {
      throw new BadRequestError("No email provided");
    }

    const query = `SELECT * FROM users WHERE email = $1`;

    const result = await db.query(query, [email.toLowerCase()]);

    const user = result.rows[0];

    return user;
  }
}

module.exports = User;
