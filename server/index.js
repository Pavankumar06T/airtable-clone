const express = require("express"); 
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors"); // 👈 Add this

const authRoute = require("./routes/auth"); // 👈 Add this

dotenv.config(); // ✅ This line MUST come BEFORE using process.env!

const app = express();

app.use(cors()); // 👈 Allow frontend to connect
app.use(express.json()); // 👈 Enable JSON body parsing

// ✅ MongoDB Connection
mongoose.connect(process.env.MONGO_URL)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log("MongoDB Connection Error:", err));

// ✅ Add your auth route
app.use("/api/auth", authRoute); // 👈 Now your auth routes will work

// ✅ Start the server
app.listen(5000, () => {
  console.log("Server running on port 5000");
});