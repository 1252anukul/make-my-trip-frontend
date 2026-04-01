"use client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { getflight, handleflightbooking } from "@/lib/api";
import { useDispatch, useSelector } from "react-redux";
import { setUser } from "@/lib/userSlice";

import Loader from "@/components/Loader";
import SignupDialog from "@/components/SignupDialog";

import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import {
    Plane,
    Luggage,
    Clock,
    Calendar,
    MapPin,
    Gift,
    CreditCard,
    AlertCircle,
    Star,
    Info,
    ArrowRight,
    Ticket,
} from "lucide-react";

interface Flight {
    id: string;
    flightName: string;
    from: string;
    to: string;
    departureTime: string;
    arrivalTime: string;
    price: number;
    availableSeats: number;
}

export default function BookFlightPage() {
    const router = useRouter();
    const { id } = useParams();

    const [flight, setFlight] = useState<Flight | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [open, setOpen] = useState(false);

    const user = useSelector((state: any) => state.user.user);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchFlights = async () => {
            try {
                const data = await getflight();

                const selected = data.find(
                    (f: any) => f._id === id || f.id === id
                );

                setFlight(selected);
            } catch (error) {
                console.error("Error fetching flight:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchFlights();
    }, [id]);

    if (loading) return <Loader />;
    if (!flight) return <div className="p-10">Flight not found</div>;

    const formatDate = (date: string) =>
        new Date(date).toLocaleString("en-US", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });

    const handleQuantityChange = (e: any) => {
        const value = parseInt(e.target.value);

        setQuantity(
            isNaN(value)
                ? 1
                : Math.max(1, Math.min(value, flight.availableSeats))
        );
    };

    const totalPrice = flight.price * quantity;
    const taxes = 500 * quantity;
    const grandTotal = totalPrice + taxes;

    const handleBooking = async () => {
        try {
            const data = await handleflightbooking(
                user?.id,
                flight.id,
                quantity,
                grandTotal
            );

            const updatedUser = {
                ...user,
                bookings: [...user.bookings, data],
            };

            dispatch(setUser(updatedUser));

            setOpen(false);
            router.push("/profile");
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100">

            <div className="lg:col-span-2 space-y-6">

                {/* ✈️ Flight Card */}
                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex justify-between mb-4">

                        <div>
                            <h2 className="text-lg font-bold flex items-center">
                                {flight.from}
                                <ArrowRight className="mx-2" />
                                {flight.to}
                            </h2>

                            <p className="text-gray-500 text-sm flex items-center mt-1">
                                <Calendar className="w-4 h-4 mr-2" />
                                {formatDate(flight.departureTime)}
                                <span className="mx-2">•</span>
                                Non Stop
                            </p>
                        </div>

                        <span className="text-blue-600 text-sm cursor-pointer">
                            View Fare Rules
                        </span>

                    </div>

                    {/* Airline */}
                    <div className="flex items-center gap-4 mb-6">
                        <div className="bg-blue-100 p-3 rounded-full">
                            <Plane className="text-blue-600" />
                        </div>

                        <div>
                            <p className="font-semibold">{flight.flightName}</p>
                            <p className="text-sm text-gray-500">Economy</p>
                        </div>
                    </div>

                    {/* Timeline */}
                    <div className="flex justify-between items-center border-t pt-4">

                        <div>
                            <p className="text-xl font-bold">
                                {formatDate(flight.departureTime)}
                            </p>
                            <p className="text-gray-500 text-sm">{flight.from}</p>
                        </div>

                        <div className="text-center">
                            <Plane />
                            <p className="text-xs text-gray-500">Non Stop</p>
                        </div>

                        <div>
                            <p className="text-xl font-bold">
                                {formatDate(flight.arrivalTime)}
                            </p>
                            <p className="text-gray-500 text-sm">{flight.to}</p>
                        </div>

                    </div>

                </div>
                {/* 🧳 Baggage Info */}
                <div className="bg-white rounded-xl shadow p-6 flex gap-6 text-sm text-gray-600">

                    <div className="flex items-center">
                        <Luggage className="mr-2" />
                        Cabin: 7kg
                    </div>

                    <div className="flex items-center">
                        <Luggage className="mr-2" />
                        Check-in: 15kg
                    </div>

                </div>

                {/* ⚠️ Cancellation */}
                <div className="bg-white rounded-xl shadow p-6">

                    <div className="flex justify-between mb-4">
                        <h2 className="font-bold flex items-center">
                            <AlertCircle className="mr-2 text-orange-500" />
                            Cancellation Policy
                        </h2>

                        <span className="text-blue-600 text-sm">View Policy</span>
                    </div>

                    <div className="h-2 bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 rounded"></div>

                </div>

                {/* Fare Summary */}

                <div className="bg-white rounded-xl shadow p-6 h-fit">

                    <h2 className="font-bold text-lg mb-4 flex items-center">
                        <CreditCard className="mr-2" />
                        Fare Summary
                    </h2>

                    <div className="flex justify-between mb-2">
                        <span>Base Fare</span>
                        <span>₹{totalPrice}</span>
                    </div>

                    <div className="flex justify-between mb-2">
                        <span>Taxes</span>
                        <span>₹{taxes}</span>
                    </div>

                    <div className="border-t pt-3 flex justify-between font-bold">
                        <span>Total</span>
                        <span>₹{grandTotal}</span>
                    </div>

                    <div className="mt-4">

                        <input
                            type="number"
                            value={quantity}
                            onChange={handleQuantityChange}
                            className="border p-2 w-full rounded"
                            min="1"
                            max={flight.availableSeats}
                        />

                    </div>

                       
{user ? (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full mt-4 bg-red-600">
        Book Now
      </Button>
    </DialogTrigger>

    <DialogContent className="max-w-lg">

      <DialogHeader>
        <DialogTitle>Review Your Booking</DialogTitle>
      </DialogHeader>

      {/* ✈️ DETAILS */}
      <div className="grid grid-cols-2 gap-3 text-sm">

        <input value={flight.flightName} readOnly className="border p-2 rounded" />
        <input value={flight.from} readOnly className="border p-2 rounded" />

        <input value={flight.to} readOnly className="border p-2 rounded" />
        <input value={formatDate(flight.departureTime)} readOnly className="border p-2 rounded" />

        <input value={formatDate(flight.arrivalTime)} readOnly className="border p-2 rounded" />
        <input value={quantity} readOnly className="border p-2 rounded" />

      </div>

      {/* 💳 FARE SUMMARY */}
      <div className="bg-gray-100 p-4 rounded mt-4">

        <h3 className="font-bold mb-2">Fare Summary</h3>

        <div className="flex justify-between">
          <span>Base Fare</span>
          <span>₹{totalPrice}</span>
        </div>

        <div className="flex justify-between">
          <span>Taxes</span>
          <span>₹{taxes}</span>
        </div>

        <div className="border-t mt-2 pt-2 flex justify-between font-bold">
          <span>Total</span>
          <span>₹{grandTotal}</span>
        </div>

      </div>

      {/* 🚀 BUTTON */}
      <Button
        className="w-full mt-4 bg-red-600"
        onClick={() =>
          router.push(`/payment/${flight.id}?qty=${quantity}`)
        }
      >
        Proceed to Pay
      </Button>

    </DialogContent>
  </Dialog>
) : (
  <Dialog>
    <DialogTrigger asChild>
      <Button className="w-full mt-4 bg-red-600">
        Book Now
      </Button>
    </DialogTrigger>

    <DialogContent>
      <DialogHeader>
        <DialogTitle>Login Required</DialogTitle>
      </DialogHeader>

      <SignupDialog />
    </DialogContent>
  </Dialog>
)}

                </div>

            </div>

        </div>
    );
}