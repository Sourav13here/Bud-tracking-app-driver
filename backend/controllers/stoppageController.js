const db = require('../config/database');

// Get stoppages by driver's phone number
const getStoppagesByPhone = async (req, res) => {
  const { phone } = req.params;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  try {
    const [rows] = await db.query(
      `SELECT 
         r.route_name,
         r.stoppage_name,
         r.stoppage_latitude,
         r.stoppage_longitude,
         r.stoppage_number
       FROM driver AS d
       JOIN bus AS b ON d.bus_name = b.bus_name
       JOIN route AS r ON b.route = r.route_name
       WHERE d.driver_phone_no = ?`,
      [phone]
    );

    if (rows.length === 0) {
      return res.status(404).json({ error: 'No stoppages found for this driver' });
    }

    res.json({ success: true, stoppages: rows });
  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'Server error' });
  }
};

module.exports = {
  getStoppagesByPhone,
};
