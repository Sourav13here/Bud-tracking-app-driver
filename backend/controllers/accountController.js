const db = require('../config/database');

// Fetch driver details by phone number
const getDriverByPhone = async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT driver_name, driver_phone_no, driver_photo, driver_address, bus_no, status FROM driver WHERE driver_phone_no = ?',
      [phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Driver not found' });
    }

    res.json({ success: true, driver: rows[0] });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getDriverByPhone
};
