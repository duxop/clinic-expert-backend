const checkSubscription = (req, res, next) => {
  try {
    const subscription = req.userData?.Clinic?.Subscription;

    if (!subscription[0]) {
        console.log("Checkujdsbcvdsbhjdbhjdsb")
      return res.status(401).json({ error: "No subscription found" });
    }

    if (subscription[0].endDate && new Date(subscription[0].endDate) < new Date()) {
      return res.status(401).json({ error: "Subscription has expired" });
    }

    return next();
  } catch (error) {
    console.error("Error during subscription middleware:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = checkSubscription;
