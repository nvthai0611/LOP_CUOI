const { default: mongoose } = require("mongoose");
const JobsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is require"],
    },
    issues: [
      {
        title: String,
        date: {
          type: Date,
          default: new Date(),
        },
        isCompleted: {
          type: Boolean,
          default: false,
        },
      },
    ],
  },
  { timestamps: { createdAt: "startDate", updatedAt: "endDate" } } // chi nhan nullish => false
);

const Job = mongoose.model("Job", JobsSchema, "Jobs");

// department
const DepartmentSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "DepartmentName requ"],
    },
    description: String,
  },
  { timestamps: false }
);

const Department = mongoose.model("Department", DepartmentSchema, "Departments");

// employees
const EmployeeSchema = new mongoose.Schema(
  {
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
        required: true,
      },
      middleName: {
        type: String,
      },
    },
    dateOfBirth: Date,
    gender: {
      type: String,
      enum: ["male", "female", "other"],
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
    },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Department",
    },
    account: {
      email: {
        type: String,
        required: true,
        unique: true,
      },
      password: {
        type: String,
        required: true,
      },
    },
    dependents: {
      type: [
        {
          _id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Employee",
          },
          fullname: String,
          relation: String,
        },
      ],
    },
    jobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Job"
      }
    ]
  },
  { timestamps: false }
);

// create vitrual
EmployeeSchema.virtual("fullName").get(function () {
  return `${this.name.firstName} ${this.name.middleName} ${this.name.lastName}`;
})

const Employee = mongoose.model("Employee", EmployeeSchema, "Employees");

module.exports = { Job, Department, Employee };
