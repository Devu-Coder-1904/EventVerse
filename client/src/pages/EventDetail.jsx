import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { AuthContext } from "../context/AuthContext";
import {
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChair,
  FaMoneyBillWave,
} from "react-icons/fa";
import { toast } from "react-toastify";
import LoadingSpinner from "../components/LoadingSpinner";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingLoading, setBookingLoading] = useState(false);

  const [showOTP, setShowOTP] = useState(false);
  const [otp, setOtp] = useState("");

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const { data } = await api.get(`/event/${id}`);
        setEvent(data);
      } catch (err) {
        toast.error("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleBooking = async () => {
    if (!user) {
      toast.info("Please login first.");
      navigate("/login");
      return;
    }

    setBookingLoading(true);

    try {
      // STEP 1 → Send OTP
      if (!showOTP) {
        await api.post("/booking/send-otp");

        toast.success("OTP sent to your email.");
        setShowOTP(true);
      }

      // STEP 2 → Verify OTP & Book Ticket
      else {
        const { data } = await api.post("/booking", {
          eventId: event._id,
          otp,
        });

        toast.success("Booking Successful!");

        // Update Seats Instantly
        setEvent((prev) => ({
          ...prev,
          availableSeats: prev.availableSeats - 1,
        }));

        navigate("/ticket", {
          state: {
            booking: data,
          },
        });
      }
    } catch (err) {
      toast.error(
        err.response?.data?.message || "Booking Failed!"
      );
    } finally {
      setBookingLoading(false);
    }
  };

    if (loading) return <LoadingSpinner />;

  if (!event) {
    return (
      <div className="text-center py-20 text-red-500 text-xl font-bold">
        Event not found
      </div>
    );
  }

  const isSoldOut = event.availableSeats <= 0;

  return (
    <div className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl shadow-2xl overflow-hidden">

      {/* Event Image */}
      {event.imageUrl ? (
        <div className="overflow-hidden">
          <img
            src={event.imageUrl}
            alt={event.title}
            className="w-full h-80 object-cover transition duration-700 hover:scale-110"
          />
        </div>
      ) : (
        <div className="w-full h-80 bg-gray-900 flex items-center justify-center text-white text-5xl font-black uppercase">
          {event.category}
        </div>
      )}

      <div className="p-8 md:p-12">
        <div className="flex flex-col lg:flex-row gap-10">

          {/* LEFT SIDE */}
          <div className="flex-1">

            <div className="inline-block bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider shadow-md mb-5">
              {event.category}
            </div>

            <h1 className="text-4xl font-extrabold text-gray-900 mb-5">
              {event.title}
            </h1>

            <p className="text-gray-600 text-lg leading-8">
              {event.description}
            </p>

          </div>

          {/* RIGHT CARD */}
          <div className="lg:w-[360px] bg-gray-50 rounded-2xl p-7 shadow-lg border">

            <h2 className="text-2xl font-bold mb-7">
              Booking Details
            </h2>

            {/* Ticket Price */}
            <div className="flex items-center gap-4 mb-6">

              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <FaMoneyBillWave />
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Ticket Price
                </p>

                <p className="font-bold text-xl">
                  {event.ticketPrice === 0 ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full">
                      🎉 FREE EVENT
                    </span>
                  ) : (
                    `₹${event.ticketPrice}`
                  )}
                </p>
              </div>

            </div>

            {/* Seats */}
            <div className="flex items-center gap-4 mb-3">

              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <FaChair />
              </div>

              <div>

                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Availability
                </p>

                <p className="font-bold">
                  <span
                    className={
                      event.availableSeats < 10
                        ? "text-red-500"
                        : "text-green-600"
                    }
                  >
                    {event.availableSeats}
                  </span>{" "}
                  / {event.totalSeats}
                </p>

              </div>

            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden mb-2">

              <div
                className={`h-3 rounded-full transition-all duration-700 ${
                  event.availableSeats < 10
                    ? "bg-red-500"
                    : "bg-green-500"
                }`}
                style={{
                  width: `${(event.availableSeats / event.totalSeats) * 100}%`,
                }}
              />

            </div>

            {event.availableSeats > 0 &&
              event.availableSeats < 10 && (
                <p className="text-red-500 text-sm font-semibold mb-6">
                  ⚠️ Hurry! Only {event.availableSeats} seats left.
                </p>
            )}

            {/* Date */}
            <div className="flex items-center gap-4 mb-6">

              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <FaCalendarAlt />
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Date
                </p>

                <p className="font-bold">
                  {new Date(event.date).toLocaleDateString()}
                </p>
              </div>

            </div>

            {/* Location */}
            <div className="flex items-center gap-4 mb-7">

              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <FaMapMarkerAlt />
              </div>

              <div>
                <p className="text-xs uppercase text-gray-500 font-semibold">
                  Location
                </p>

                <p className="font-bold">
                  {event.location}
                </p>
              </div>

            </div>

            {/* OTP */}
            {showOTP && (
              <div className="mb-6">

                <label className="block mb-2 font-semibold">
                  Enter OTP
                </label>

                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  maxLength="6"
                  placeholder="Enter OTP"
                  className="w-full px-5 py-4 border-2 rounded-xl text-center tracking-[8px] text-xl font-bold focus:outline-none focus:ring-2 focus:ring-black"
                />

              </div>
            )}

            {/* Button */}
            <button
              onClick={handleBooking}
              disabled={
                isSoldOut ||
                bookingLoading ||
                (showOTP && !otp)
              }
              className={`w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
                isSoldOut || bookingLoading
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-gray-900 to-black text-white hover:scale-105 hover:shadow-xl"
              }`}
            >
              {bookingLoading
                ? "Processing..."
                : showOTP
                ? "Verify OTP & Confirm"
                : isSoldOut
                ? "Sold Out"
                : "Confirm Registration"}
            </button>

                      </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail;
