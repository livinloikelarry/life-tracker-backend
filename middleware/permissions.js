const Exercise = require("../models/exercise");
const { BadRequestError, ForbiddenError } = require("../utils/errors");

// ensure authenticated user is the one adding to their info
