const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config();
const app = express();

// Parse JSON request bodies
app.use(express.json());

//Routes
app.use("/api/users", require("./routes/userRoutes"));

//Connect DB and Start Server
const PORT = process.env.PORT || 10001

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connection successful");
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch((err) => console.error("Mongoose connection error:", err));
