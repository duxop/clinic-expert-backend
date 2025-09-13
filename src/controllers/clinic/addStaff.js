const { prisma } = require("../../config/database");
const bcrypt = require("bcrypt");
const { verifyStaffSignUp } = require("../../utils/dataValidator");

const addStaff = async (req, res) => {
  try {
    const { clinicId } = req.userData;
    const { name, staffRole, username, password, err } = verifyStaffSignUp(
      req.body
    );

    if (err) {
      return res.status(err.code).json({ error: err.message });
    }

    const checkUsername = await prisma.User.findUnique({
      where: { email: username },
    });
    if (checkUsername)
      return res.status(409).json({ error: "Username already exists" });

    const hashPassword = await bcrypt.hash(password, 10);
    if (staffRole === "RECEPTIONIST") {
      const staff = await prisma.User.create({
        data: {
          firstName: name,
          role: staffRole,
          email: username,
          password: hashPassword,
          clinicId,
          updatedAt: new Date(),
        },
      });

      return res
        .status(201)
        .json({ message: "User created successfully", data: staff });
    }
    const doctor = await prisma.user.create({
      data: {
        firstName: name,
        role: staffRole,
        email: username,
        password: hashPassword,
        clinicId,
        updatedAt: new Date(),
        Doctor: {
          create: {
            name,
            clinicId, // must match the clinicId used in Doctor model
          },
        },
      },
      include: {
        Doctor: true,
      },
    });
    const { doctorPassword, ...withoutPassword } = doctor;
    withoutPassword.doctorId = withoutPassword.Doctor.id;

    return res
      .status(201)
      .json({ message: "User created successfully", data: withoutPassword });
  } catch (error) {
    console.error("Error during adding staff:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = addStaff;
