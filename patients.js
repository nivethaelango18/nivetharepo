const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const dbPath = path.join(__dirname, "../data/db.json");

function readDB() {
  return JSON.parse(fs.readFileSync(dbPath));
}

function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

/* GET ALL PATIENTS */
router.get("/", (req, res) => {
  const db = readDB();
  res.json(db.patients);
});

/* ADD MULTIPLE PATIENTS */
router.post("/batch", (req, res) => {
  const db = readDB();
  const newPatients = req.body.patients;

  db.patients.push(...newPatients);
  writeDB(db);

  res.status(201).json(newPatients);
});

/* UPDATE MULTIPLE PATIENTS */
router.put("/batch", (req, res) => {
  const db = readDB();
  const updates = req.body.patients;

  let updated = [];

  updates.forEach(p => {
    const index = db.patients.findIndex(pt => pt.id === p.id);
    if (index !== -1) {
      db.patients[index] = { ...db.patients[index], ...p };
      updated.push(db.patients[index]);
    }
  });

  writeDB(db);
  res.json({
    updatedCount: updated.length,
    updatedPatients: updated
  });
});

/* DELETE MULTIPLE PATIENTS */
router.delete("/batch", (req, res) => {
  const db = readDB();
  const ids = req.body.ids;

  const before = db.patients.length;
  db.patients = db.patients.filter(p => !ids.includes(p.id));
  const after = db.patients.length;

  writeDB(db);

  res.json({ deleted: before - after });
});

module.exports = router;
