require("dotenv").config();

const express = require("express");
const cookieParser = require("cookie-parser");
const { connection } = require("./config/database");
const cors = require("cors");
const bodyParser = require("body-parser");

const authRoute = require("./routes/authRoute");
const clinicRoute = require("./routes/clinicRoute");
const patientRoute = require("./routes/patientRoute");
const userRoute = require("./routes/userRoute");
const appointmentRoute = require("./routes/appointmentRoute");

const app = express();
const PORT = process.env.PORT || 4000;

app.use(express.json());
// parse application/x-www-form-urlencoded, basically can only parse incoming Request Object if strings or arrays
app.use(express.urlencoded({ extended: false }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
// app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: "http://localhost:3000", // Replace with your frontend URL
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Allow cookies and authorization headers
  })
);

app.use("/api/auth", authRoute);
app.use("/api/clinic", clinicRoute);
app.use("/api/patient", patientRoute);
app.use("/api/user", userRoute);
app.use("/api/appointment", appointmentRoute);

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
