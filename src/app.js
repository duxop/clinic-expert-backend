require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { connection } = require("./config/database");
const cors = require("cors");

const authRoute = require("./routes/authRoute");
const clinicRoute = require("./routes/clinicRoute");
const patientRoute = require("./routes/patientRoute");
const userRoute = require("./routes/userRoute");
const appointmentRoute = require("./routes/appointmentRoute");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// ✅ Allow frontend (local + production)
app.use(
  cors({
    origin: [
      "http://localhost:3000", // local dev
      "https://clinicxpert.in", // prod root domain
      "https://www.clinicxpert.in", // prod www domain
    ],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use("/auth", authRoute);
app.use("/clinic", clinicRoute);
app.use("/patient", patientRoute);
app.use("/user", userRoute);
app.use("/appointment", appointmentRoute);

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

connection()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
