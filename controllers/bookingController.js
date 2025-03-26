const Appointment = require("../models/appointment");

// Create New Appointment
// exports.createAppointment = async (req, res) => {
//   try {
//     const { customerId, employeeId, service, date, startTime, endTime, notes, price, branchId } = req.body;

//     if (!branchId) {
//       return res.status(400).json({ message: "Branch ID is required" });
//     }

//     const newAppointment = new Appointment({
//       customerId,
//       employeeId,
//       service,
//       date,
//       startTime,
//       endTime,
//       notes,
//       price,
//       branchId,
//     });

//     await newAppointment.save();
//     res.status(201).json({ message: "Appointment created successfully", appointment: newAppointment });
//   } catch (error) {
//     console.error("Error creating appointment:", error);
//     res.status(500).json({ message: "Server Error", error: error.message });
//   }
// };
exports.createAppointment = async (req, res) => {
  try {
    const {
      customer, // Customer details (name, email, mobile, gender, lastName)
      services, // Array of services (name, price, time)
      staff, // Array of staff IDs or names
      date, // Date of the appointment
      time, // Time of the appointment
      customerType, // Type of customer (walkin or appointment)
      staffType, // Type of staff assignment (single or multiple)
      appointmentNote, // Notes for the appointment
      clientNote, // Notes for the client
      branchId, // Branch ID
    } = req.body;

    // Validate required fields
    if (!branchId || !customer || !services || !staff || !date || !time || !customerType || !staffType) {
      return res.status(400).json({ message: "All required fields must be provided" });
    }

    // Validate services array
    if (!Array.isArray(services) || services.length === 0) {
      return res.status(400).json({ message: "At least one service must be provided" });
    }

    // Validate staff array
    if (!Array.isArray(staff) || staff.length === 0) {
      return res.status(400).json({ message: "At least one staff member must be assigned" });
    }

    // Calculate total price
    const totalPrice = services.reduce((total, service) => total + service.price, 0);

    // Create the appointment
    const newAppointment = new Appointment({
      customer,
      services,
      staff,
      date,
      time,
      customerType,
      staffType,
      appointmentNote,
      clientNote,
      branchId,
      totalPrice,
    });

    // Save the appointment to the database
    await newAppointment.save();

    // Send success response
    res.status(201).json({
      message: "Appointment created successfully",
      appointment: newAppointment,
    });
  } catch (error) {
    console.error("Error creating appointment:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};


exports.getAppointments = async (req, res) => {
  try {
    const { branchId } = req.query;

    // Validate branchId
    if (!branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    // Fetch appointments for the given branchId
    const appointments = await Appointment.find({ branchId })
      .select(
        "customer services staff date time customerType staffType appointmentNote clientNote totalPrice status paymentStatus"
      )
      .exec();

    // Send the response
    res.status(200).json({ success: true, appointments });
  } catch (error) {
    console.error("Error fetching appointments:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};
