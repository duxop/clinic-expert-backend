const { prisma } = require("../config/database");
const jwt = require("jsonwebtoken");

const auth = async (req, res, next) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];
    // const { token } = cookies;
    //  || ;
    // console.log("auth", req.cookies?.token);
    // console.log(req.headers.authorization?.split(" ")[1]);

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
              id: true,
              name: true,
              Subscription: {
                where: {
                  status: "ACTIVE",
                  endDate: { gte: new Date() },
                },
                include: {
                  SubscriptionPlan: {
                    select: {
                      id: true,
                      name: true,
                      features: true,
                      oneTimePrice: true,
                      subscriptionPrice: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      if (!userData || token !== userData.JWT) {
        return res.status(401).json({ error: "Invalid token" });
      }

      req.userData = userData;
      // console.log("userData:", userData);
      next();
    });
  } catch (error) {
    console.error("Error in auth middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = auth;
