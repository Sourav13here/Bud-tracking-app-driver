const db = require('../config/database');
const haversine = require('../../utils/haversine'); 

const STOPPAGE_RADIUS_METERS = 200;

exports.postBusLocation = async (req, res) => {
  const { bus_name, bus_latitude, bus_longitude } = req.body;

  if (!bus_name || !bus_latitude || !bus_longitude) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {

    // 1. Insert location in bus_location table
    const [result] = await db.query(
      `INSERT INTO bus_location (bus_name, bus_latitude, bus_longitude)
       VALUES (?, ?, ?)`,
      [bus_name, bus_latitude, bus_longitude]
    );

    // 2. Find the route associated with this bus
    const [[busRow]] = await db.query(
      `SELECT route FROM bus WHERE bus_name = ?`,
      [bus_name]
    );

    if (!busRow || !busRow.route) {
      return res.status(404).json({ error: 'Bus route not found' });
    }

    const routeName = busRow.route;

    // 3. Get ALL stoppages in this route
    const [stoppages] = await db.query(
      `SELECT route_id, stoppage_latitude, stoppage_longitude 
       FROM route 
       WHERE route_name = ?`,
      [routeName]
    );

    // 4. Check if the bus is near any stoppage
    for (let stoppage of stoppages) {
      const distance = haversine(
        parseFloat(bus_latitude),
        parseFloat(bus_longitude),
        parseFloat(stoppage.stoppage_latitude),
        parseFloat(stoppage.stoppage_longitude)
      );

      if (distance <= STOPPAGE_RADIUS_METERS) {
        // 5. Mark the stoppage as arrived
        await db.query(
          `UPDATE route SET has_arrived = 1 WHERE route_id = ?`,
          [stoppage.route_id]
        );

        console.log(`Stoppage ID ${stoppage.route_id} marked as arrived.`);
        break; // Optional: stop after first match
      }
    }

    return res.status(201).json({
      message: 'Bus location inserted and nearby stoppage checked',
      location_id: result.insertId
    });
  } catch (err) {
    console.error('DB Error:', err.message);
    return res.status(500).json({ error: 'Database error' });
  }
};
