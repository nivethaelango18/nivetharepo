const express = require("express");
const app = express();

app.use(express.json());

const patientRoutes = require("./routes/patients.js");
app.use("/patients", patientRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Hospital server running at http://localhost:${PORT}`);
});
