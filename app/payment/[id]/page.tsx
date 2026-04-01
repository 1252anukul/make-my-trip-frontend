"use client";

import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { getflight, handleflightbooking } from "@/lib/api";
import { useSelector, useDispatch } from "react-redux";
import { setUser } from "@/lib/userSlice";

export default function PaymentPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const quantity = Number(searchParams.get("qty")) || 1;

  const [flight, setFlight] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();
  const router = useRouter();

  // ✅ Load user from localStorage (IMPORTANT)
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser && !user) {
      dispatch(setUser(JSON.parse(storedUser)));
    }
  }, []);

  // ✅ Fetch flight
  useEffect(() => {
    const fetchFlight = async () => {
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

    fetchFlight();
  }, [id]);

  // ✅ Loading state
  if (loading) return <div className="p-10">Loading...</div>;

  // ❌ Flight not found
  if (!flight) return <div className="p-10">Flight not found</div>;

  // ❌ User not logged in
  if (!user) {
    return (
      <div className="p-10 text-center">
        <h2 className="text-xl font-bold">Please login first</h2>
        <button
          onClick={() => router.push("/")}
          className="mt-4 bg-red-600 text-white px-4 py-2 rounded"
        >
          Go to Home
        </button>
      </div>
    );
  }

  // 💰 Price calculation
  const baseFare = flight.price * quantity;
  const taxes = 1374;
  const other = 249;
  const discount = 1000;

  const total = baseFare + taxes + other - discount;

  // ✅ PAYMENT FUNCTION
  const handlePayment = async () => {
    try {
     const userId = user?._id ?? user?.id;
const flightId = flight?._id ?? flight?.id;

const data = await handleflightbooking(
  userId,
  flightId,
  quantity,
  total
);

      // ✅ Update Redux
      const updatedUser = {
        ...user,
        bookings: [...(user?.bookings || []), data],
      };

      dispatch(setUser(updatedUser));
      localStorage.setItem("user", JSON.stringify(updatedUser));

      alert("Payment Successful ✅");
      router.push("/profile");
    } catch (error) {
      console.error("Payment Error:", error);
      alert("Payment Failed ❌");
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">

      {/* ✈️ FLIGHT DETAILS */}
      <div className="grid grid-cols-2 gap-4 bg-white p-6 rounded-xl shadow mb-6">

        <input value={flight.flightName} readOnly className="border p-2 rounded" />
        <input value={flight.from} readOnly className="border p-2 rounded" />

        <input value={flight.to} readOnly className="border p-2 rounded" />
        <input value={new Date(flight.departureTime).toLocaleString()} readOnly className="border p-2 rounded" />

        <input value={new Date(flight.arrivalTime).toLocaleString()} readOnly className="border p-2 rounded" />
        <input value={quantity} readOnly className="border p-2 rounded" />

      </div>

      {/* 💳 FARE SUMMARY */}
      <div className="bg-gray-100 p-6 rounded-xl">

        <h2 className="text-xl font-bold mb-4">Fare Summary</h2>

        <div className="flex justify-between">
          <span>Base Fare</span>
          <span>₹ {baseFare}</span>
        </div>

        <div className="flex justify-between">
          <span>Taxes & Surcharges</span>
          <span>₹ {taxes}</span>
        </div>

        <div className="flex justify-between">
          <span>Other Services</span>
          <span>₹ {other}</span>
        </div>

        <div className="flex justify-between text-green-600">
          <span>Discount</span>
          <span>- ₹ {discount}</span>
        </div>

        <div className="border-t mt-3 pt-3 flex justify-between font-bold text-lg">
          <span>Total Amount</span>
          <span>₹ {total}</span>
        </div>

        <button
          onClick={handlePayment}
          className="w-full mt-4 bg-red-600 text-white py-3 rounded hover:bg-red-700"
        >
          Proceed to Payment
        </button>

      </div>

    </div>
  );
}