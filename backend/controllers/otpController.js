const db = require('../config/database');

// Step 1: Request OTP
exports.requestOtp = async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ error: 'Phone number is required' });
  }

  const otp = Math.floor(1000 + Math.random() * 9000).toString(); // 4-digit OTP
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
  const createdAt = new Date();

  try {
    // Check if phone exists in driver table
    const [existing] = await db.query(
      'SELECT * FROM driver WHERE driver_phone_no = ?',
      [phone]
    );

    if (existing.length === 0) {
      // Don't insert new driver, just respond silently
      return res.json({ success: false, message: 'Phone number not registered' });
    }

    // Update OTP fields for existing driver
    await db.query(
      'UPDATE driver SET otp_code = ?, otp_expires_at = ?, otp_created_at = ? WHERE driver_phone_no = ?',
      [otp, expiresAt, createdAt, phone]
    );

    console.log(`OTP for ${phone}: ${otp}`); // Simulate sending SMS
    res.json({ success: true, message: 'OTP sent (simulated)' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

// Step 2: Verify OTP
exports.verifyOtp = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ error: 'Phone and OTP are required' });
  }

  try {
    const [rows] = await db.query(
      'SELECT * FROM driver WHERE driver_phone_no = ? AND otp_code = ? AND otp_expires_at > NOW()',
      [phone, otp]
    );

    if (rows.length === 0) {
      return res.status(401).json({ error: 'Invalid or expired OTP' });
    }

    // Clear OTP after successful verification
    await db.query(
      'UPDATE driver SET otp_code = NULL, otp_expires_at = NULL WHERE driver_phone_no = ?',
      [phone]
    );

    res.json({ success: true, message: 'OTP verified', driver: rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
