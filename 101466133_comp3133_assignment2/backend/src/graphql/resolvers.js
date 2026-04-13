const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Employee = require("../models/Employee");
const { toUserMessage } = require("../utils/errors");
const { uploadEmployeePhoto } = require("../utils/cloudinaryUpload");

const {
  validateSignupInput,
  validateLoginInput,
} = require("../validators/userValidators");

const {
  validateEmployeeInput,
  validateEmployeeUpdateInput,
} = require("../validators/employeeValidators");

function signToken(user) {
  return jwt.sign(
    {
      sub: user._id.toString(),
      username: user.username,
      email: user.email,
    },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" }
  );
}

function requireAuth(ctx) {
  if (!ctx.user) {
    const err = new Error("Unauthorized: Bearer token required");
    err.statusCode = 401;
    throw err;
  }
}

function normalizeEmployeeInput(input = {}) {
  const data = { ...input };

  if (data.position && !data.designation) {
    data.designation = data.position;
  }

  delete data.position;

  return data;
}

const resolvers = {
  Employee: {
    position(parent) {
      return parent.designation;
    },
  },

  Query: {
    async employees(_, __, ctx) {
      try {
        requireAuth(ctx);
        const employees = await Employee.find().sort({ created_at: -1 });
        return { success: true, message: "Employees fetched", employees };
      } catch (err) {
        return { success: false, message: toUserMessage(err), employees: [] };
      }
    },

    async employee(_, { id }, ctx) {
      try {
        requireAuth(ctx);
        const employee = await Employee.findById(id);

        if (!employee) {
          return { success: false, message: "Employee not found" };
        }

        return { success: true, message: "Employee fetched", employee };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },

    async searchEmployees(_, { position, department }, ctx) {
      try {
        requireAuth(ctx);

        if (!position && !department) {
          return {
            success: false,
            message: "Provide position or department",
            employees: [],
          };
        }

        const filter = {};

        if (position) {
          filter.designation = position;
        }

        if (department) {
          filter.department = department;
        }

        const employees = await Employee.find(filter).sort({ created_at: -1 });

        return { success: true, message: "Employees fetched", employees };
      } catch (err) {
        return { success: false, message: toUserMessage(err), employees: [] };
      }
    },

    async getAllEmployees(_, __, ctx) {
      try {
        requireAuth(ctx);
        const employees = await Employee.find().sort({ created_at: -1 });
        return { success: true, message: "Employees fetched", employees };
      } catch (err) {
        return { success: false, message: toUserMessage(err), employees: [] };
      }
    },

    async searchEmployeeByEid(_, { eid }, ctx) {
      try {
        requireAuth(ctx);
        const employee = await Employee.findById(eid);

        if (!employee) {
          return { success: false, message: "Employee not found" };
        }

        return { success: true, message: "Employee fetched", employee };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },

    async searchEmployeesByDesignationOrDepartment(
      _,
      { designation, department },
      ctx
    ) {
      try {
        requireAuth(ctx);

        if (!designation && !department) {
          return {
            success: false,
            message: "Provide designation or department",
            employees: [],
          };
        }

        const filter = {};

        if (designation) {
          filter.designation = designation;
        }

        if (department) {
          filter.department = department;
        }

        const employees = await Employee.find(filter).sort({ created_at: -1 });

        return { success: true, message: "Employees fetched", employees };
      } catch (err) {
        return { success: false, message: toUserMessage(err), employees: [] };
      }
    },
  },

  Mutation: {
    async signup(_, { input }) {
      try {
        validateSignupInput(input);

        const { username, email, password } = input;

        const hashed = await bcrypt.hash(password, 10);

        const user = await User.create({
          username: username.trim(),
          email: email.toLowerCase().trim(),
          password: hashed,
        });

        const token = signToken(user);

        return {
          success: true,
          message: "Signup successful",
          token,
          user,
        };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },

    async login(_, { input }) {
      try {
        validateLoginInput(input);

        const { usernameOrEmail, password } = input;

        const user = await User.findOne({
          $or: [
            { username: usernameOrEmail.trim() },
            { email: usernameOrEmail.toLowerCase().trim() },
          ],
        });

        if (!user) {
          return { success: false, message: "Invalid credentials" };
        }

        const ok = await bcrypt.compare(password, user.password);

        if (!ok) {
          return { success: false, message: "Invalid credentials" };
        }

        const token = signToken(user);

        return {
          success: true,
          message: "Login successful",
          token,
          user,
        };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },

    async addEmployee(_, { input }, ctx) {
      try {
        requireAuth(ctx);

        const data = normalizeEmployeeInput(input);
        validateEmployeeInput(data);

        if (data.employee_photo) {
          const uploaded = await uploadEmployeePhoto(data.employee_photo);

          if (uploaded?.url) {
            data.employee_photo = uploaded.url;
          }
        }

        const employee = await Employee.create(data);

        return { success: true, message: "Employee created", employee };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },

    async updateEmployeeByEid(_, { eid, input }, ctx) {
      try {
        requireAuth(ctx);

        const patch = normalizeEmployeeInput(input);
        validateEmployeeUpdateInput(patch);

        if (patch.employee_photo) {
          const uploaded = await uploadEmployeePhoto(patch.employee_photo);

          if (uploaded?.url) {
            patch.employee_photo = uploaded.url;
          }
        }

        const employee = await Employee.findByIdAndUpdate(
          eid,
          { $set: patch },
          { new: true, runValidators: true }
        );

        if (!employee) {
          return { success: false, message: "Employee not found" };
        }

        return { success: true, message: "Employee updated", employee };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },

    async deleteEmployeeByEid(_, { eid }, ctx) {
      try {
        requireAuth(ctx);

        const employee = await Employee.findByIdAndDelete(eid);

        if (!employee) {
          return { success: false, message: "Employee not found" };
        }

        return { success: true, message: "Employee deleted", employee };
      } catch (err) {
        return { success: false, message: toUserMessage(err) };
      }
    },
  },
};

module.exports = { resolvers };