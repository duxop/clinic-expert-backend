const access = (roleAllowed) => (req, res, next) => {
  try {
    const userRole = req.userData.role;
    if (roleAllowed === "ADMIN" && userRole !== "ADMIN")
      return res.status(402).json({ error: "You don't have access to this" });
    if (roleAllowed === "RECEPTIONIST" && userRole === "DOCTOR")
      return res.status(402).json({ error: "You don't have access to this" });
    next();
  } catch (error) {
    console.error("Error during access control middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = access;