const Appointment = require("../models/appointment");
const Order = require("../models/order");
const SalonAdmin = require("../models/salonAdminAuth"); // ✅ SalonAdmin Model Import
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");

exports.createAppointment = async (req, res) => {
  try {
    const { customerId, employeeId, serviceId, date, startTime, endTime, notes, price, branchId, paymentMethod, paymentDetails } = req.body;

    if (!branchId) {
      return res.status(400).json({ message: "Branch ID is required" });
    }

    if (!paymentMethod) {
      return res.status(400).json({ message: "Payment method is required" });
    }

    // नया अपॉइंटमेंट बनाना
    const newAppointment = new Appointment({
      customerId,
      assignedEmployee: employeeId,
      serviceId,
      date,
      startTime,
      endTime,
      notes,
      price,
      branchId,
      status: "Completed", // अपॉइंटमेंट का स्टेटस सीधे Completed कर दिया
    });

    const savedAppointment = await newAppointment.save();

    // अब नया ऑर्डर बनाना
    const newOrder = new Order({
      appointmentId: savedAppointment._id,
      customerId,
      branchId,
      serviceId,
      employeeId,
      price,
      status: "Completed",
      paymentStatus: "Paid",
      paymentMethod,
      paymentDetails
    });

    await newOrder.save();

    res.status(201).json({ 
      message: "Appointment created and marked as Completed. Order also created.",
      appointment: savedAppointment,
      order: newOrder
    });

  } catch (error) {
    console.error("Error creating appointment and order:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.getSalonAllOrders = async (req, res) => {
  try {
    if (!req.user || req.user.role !== "salonadmin") {
      return res.status(403).json({ message: "Access denied! Only Salon Admins can access this data" });
    }

    const { branchId } = req.branchFilter;    
    // ✅ Fetch orders based on Salon Admin's branches using req.branchFilter
    const orders = await Order.find({ branchId })
    .populate({
        path: "appointmentId",
        populate: { path: "customerId assignedEmployee serviceId branchId" },
    })
    .populate("customerId serviceId employeeId branchId")
    .sort({ createdAt: -1 });
  

    res.status(200).json({
      message: "Orders fetched successfully",
      orders,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.generateDynamicReceipt = async (req, res) => {
  try {
    const { orderId } = req.params;
    const order = await Order.findById(orderId).populate("customerId serviceId employeeId branchId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // ✅ Fetch SalonAdmin Details
    const salonAdmin = await SalonAdmin.findById(order.branchId.createdBy);
    if (!salonAdmin) {
      return res.status(404).json({ message: "Salon Admin not found" });
    }

    // ✅ Fetch Salon Name & Address
    const salonName = salonAdmin.salonName || "Your Salon";
    const salonAddress = `${salonAdmin.address.street}, ${salonAdmin.address.city}, ${salonAdmin.address.state} - ${salonAdmin.address.zipCode}, ${salonAdmin.address.country}`;
    const businessEmail = salonAdmin.businessEmail || "N/A";
    const businessPhone = salonAdmin.businessPhone || "N/A";

    // PDF File Path
    const doc = new PDFDocument({ margin: 50 });
    const filePath = path.join(__dirname, `../receipts/order_${orderId}.pdf`);
    const writeStream = fs.createWriteStream(filePath);
    doc.pipe(writeStream);

    // **1️⃣ Dynamic Salon Name & Address**
    doc
      .fontSize(20)
      .text(salonName.toUpperCase(), { align: "center" })
      .moveDown()
      .fontSize(12)
      .text(salonAddress, { align: "center" })
      .text(`Phone: ${businessPhone} | Email: ${businessEmail}`, { align: "center" });

    // **2️⃣ Order Details**
    doc.moveDown(2).fontSize(16).text("Salon Order Receipt", { align: "center" });
    doc
      .moveDown()
      .fontSize(14)
      .text(`Order ID: ${order._id}`)
      .text(`Customer Name: ${order.customerId.name}`)
      .text(`Service: ${order.serviceId.name}`)
      .text(`Assigned Employee: ${order.employeeId.name}`)
      .text(`Branch: ${order.branchId.name}`)
      .text(`Total Amount: ₹${order.totalPrice}`)
      .text(`Date: ${order.createdAt.toDateString()}`);

    // **3️⃣ Horizontal Line**
    doc.moveDown().moveTo(50, doc.y).lineTo(550, doc.y).stroke();

    // **4️⃣ Footer & Signature**
    doc
      .moveDown(2)
      .fontSize(12)
      .text(`Thank you for choosing ${salonName}!`, { align: "center" })
      .text(`For queries, contact ${businessEmail}`, { align: "center" })
      .moveDown(2);

    // **Authorized Signature**
    doc.moveDown().text("Authorized Signature", 400, doc.y + 30);
    doc.moveTo(400, doc.y + 5).lineTo(550, doc.y + 5).stroke(); // Signature line

    // Finalize PDF
    doc.end();

    // Send PDF as response
    writeStream.on("finish", () => {
      res.download(filePath, `Receipt_${orderId}.pdf`, (err) => {
        if (err) console.error("Download error:", err);
        fs.unlinkSync(filePath); // Delete after download
      });
    });

  } catch (error) {
    console.error("Error generating receipt:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};