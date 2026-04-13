const { body, validationResult } = require("express-validator");

function validateSignupInput({ username, email, password }) {
  if (!username || username.trim().length < 3) throw new Error("username must be at least 3 characters");
  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email || "");
  if (!emailOk) throw new Error("Invalid email format");
  if (!password || password.length < 6) throw new Error("password must be at least 6 characters");
}

function validateLoginInput({ usernameOrEmail, password }) {
  if (!usernameOrEmail) throw new Error("usernameOrEmail is required");
  if (!password) throw new Error("password is required");
}

module.exports = { validateSignupInput, validateLoginInput };