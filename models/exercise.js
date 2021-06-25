const db = require("../db");

class Exercise {
  static async addExercise({ user, exerciseId }) {
    // allow the user to add a new exercise and insert into the db
  }

  static async lookupExercise({ user, exerciseId }) {
    // lookup a specific exercise if it exists
  }
  static async listAllExercise({ user, exerciseId }) {
    // show all existing exercise logged
  }
}
module.exports = Exercise;
