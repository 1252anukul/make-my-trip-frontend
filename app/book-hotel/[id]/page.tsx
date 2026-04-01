"use client";

import { useParams, useRouter } from "next/navigation";
import {
  Star,
  MapPin,
  School as Pool,
  UtensilsCrossed,
  Wine,
  Power,
  ChevronRight,
  Camera,
  Image,
  CreditCard,
  Ticket,
  Home,
} from "lucide-react";

import { useEffect, useState } from "react";
import { gethotel, handlehotelbooking } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useDispatch, useSelector } from "react-redux";
import SignupDialog from "@/components/SignupDialog";
import Loader from "@/components/Loader";
import { setUser } from "@/lib/userSlice";


interface Hotel {
  _id: string;
  hotelName: string;
  location: string;
  pricePerNight: number;
  availableRooms: number;
  amenities: string;
}

const BookHotelPage = () => {
const params = useParams();
const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const router = useRouter();

  const [hotel, setHotel] = useState<Hotel | null>(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [open, setOpen] = useState(false);

  const user = useSelector((state: any) => state.user.user);
  const dispatch = useDispatch();

useEffect(() => {
  if (!id) return;

  const fetchHotels = async () => {
    try {
      const data = await gethotel();

      console.log("URL ID:", id);
      console.log("DATA:", data);

      const selected = data.find((h: any) => {
        const hotelId = h._id || h.id;
        return String(hotelId) === String(id);
      });

      console.log("SELECTED:", selected);

      setHotel(selected);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchHotels();
}, [id]);

  if (loading) return <Loader />;
  if (!hotel) return <div>Hotel not found</div>; // ✅ SAFE CHECK

  const totalPrice = hotel.pricePerNight * quantity;
  const totalTaxes = 500 * quantity;
  const grandTotal = totalPrice + totalTaxes;

  const handleQuantityChange = (e: any) => {
    const value = parseInt(e.target.value);
    setQuantity(
      isNaN(value)
        ? 1
        : Math.max(1, Math.min(value, hotel.availableRooms))
    );
  };

  const handleBooking = async () => {
    try {
      const data = await handlehotelbooking(
        user?.id,
        hotel._id,
        quantity,
        grandTotal
      );

      dispatch(setUser({ ...user, bookings: [...user.bookings, data] }));

      setOpen(false);
      router.push("/profile");
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-2 text-sm">
          <span className="text-blue-500">Home</span>
          <ChevronRight className="w-4 h-4" />
          <span>{hotel.location}</span>
          <ChevronRight className="w-4 h-4" />
          <span>{hotel.hotelName}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6 grid lg:grid-cols-3 gap-6">

        {/* LEFT */}
        <div className="lg:col-span-2 space-y-6">

          <h1 className="text-2xl font-bold">{hotel.hotelName}</h1>

          {/* Images */}
          <div className="grid grid-cols-3 gap-4">
            <img
              src="https://images.unsplash.com/photo-1566073771259-6a8506099945"
              className="col-span-2 h-80 object-cover rounded-lg"
            />
            <div className="flex flex-col gap-4">
              <img
                src="https://images.unsplash.com/photo-1582719478250-c89cae4dc85b"
                className="h-36 object-cover rounded-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1587474260584-136574528ed5"
                className="h-36 object-cover rounded-lg"
              />
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600">
            Premium hotel experience with best amenities.
          </p>

          {/* Amenities */}
          <div>
            <h2 className="font-semibold text-lg mb-2">Amenities</h2>
            <p className="text-gray-500">{hotel.amenities}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="bg-white shadow-lg rounded-xl p-6 sticky top-20">

          <h2 className="text-lg font-bold mb-2">Standard Room</h2>

          <p className="text-gray-500 mb-4">Fits 2 Adults</p>

          <div className="mb-4">
            <p className="text-gray-500">Price Per Night</p>
            <p className="text-2xl font-bold">₹ {hotel.pricePerNight}</p>
          </div>

          <div className="mb-4">
            <Label>Rooms</Label>
            <Input
              type="number"
              value={quantity}
              onChange={handleQuantityChange}
              min={1}
              max={hotel.availableRooms}
            />
          </div>

          <div className="mb-4 text-sm text-gray-600">
            Available Rooms: {hotel.availableRooms}
          </div>

          <div className="mb-6 font-bold">
            Total: ₹ {grandTotal}
          </div>

          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="w-full bg-blue-600 text-white">
                BOOK THIS NOW
              </Button>
            </DialogTrigger>

            {user ? (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Confirm Booking</DialogTitle>
                </DialogHeader>

                <Button onClick={handleBooking}>
                  Confirm Booking
                </Button>
              </DialogContent>
            ) : (
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Login Required</DialogTitle>
                </DialogHeader>
                <SignupDialog
                  
                />
              </DialogContent>
            )}
          </Dialog>

        </div>
      </div>
    </div>
  );
};

export default BookHotelPage;