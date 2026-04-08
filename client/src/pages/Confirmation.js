import { useParams, Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import { FaCheckCircle } from "react-icons/fa";

function Confirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const fetchBooking = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:5000/api/bookings/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        const found = res.data.find((b) => b._id === id);
        setBooking(found || null);
      } catch (err) { console.log(err); }
    };
    fetchBooking();
  }, [id]);

  const programFee = booking?.batchId?.fees || 0;
  const registration = 500;
  const gst = Math.round(programFee * 0.18);
  const total = programFee + registration + gst;
  const program = booking?.batchId?.title || "—";
  const level = booking?.batchId?.level || "—";
  const invoiceDate = new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "long", year: "numeric" });
  const invoiceNo = `INV-${id?.slice(-8)?.toUpperCase()}`;

  //  PDF
  const downloadInvoice = () => {
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const W = 210;
    const margin = 18;

    // Header bg
    doc.setFillColor(15, 40, 20);
    doc.rect(0, 0, W, 42, "F");

    // Logo circle
    doc.setFillColor(22, 163, 74);
    doc.circle(margin + 8, 21, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("CA", margin + 5, 24);

    // Academy name
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("Cricket Academy", margin + 20, 19);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 220, 180);
    doc.text("Professional Cricket Training", margin + 20, 26);
    doc.text("info@cricketacademy.com  |  +91 98765 43210", margin + 20, 32);
    doc.text("Mumbai, India", margin + 20, 38);

    // INVOICE label
    doc.setFontSize(22);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("INVOICE", W - margin, 22, { align: "right" });
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(180, 220, 180);
    doc.text(`No: ${invoiceNo}`, W - margin, 30, { align: "right" });
    doc.text(`Date: ${invoiceDate}`, W - margin, 36, { align: "right" });

    // Green divider
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.8);
    doc.line(margin, 47, W - margin, 47);

    // Bill To
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("BILL TO", margin, 56);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(booking?.userId?.name || "Student", margin, 63);
    doc.text(`Booking ID: booking-${id}`, margin, 69);
    doc.text("Payment Method: UPI / Online", margin, 75);

    // Program Info
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(100, 100, 100);
    doc.text("PROGRAM", W - margin - 60, 56);
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(20, 20, 20);
    doc.text(program, W - margin - 60, 63);
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Level: ${level}`, W - margin - 60, 69);
    doc.text("Training Start: 2026-04-01", W - margin - 60, 75);

    // Table header
    const tableY = 86;
    doc.setFillColor(22, 163, 74);
    doc.rect(margin, tableY, W - margin * 2, 9, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("#", margin + 3, tableY + 6);
    doc.text("DESCRIPTION", margin + 12, tableY + 6);
    doc.text("QTY", margin + 110, tableY + 6);
    doc.text("RATE", margin + 125, tableY + 6);
    doc.text("AMOUNT", W - margin - 3, tableY + 6, { align: "right" });

    // Table rows
    const rows = [
      {
        no: "01",
        desc: `Monthly Training Fee — ${program}`,
        qty: "1", rate: `Rs.${programFee}`,
        amt: `Rs.${programFee}`
      },
      {
        no: "02",
        desc: "Registration / Enrollment Fee",
        qty: "1", rate: `Rs.${registration}`,
        amt: `Rs.${registration}`
      },
      {
        no: "03",
        desc: "GST (18%) on Training Fee",
        qty: "—", rate: "18%",
        amt: `Rs.${gst}`
      },
    ];

    let rowY = tableY + 9;
    rows.forEach((row, i) => {
      const bg = i % 2 === 0 ? [248, 252, 248] : [255, 255, 255];
      doc.setFillColor(...bg);
      doc.rect(margin, rowY, W - margin * 2, 10, "F");
      doc.setFontSize(9);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(60, 60, 60);
      doc.text(row.no, margin + 3, rowY + 6.5);
      doc.text(row.desc, margin + 12, rowY + 6.5);
      doc.text(row.qty, margin + 110, rowY + 6.5);
      doc.text(row.rate, margin + 125, rowY + 6.5);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(20, 20, 20);
      doc.text(row.amt, W - margin - 3, rowY + 6.5, { align: "right" });
      rowY += 10;
    });

    // Table border
    doc.setDrawColor(200, 230, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, tableY, W - margin * 2, rowY - tableY);

    // Total box
    const totY = rowY + 6;
    doc.setFillColor(15, 40, 20);
    doc.rect(W - margin - 70, totY, 70, 14, "F");
    doc.setFontSize(11);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("TOTAL AMOUNT", W - margin - 67, totY + 6);
    doc.setFontSize(13);
    doc.setTextColor(74, 222, 128);
    doc.text(`Rs.${total}`, W - margin - 3, totY + 10, { align: "right" });

    // Sub totals
    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(80, 80, 80);
    doc.text(`Subtotal:  Rs.${programFee + registration}`, margin, totY + 6);
    doc.text(`GST (18%): Rs.${gst}`, margin, totY + 12);

    // Paid badge
    const badgeY = totY + 24;
    doc.setFillColor(22, 163, 74);
    doc.roundedRect(margin, badgeY, 32, 9, 2, 2, "F");
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(255, 255, 255);
    doc.text("PAID", margin + 8, badgeY + 6);
    doc.setFontSize(8);
    doc.setFont("helvetica", "normal");
    doc.setTextColor(100, 100, 100);
    doc.text(`Payment confirmed on ${invoiceDate}`, margin + 36, badgeY + 6);

    // Divider
    doc.setDrawColor(22, 163, 74);
    doc.setLineWidth(0.5);
    doc.line(margin, badgeY + 14, W - margin, badgeY + 14);

    // Footer
    const footY = badgeY + 22;
    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(22, 163, 74);
    doc.text("Thank you for choosing Cricket Academy!", W / 2, footY, { align: "center" });
    doc.setFont("helvetica", "normal");
    doc.setTextColor(130, 130, 130);
    doc.text("For queries: info@cricketacademy.com  |  +91 98765 43210", W / 2, footY + 6, { align: "center" });
    doc.text("This is a computer-generated invoice. No signature required.", W / 2, footY + 12, { align: "center" });

    doc.save(`Invoice_${invoiceNo}.pdf`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white py-14 px-6">

      <div className="max-w-4xl mx-auto text-center">
        <FaCheckCircle className="text-green-500 text-7xl mx-auto mb-4" />
        <h1 className="text-4xl font-bold text-white">Booking Confirmed! 🎉</h1>
        <p className="text-gray-400 mt-2 text-sm">Your cricket training journey begins soon!</p>
      </div>

      <div className="max-w-4xl mx-auto mt-10 bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-8">
        <h2 className="text-xl font-bold mb-6 text-white">Booking Details</h2>
        <div className="grid md:grid-cols-2 gap-6 text-sm">
          {[
            {
              label: "Student Name",
              value: booking?.userId?.name || "—"
            },
            {
              label: "Booking ID",
              value: `booking-${id}`
            },
            {
              label: "Invoice No",
              value: invoiceNo
            },
            {
              label: "Program",
              value: program
            },
            {
              label: "Training Starts",
              value: "2026-04-01"
            },
          ].map(({ label, value }) => (
            <div key={label}>
              <p className="text-gray-400 text-xs uppercase tracking-widest mb-1">{label}</p>
              <p className="font-semibold text-white">{value}</p>
            </div>
          ))}
        </div>
        <hr className="my-6 border-white/10" />
        <div className="space-y-2 text-sm">
          {[
            {
              label: "Monthly Fee",
              value: `₹${programFee}`
            },
            {
              label: "Registration Fee",
              value: `₹${registration}`
            },
            {
              label: "GST (18%)",
              value: `₹${gst}`
            },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-gray-400">
              <span>{label}</span><span>{value}</span>
            </div>
          ))}
          <div className="flex justify-between text-lg font-bold text-white pt-2 border-t border-white/10">
            <span>Total Paid</span>
            <span className="text-green-400">₹{total}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto grid md:grid-cols-2 gap-4 mt-6">
        <button onClick={downloadInvoice}
          className="bg-white/5 border border-white/10 hover:bg-white/10 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer flex items-center justify-center gap-2">
          📄 Download Invoice (PDF)
        </button>
        <button onClick={() => navigate("/user/dashboard")}
          className="w-full bg-green-500 hover:bg-green-400 py-3 rounded-xl font-bold text-white transition-all cursor-pointer">
          Go to Dashboard
        </button>
      </div>

      <div className="max-w-4xl mx-auto mt-8 bg-green-900/20 border border-green-500/20 p-6 rounded-2xl">
        <h3 className="font-bold mb-4 text-white">What's Next?</h3>
        <div className="space-y-3 text-sm">
          {[
            "Check your email for booking confirmation and details",
            "Mark your calendar for the training start date",
            "Visit your dashboard to track attendance and progress",
          ].map((item) => (
            <div key={item} className="bg-white/5 border border-white/5 p-3 rounded-xl text-gray-300">{item}</div>
          ))}
        </div>
      </div>

      <div className="text-center mt-8 text-sm text-gray-500">
        <p>A confirmation email with your booking details has been sent.</p>
        <Link to="/" className="text-green-400 block mt-2 hover:text-green-300">← Back to Home</Link>
      </div>
    </div>
  );
}

export default Confirmation;

