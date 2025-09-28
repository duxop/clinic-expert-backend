
const getSubscription = async (req, res) => {
  try {
    return res.status(200).json({userData: req.userData})

  } catch (error) {
    console.error("Error during getting all patients:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = getSubscription;
