const express = require("express");
const cors = require("cors");
const connectDB = require("./db");
const bookRoutes = require("./routes/bookRoutes");

const app = express();
connectDB();

app.use(cors());
app.use(express.json());

app.use("/books", bookRoutes);

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));