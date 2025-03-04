const Appointment = require("../models/appointment");

// Create New Appointment
exports.createbooking = async (req, res) => {
  try {
    const { customerId, branchId, employeeId, service, date, startTime, endTime, notes, price } = req.body;

    if (!customerId || !branchId || !employeeId || !service || !date || !startTime || !endTime) {
      return res.status(400).json({ message: "All fields are required!" });
    }

    const newAppointment = new Appointment({
      customerId,
      branchId,
      employeeId,
      service,
      date,
      startTime,
      endTime,
      notes,
      price,
      status: "Pending",
    });

    await newAppointment.save();
    res.status(201).json({ message: "Appointment booked successfully!", appointment: newAppointment });
  } catch (error) {
    res.status(500).json({ message: "Server Error", error });
  }
};

// Get All Appointments by salon admin and currently branch is is not defined
exports.getallappointments = async (req, res) => {
  try {
    const salonAdminId = req.user._id;

    // ✅ Salon Admin ki branches fetch karna
    const salonAdmin = await SalonAdmin.findById(salonAdminId);
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }

    // ✅ Branch-wise appointments fetch karna
    const appointments = await Appointment.find({ branchId: { $in: salonAdmin.branchIds } }) 
      .populate("customerId employeeId branchId");

    // ✅ Events ko calendar-friendly format me convert karna
    const formattedAppointments = appointments.map((appt) => ({
      id: appt._id,
      title: `${appt.service} - ${appt.customerId.name}`,
      start: appt.date,
      end: moment(appt.date).add(1, "hour").toDate(), // 1-hour default duration
      employee: appt.employeeId ? appt.employeeId.name : "Unassigned",
      status: appt.status,
    }));

    res.status(200).json(formattedAppointments);
  } catch (error) {
    console.error("Error Fetching Appointments:", error);
    res.status(500).json({ message: "Server Error", error });
  }
};
