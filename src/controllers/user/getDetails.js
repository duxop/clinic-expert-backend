const { prisma } = require("../../config/database");
const getUserData = require("../../utils/getUserData");

const getDetails = async (req, res) => {
  try {
    // console.log(req.userData)
    const userWithoutPassword = await getUserData(req.userData);
    console.log(userWithoutPassword);
    return res.status(200).json({
      message: "User details retrieved successfully.",
      user: userWithoutPassword,
    });
  } catch (error) {
    // Log detailed error for debugging
    console.error("Error during fetching user details", error);
    // Send appropriate error response
    return res
      .status(500)
      .json({ error: "An internal server error occurred." });
  }
};

module.exports = getDetails;
