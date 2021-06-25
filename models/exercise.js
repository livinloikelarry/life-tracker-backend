const db = require("../db");

class Exercise {
  static async addExercise({ user, exercise }) {
    // allow the user to add a new exercise and insert into the db
    // I'm going to need pretty much all of the info from the table
    // so more parameters will have to be added
  }

  static async lookupExerciseById({ user, exerciseId }) {
    // lookup a specific exercise if it exists
  }
  static async listAllExercise() {
    // show all existing exercise logged in desc order of when they were created
  }
}
module.exports = Exercise;
