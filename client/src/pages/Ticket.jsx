

import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { QRCodeCanvas } from 'qrcode.react';
import {
    FaTicketAlt,
    FaCalendarAlt,
    FaMapMarkerAlt,
    FaUser,
    FaMoneyBillWave
} from 'react-icons/fa';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

const Ticket = () => {
    const { state } = useLocation();
    const navigate = useNavigate();
    const booking = state?.booking;

    const handleDownload = async () => {
        const ticket = document.getElementById('ticket');
        if (!ticket) return;

        const canvas = await html2canvas(ticket, {
            scale: 2,
            useCORS: true,
            ignoreElements: (element) => {
                return element.tagName === 'BUTTON';
            }
        });

        const imgData = canvas.toDataURL('image/png');

        const pdf = new jsPDF('p', 'mm', 'a4');

        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Eventora-Ticket-${booking._id}.pdf`);
    };

    if (!booking) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black text-white">
                <button
                    onClick={() => navigate('/')}
                    className="bg-white text-black px-6 py-2 rounded-full font-bold"
                >
                    Go Home
                </button>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-gray-900 to-black p-6">

            {/* BACKGROUND GLOW */}
            <div className="absolute w-96 h-96 bg-purple-500 blur-[120px] opacity-20 rounded-full top-10 left-10"></div>
            <div className="absolute w-96 h-96 bg-cyan-500 blur-[120px] opacity-20 rounded-full bottom-10 right-10"></div>

            {/* TICKET */}
            <div
                id="ticket"
                className="relative w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-gray-700"
            >

                {/* TOP STRIP */}
                <div className="h-2 bg-gradient-to-r from-purple-500 via-pink-500 to-cyan-500"></div>

                {/* HEADER */}
                <div className="bg-gradient-to-b from-black to-gray-900 text-center py-6 text-white">
                    <FaTicketAlt className="mx-auto text-5xl text-cyan-400 mb-2" />
                    <h1 className="text-2xl font-extrabold tracking-widest">
                        EVENT PASS
                    </h1>
                    <p className="text-xs text-gray-400 tracking-[4px]">
                        PREMIUM ENTRY TICKET
                    </p>
                </div>

                {/* BODY */}
                <div className="bg-white p-6">

                    {/* TITLE */}
                    <h2 className="text-2xl font-black text-center text-gray-900">
                        {booking.eventId?.title}
                    </h2>

                    <p className="text-center text-sm text-gray-500 mb-6">
                        {booking.eventId?.category}
                    </p>

                    {/* DETAILS CARD */}
                    <div className="bg-gray-50 rounded-2xl p-4 space-y-4 border">

                        <div className="flex items-center gap-3">
                            <FaCalendarAlt className="text-purple-500" />
                            <span>{booking.eventId?.date ? new Date(booking.eventId.date).toDateString() : ''}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <FaMapMarkerAlt className="text-red-500" />
                            <span>{booking.eventId?.location}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <FaUser className="text-green-500" />
                            <span>{booking.userId?.name || 'Guest'}</span>
                        </div>

                        <div className="flex items-center gap-3">
                            <FaMoneyBillWave className="text-yellow-500" />
                            <span className="font-bold">
                                {booking.amount === 0 ? 'FREE ENTRY' : `₹${booking.amount}`}
                            </span>
                        </div>

                    </div>

                    {/* QR SECTION */}
                    <div className="mt-6 flex flex-col items-center bg-white border-2 border-dashed rounded-2xl p-5">

                        <QRCodeCanvas value={booking._id} size={140} />

                        <p className="text-xs text-gray-400 mt-2 tracking-wide">
                            Scan for verification
                        </p>
                    </div>

                    {/* DOWNLOAD BUTTON */}
                    <button
                        onClick={handleDownload}
                        className="w-full mt-6 bg-gradient-to-r from-purple-600 via-pink-600 to-cyan-600 text-white py-3 rounded-xl font-bold shadow-lg hover:scale-[1.02] transition"
                    >
                        Download Ticket PDF
                    </button>

                </div>

                {/* FOOTER */}
                <div className="bg-black text-center text-gray-400 text-xs py-3">
                    Ticket ID: {booking._id}
                </div>

            </div>
        </div>
    );
};

export default Ticket;