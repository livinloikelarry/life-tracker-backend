const db = require("../db");
const { BadRequestError, NotFoundError } = require("../utils/errors");

class Exercise {
  static async addExercise({ exercise, user }) {
    // allow the user to add a new exercise and insert into the db
    // I'm going to need pretty much all of the info from the table
    // so more parameters will have to be added
    const requiredFields = ["name", "category", "duration", "intensity"];
    requiredFields.forEach((field) => {
      if (!exercise.hasOwnProperty(field)) {
        throw new BadRequestError(
          `Required field - ${field} - missing from request body`
        );
      }
    });
    const results = await db.query(
      `
        INSERT INTO exercises (name, category, duration, intensity, user_id)
        VALUES ($1, $2, $3, $4, (SELECT id FROM users WHERE email = $5))
        RETURNING id,
                name, 
                category, 
                duration, 
                intensity, 
                user_id AS "userId"
        `,
      [
        exercise.name,
        exercise.category,
        exercise.duration,
        exercise.intensity,
        user.email,
      ]
    );
    return results.rows[0];
  }

  static async lookupExerciseById({ user }, exerciseId) {
    // lookup a specific exercise if it exists
    const results = await db.query(
      `
        SELECT e.id,
                e.name, 
                e.category, 
                e.duration, 
                e.intensity, 
                e.user_id AS "userId",
                u.email AS "userEmail"
        FROM exercises AS e
            JOIN users AS u ON u.id = e.user_id
        WHERE e.id = $1 AND u.email = $2
        `,
      [exerciseId, user.email]
    );
    // console.log("RESULTS", results.rows[0]);
    const exercise = results.rows[0];
    if (!exercise) {
      throw new NotFoundError();
    }
    return exercise;
  }
  static async listAllExercise({ user }) {
    // show all existing exercise logged in desc order of when they were created
    const results = await db.query(
      `
        SELECT e.id,
                e.name, 
                e.category, 
                e.duration, 
                e.intensity, 
                e.user_id AS "userId",
                e.timestamp, 
                u.email AS "userEmail"
        FROM exercises AS e
            JOIN users AS u ON u.id = e.user_id
            WHERE u.email = $1
        ORDER BY e.timestamp DESC 
        `,
      [user.email]
    );
    return results.rows;
  }
}
module.exports = Exercise;
