function validateEmployeeInput(input) {
  const required = [
    "first_name",
    "last_name",
    "email",
    "gender",
    "designation",
    "salary",
    "date_of_joining",
    "department",
  ];

  for (const field of required) {
    if (
      input[field] === undefined ||
      input[field] === null ||
      input[field] === ""
    ) {
      throw new Error(`${field} is required`);
    }
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(input.email || "").trim());
  if (!emailOk) {
    throw new Error("Invalid email format");
  }

  if (!["Male", "Female", "Other"].includes(input.gender)) {
    throw new Error("Invalid gender (Male/Female/Other)");
  }

  if (Number(input.salary) < 1000) {
    throw new Error("salary must be >= 1000");
  }

  if (Number.isNaN(new Date(input.date_of_joining).getTime())) {
    throw new Error("Invalid date_of_joining");
  }
}

function validateEmployeeUpdateInput(input) {
  if (input.email !== undefined) {
    const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      String(input.email || "").trim()
    );

    if (!emailOk) {
      throw new Error("Invalid email format");
    }
  }

  if (
    input.gender !== undefined &&
    !["Male", "Female", "Other"].includes(input.gender)
  ) {
    throw new Error("Invalid gender (Male/Female/Other)");
  }

  if (input.salary !== undefined && Number(input.salary) < 1000) {
    throw new Error("salary must be >= 1000");
  }

  if (
    input.date_of_joining !== undefined &&
    Number.isNaN(new Date(input.date_of_joining).getTime())
  ) {
    throw new Error("Invalid date_of_joining");
  }
}

module.exports = {
  validateEmployeeInput,
  validateEmployeeUpdateInput,
};