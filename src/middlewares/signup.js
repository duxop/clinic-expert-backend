const prisma = require("./../config/client");

const signup = async (req, res, next) => {
  const { firstName, lastName, clinicName, email, password } = req.body;

  // Check if username and password are provided
  if (!firstName || !lastName || !clinicName || !email || !password) {
    console.log("Missing required fields");
    return res.status(400).json({ error: "Please fill all the details" });
  }

  const existingUser = await prisma.User.findUnique({
    where: {
      email: email,
    },
  }); // Replace with actual check

  if (existingUser) {
    return res.status(409).json({ error: "Email already exists" });
  }
  const currentDate = new Date();
  const subscriptionEndsOn = new Date(currentDate);
  subscriptionEndsOn.setDate(subscriptionEndsOn.getDate() + 30);

  const clinic = await prisma.Clinic.create({
    data: {
      email: email,
      name: clinicName,
      subscriptionStatus: "TRIAL",
      subscriptionEndsOn: subscriptionEndsOn, // Default subscription status
    },
  });

  const user = await prisma.User.create({
    data: {
      firstName,
      lastName,
      email,
      password,
      role: "ADMIN", // Default role for new users
      clinicId: clinic.id, // Associate user with the created clinic
    },
  });
  console.log("User created:", user);
  // Proceed to the next middleware or route handler
  return res.status(201).json({ message: "User created successfully", user });
};

module.exports = signup;
