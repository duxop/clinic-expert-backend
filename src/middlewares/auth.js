const { prisma } = require("../config/database");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    // const { token } = cookies;
    //  || ;
    console.log("auth", req.cookies?.token);
    console.log(req.headers.authorization?.split(" ")[1]);

    if (!token) {
      return res.status(401).json({ error: "Please sign-in first" });
    }

    jwt.verify(token, "vadapav", async (err, decoded) => {
      if (err) {
        return res.status(401).json({ error: "Invalid token" });
      }

      const userData = await prisma.User.findUnique({
        where: { id: decoded.userId },
        include: {
          Clinic: {
            select: {
              subscriptionEndsOn: true,
              name: true,
            },
          },
        },
      });

      if (!userData || token !== userData.JWT) {
        return res.status(401).json({ error: "Invalid token" });
      }
      const currentTime = new Date();
      console.log(currentTime);
      console.log(userData.Clinic.subscriptionEndsOn);
      // userData.Clinic.subscriptionEndsOn;
      // if (userData.Clinic.subscriptionEndsOn <= currentTime)
      //   return res.status(401).json({ error: "Subscription Expired" });
      req.userData = userData;
      console.log("userData:", userData);
      // Attach user info to the request object
      next(); // Proceed to the next middleware or route handler
    });
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = auth;
