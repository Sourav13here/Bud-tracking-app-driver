// controller/busController.js

const db = require('../config/database');

exports.postBusLocation = async (req, res) => {
  const { bus_name, bus_latitude, bus_longitude } = req.body;

  if (!bus_name || !bus_latitude || !bus_longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const [result] = await db.query(
      `INSERT INTO bus_location (bus_name, bus_latitude, bus_longitude)
       VALUES (?, ?, ?)`,
      [bus_name, bus_latitude, bus_longitude]
    );

    return res.status(201).json({
      message: 'Bus location inserted successfully',
      location_id: result.insertId
    });
  } catch (err) {
    console.error('DB Error:', err.message);
    return res.status(500).json({ error: 'Database error' });
  }
};

