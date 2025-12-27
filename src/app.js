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
const subscriptionRoute = require("./routes/subscriptionRoute");
const invoicePrefillsRoute = require("./routes/invoicePrefills");

const app = express();
const PORT = process.env.PORT || 4000;

// Increase body size limit to handle large base64 images (50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
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
app.use("/subscription", subscriptionRoute);
app.use("/invoicePrefills", invoicePrefillsRoute);

// Handle payload too large errors
app.use((err, req, res, next) => {
  if (err.type === 'entity.too.large') {
    return res.status(413).json({ 
      error: 'Payload too large. Please reduce the image size or use a smaller image.' 
    });
  }
  next(err);
});

app.use((req, res, next) => {
  res.status(404).json({ message: "Route not found" });
});

connection()
  .then(() => {
    console.log("Database connected successfully");
    app.listen(PORT, "127.0.0.1", () => {
      console.log(`Server is running on http://127.0.0.1:${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection failed:", error);
  });
