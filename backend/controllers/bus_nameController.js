const db = require('../config/database');

// Get bus_name by driver's phone number
const getBusNameByPhone = async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT bus_name FROM driver WHERE driver_phone_no = ?`,
      [phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No driver found with this phone number' });
    }

    res.json({ success: true, bus_name: rows[0].bus_name });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getBusNameByPhone,
};
