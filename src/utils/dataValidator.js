const bcrypt = require("bcrypt");
const validator = require("validator");

const verifyEmail = (data) => {
  const email = data.email?.trim();

  if (!email) {
    return {
      err: {
        code: 400,
        message: "Email is required",
      },
    };
  }
  if (!validator.isEmail(email))
    return {
      err: {
        code: 400,
        message: "Invalid email address.",
      },
    };
  return { email: validator.normalizeEmail(email) };
};

const verifySignUp = async (data) => {
  // Validate and sanitize fields
  console.log(data);
  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim();
  const clinicName = data.clinicName?.trim();
  const email = data.email?.trim();
  const password = data.password?.trim();

  // Check required fields
  const requiredFields = [
    { field: firstName, name: "First name" },
    { field: clinicName, name: "Clinic name" },
    { field: email, name: "Email" },
    { field: password, name: "Password" },
  ];

  const missingField = requiredFields.find(({ field }) => !field);
  if (missingField) {
    return {
      err: {
        code: 400,
        message: `${missingField.name} is required.`,
      },
    };
  }

  // Validation checks
  const checks = [
    {
      condition: !/^[a-zA-Z\s]+$/.test(firstName),
      message: "First name must contain only alphabetic characters.",
    },
    {
      condition: lastName && !/^[a-zA-Z\s]+$/.test(lastName),
      message: "Last name must contain only alphabetic characters.",
    },
    { condition: !validator.isEmail(email), message: "Invalid email address." },
    {
      condition: firstName.length > 50,
      message: "First name is too long (maximum 50 characters).",
    },
    {
      condition: lastName && lastName.length > 50,
      message: "Last name is too long (maximum 50 characters).",
    },
    {
      condition: clinicName.length > 50,
      message: "Clinic name is too long (maximum 50 characters).",
    },
    {
      condition: email.length > 64,
      message: "Email address is too long (maximum 64 characters).",
    },
    {
      condition: password.length > 50,
      message: "Password is too long (maximum 50 characters).",
    },
    {
      condition: password.length < 6,
      message: "Password is too short (minimum 6 characters).",
    },
  ];

  const error = checks.find((check) => check.condition);
  if (error) {
    return {
      err: {
        code: 400,
        message: error.message,
      },
    };
  }

  const hashPassword = await bcrypt.hash(password, 10);

  // Return sanitized data
  return {
    firstName: firstName.toUpperCase(),
    lastName: lastName ? lastName.toUpperCase() : null,
    clinicName: clinicName.toUpperCase(),
    email: validator.normalizeEmail(email),
    hashPassword, // Password is returned as-is. Hash before saving to the database.
  };
};

const verifySignIn = (data) => {
  const emailOrUsername = data.email?.trim();
  const password = data.password?.trim();

  // Validate required fields
  if (!emailOrUsername || !password) {
    return {
      err: { code: 400, message: "Email and password are required." },
    };
  }

  let sanitizedInput;

  // Check if input is an email
  const normalizedEmail = validator.normalizeEmail(emailOrUsername);
  if (normalizedEmail && validator.isEmail(normalizedEmail))
    sanitizedInput = normalizedEmail;
  // Assume the input is a username if not a valid email
  else sanitizedInput = emailOrUsername;

  return {
    email: sanitizedInput.toLowerCase(),
    password,
  };
};

const verifyStaffSignUp = (data) => {
  // Validate and sanitize fields
  const name = data.name?.trim();
  const staffRole = data.staffRole?.trim().toUpperCase();
  const username = data.username?.trim();
  const password = data.password?.trim();

  // Check required fields
  const requiredFields = [
    { field: name, name: "Name" },
    { field: staffRole, name: "Staff role" },
    { field: username, name: "Username" },
    { field: password, name: "Password" },
  ];

  const missingField = requiredFields.find(({ field }) => !field);
  if (missingField) {
    return {
      err: {
        code: 400,
        message: `${missingField.name} is required.`,
      },
    };
  }

  // Allowed staff roles
  const allowedRoles = ["DOCTOR", "RECEPTIONIST"];

  // Validation checks
  const checks = [
    {
      condition: !/^[a-zA-Z\s]+$/.test(name),
      message: "Name must contain alphabets and space characters.",
    },
    {
      condition: !allowedRoles.includes(staffRole),
      message: `Staff role must be one of: ${allowedRoles.join(", ")}.`,
    },
    {
      condition: !/^[a-zA-Z0-9_]+$/.test(username),
      message:
        "Username must contain only alphanumeric and underscore characters.",
    },
    {
      condition: username.length > 30,
      message: "Username is too long (maximum 30 characters).",
    },
    {
      condition: name.length > 50,
      message: "First name is too long (maximum 50 characters).",
    },
    {
      condition: password.length > 50,
      message: "Password is too long (maximum 50 characters).",
    },
    {
      condition: password.length < 6,
      message: "Password is too short (minimum 6 characters).",
    },
  ];

  const error = checks.find((check) => check.condition);
  if (error) {
    return {
      err: {
        code: 400,
        message: error.message,
      },
    };
  }

  // Return sanitized data
  return {
    name: name.toUpperCase(),
    staffRole, // Staff role is already in uppercase
    username: username.toLowerCase(),
    password, // Password is returned as-is. Hash before saving to the database.
  };
};

const verifyPatientData = (data) => {
  // Destructure and sanitize fields
  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim() || null;
  const email = data.email?.trim() || null;
  const phone = data.phone?.trim();
  const emergencyContact = data.emergencyContact?.trim() || null;
  const gender = data.gender?.trim().toUpperCase();
  const dob = new Date(data.dob?.trim()) || null;

  // Check required fields
  const requiredFields = [
    { field: firstName, name: "First name" },
    { field: phone, name: "Phone number" },
    { field: gender, name: "Gender" },
  ];

  const missingField = requiredFields.find(({ field }) => !field);
  if (missingField) {
    return {
      err: {
        code: 400,
        message: `${missingField.name} is required.`,
      },
    };
  }

  // Allowed genders
  const allowedGenders = ["MALE", "FEMALE", "OTHER", "NA"];

  // Validation checks
  const checks = [
    {
      condition: !validator.isAlpha(firstName),
      message: "First name must contain only alphabetic characters.",
    },
    {
      condition: lastName && !validator.isAlpha(lastName),
      message: "Last name must contain only alphabetic characters.",
    },
    {
      condition: email && !validator.isEmail(email),
      message: "Invalid email address.",
    },
    {
      condition: !validator.isMobilePhone(phone, "any"),
      message: "Invalid phone number.",
    },
    {
      condition:
        emergencyContact && !validator.isMobilePhone(emergencyContact, "any"),
      message: "Invalid emergency contact number.",
    },
    {
      condition: !allowedGenders.includes(gender),
      message: `Gender must be one of: ${allowedGenders.join(", ")}.`,
    },
    {
      condition: dob && isNaN(dob.getTime()),
      message: "Date of birth must be in the format YYYY-MM-DD.",
    },
    {
      condition: firstName.length > 50,
      message: "First name is too long (maximum 50 characters).",
    },
    {
      condition: lastName && lastName.length > 50,
      message: "Last name is too long (maximum 50 characters).",
    },
    {
      condition: phone.length > 15,
      message: "Phone number is too long (maximum 15 digits).",
    },
    {
      condition: emergencyContact && emergencyContact.length > 15,
      message: "Emergency contact number is too long (maximum 15 digits).",
    },
  ];

  const error = checks.find((check) => check.condition);
  if (error) {
    return {
      err: {
        code: 400,
        message: error.message,
      },
    };
  }

  // Return sanitized data
  return {
    firstName: firstName.toUpperCase(),
    lastName: lastName ? lastName.toUpperCase() : null,
    email: email ? validator.normalizeEmail(email) : null,
    phone,
    emergencyContact,
    gender,
    dob,
  };
};

const verifyNameUpdate = (data) => {
  // Validate and sanitize fields
  const firstName = data.firstName?.trim();
  const lastName = data.lastName?.trim();

  // Check required fields
  const requiredFields = [{ field: firstName, name: "First name" }];

  const missingField = requiredFields.find(({ field }) => !field);
  if (missingField) {
    return {
      err: {
        code: 400,
        message: `${missingField.name} is required.`,
      },
    };
  }

  // Validation checks
  const checks = [
    {
      condition: !validator.isAlpha(firstName, "en-US", { ignore: " " }),
      message: "First name must contain only alphabetic characters and spaces.",
    },
    {
      condition:
        lastName && !validator.isAlpha(lastName, "en-US", { ignore: " " }),
      message: "Last name must contain only alphabetic characters.",
    },
  ];

  const error = checks.find((check) => check.condition);
  if (error) {
    return {
      err: {
        code: 400,
        message: error.message,
      },
    };
  }

  // Return sanitized data
  return {
    firstName: firstName.toUpperCase(),
    lastName: lastName ? lastName.toUpperCase() : null,
  };
};

module.exports = {
  verifyEmail,
  verifySignUp,
  verifySignIn,
  verifyStaffSignUp,
  verifyPatientData,
  verifyNameUpdate,
};
