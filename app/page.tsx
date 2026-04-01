"use client";

import { getflight, gethotel } from "@/lib/api";
import Loader from "@/components/Loader";
import { SearchSelect } from "@/components/SearchSelect";
import { Button } from "@/components/ui/button";

import {
  Bus,
  Calendar,
  Car,
  CreditCard,
  HomeIcon,
  Hotel,
  MapPin,
  Plane,
  QrCode,
  Shield,
  Train,
  Umbrella,
  Users,
} from "lucide-react";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";

export default function Home() {
  const [bookingtype, setbookingtype] = useState("flights");
  const [from, setfrom] = useState("");
  const [to, setto] = useState("");
  const [date, setdate] = useState("");
  const [travelers, settravelers] = useState(1);

  const [searchresults, setsearchresult] = useState<any[]>([]);
  const [hotel, sethotel] = useState<any[]>([]);
  const [flight, setflight] = useState<any[]>([]);
  const [loading, setloading] = useState(true);

  const user = useSelector((state: any) => state.user.user);
  const router = useRouter();
  
  


  /* ADD THIS BELOW */

  const offers = [
    {
      title: "Domestic Flights",
      description: "Get up to 20% off on domestic flights",
      imageUrl:
        "https://images.unsplash.com/photo-1436491865332-7a61a109cc05",
    },
    {
      title: "International Hotels",
      description: "Book luxury hotels worldwide",
      imageUrl:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945",
    },
    {
      title: "Holiday Packages",
      description: "Exclusive deals on holiday packages",
      imageUrl:
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e",
    },
  ];
  const collections = [
    {
      title: "Stays in & Around Delhi",
      imageUrl:
        "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Mumbai",
      imageUrl:
        "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800",
      tag: "TOP 8",
    },
    {
      title: "Stays in & Around Bangalore",
      imageUrl:
        "https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=800",
      tag: "TOP 9",
    },
    {
      title: "Beach Destinations",
      imageUrl:
        "https://images.unsplash.com/photo-1520454974749-611b7248ffdb?auto=format&fit=crop&w=800",
      tag: "TOP 11",
    },
  ];


  const wonders = [
    {
      title: "Shimla's Best Kept Secret",
      imageUrl:
        "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=800",
    },
    {
      title: "Tamil Nadu's Charming Hill Town",
      imageUrl:
        "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=800",
    },
    {
      title: "Quaint Little Hill Station in Gujarat",
      imageUrl:
        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800",
    },
    {
      title: "A pleasant summer retreat",
      imageUrl:
        "https://images.unsplash.com/photo-1593181629936-11c609b8db9b?auto=format&fit=crop&w=800",
    },
  ];

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const data = await gethotel();
        const flightdata = await getflight();

        sethotel(data);
        setflight(flightdata);
      } catch (error) {
        console.error(error);
      } finally {
        setloading(false);
      }
    };

    fetchdata();
  }, [user]);

  const cityOptions = useMemo(() => {
    const cities = new Set<string>();

    flight.forEach((f) => {
      if (f.from) cities.add(f.from);
      if (f.to) cities.add(f.to);
    });

    hotel.forEach((h) => {
      if (h.location) cities.add(h.location);
    });

    return Array.from(cities).map((city) => ({
      value: city,
      label: city,
    }));
  }, [flight, hotel]);

  if (loading) return <Loader />;

  const handlesearch = () => {
  console.log("Flights:", flight);

  if (bookingtype === "flights") {
    const results = flight.filter(
      (f) =>
        f.from?.toLowerCase() === from.toLowerCase() &&
        f.to?.toLowerCase() === to.toLowerCase()
    );

    console.log("Search Results:", results); // ADD THIS
    setsearchresult(results);
  } else {
    const results = hotel.filter(
      (h) => h.location?.toLowerCase() === to.toLowerCase()
    );

    console.log("Search Results:", results); // ADD THIS
    setsearchresult(results);
  }
};
  

  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };

    const date = new Date(dateString);
    return date.toLocaleString("en-US", options);
  };

  const handlebooknow = (id: string) => {
  console.log("Selected ID:", id);

  if (!id) {
    alert("ID not found");
    return;
  }

  if (bookingtype === "flights") {
    router.push(`/book-flight/${id}`);
  } else {
    router.push(`/book-hotel/${id}`);
  }
};
  const DownloadApp = () => {
    return (
      <div className="bg-white p-6 rounded-lg shadow-md max-w-6xl mx-auto my-16">
        <div className="flex flex-col md:flex-row items-center justify-between">

          <div>
            <h3 className="text-xl font-bold mb-2">
              Download App Now!
            </h3>

            <p className="text-gray-600 mb-4">
              Get India's #1 travel app with best deals
            </p>

            <div className="flex space-x-4">
              <img
                src="https://upload.wikimedia.org/wikipedia/commons/3/3c/Download_on_the_App_Store_Badge.svg"
                className="h-10"
              />

              <img
                src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
                className="h-10"
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <QrCode className="w-24 h-24" />
            <p className="text-sm text-gray-600">
              Scan QR to download
            </p>
          </div>

        </div>
      </div>
    );
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://images.unsplash.com/photo-1464037866556-6812c9d1c72e")',
      }}
    >
      <main className="container mx-auto px-4 py-6">

        {/* Navigation */}
        <nav className="bg-white rounded-xl shadow-lg max-w-5xl mx-auto mb-6 p-4">
          <div className="flex justify-between items-center">

            <NavItem
              icon={<Plane />}
              text="Flights"
              active={bookingtype === "flights"}
              onClick={() => setbookingtype("flights")}
            />

            <NavItem
              icon={<Hotel />}
              text="Hotels"
              active={bookingtype === "hotels"}
              onClick={() => setbookingtype("hotels")}
            />

            <NavItem icon={<HomeIcon />} text="Homestays" />
            <NavItem icon={<Umbrella />} text="Holiday" />
            <NavItem icon={<Train />} text="Trains" />
            <NavItem icon={<Bus />} text="Buses" />
            <NavItem icon={<Car />} text="Cabs" />
            <NavItem icon={<CreditCard />} text="Forex" />
            <NavItem icon={<Shield />} text="Insurance" />

          </div>
        </nav>

        {/* Search Box */}

        <div className="bg-white rounded-xl shadow-lg max-w-5xl mx-auto p-6">

          <div className="grid md:grid-cols-5 gap-4">

            {bookingtype === "flights" && (
              <SearchSelect
                options={cityOptions}
                placeholder="From"
                value={from}
                onChange={setfrom}
                icon={<MapPin />}
                subtitle="Enter city"
              />
            )}

            <SearchSelect
              options={cityOptions}
              placeholder={bookingtype === "flights" ? "To" : "City"}
              value={to}
              onChange={setto}
              icon={<MapPin />}
              subtitle="Enter city"
            />

            <SearchInput
              icon={<Calendar />}
              placeholder="Date"
              value={date}
              onChange={(e: any) => setdate(e.target.value)}
              subtitle="Select date"
              type="date"
            />

            <SearchInput
              icon={<Users />}
              placeholder="Travelers"
              value={travelers}
              onChange={(e: any) => settravelers(e.target.value)}
              subtitle="Number"
              type="number"
            />

            <Button onClick={handlesearch}>SEARCH</Button>

          </div>

        </div>

        {/* Results */}

        <div className="mt-10 grid md:grid-cols-3 gap-6">

          {searchresults.map((result, index) => (

            <div
              key={result._id || result.id || index}
              className="bg-white rounded-lg shadow p-4"
            >

              {bookingtype === "flights" ? (

                <>
                  <h3 className="font-bold">
                    {result.flightName}
                  </h3>

                  <p>
                    {result.from} → {result.to}
                  </p>

                  <p>
                    Departure: {formatDate(result.departureTime)}
                  </p>

                  <p>
                    Arrival: {formatDate(result.arrivalTime)}
                  </p>

                  <p className="font-bold">
                    ₹{result.price}
                  </p>
                </>

              ) : (

                <>
                  <h3 className="font-bold">
                    {result.hotelName}
                  </h3>

                  <p>{result.location}</p>

                  <p className="font-bold">
                    ₹{result.pricePerNight}
                  </p>
                </>

              )}


              
             <Button 
             className="mt-3 w-full"
             onClick={() => handlebooknow(result._id || result.id)}>
                Book Now
              </Button>
            </div>

          ))}

        </div>

      </main>
      {/* Offers Section */}

      <div className="max-w-6xl mx-auto mt-16 px-4">

        <h2 className="text-2xl font-bold mb-6 text-white">
          Best Offers
        </h2>

        <div className="grid md:grid-cols-3 gap-6">

          {offers.map((offer, index) => (
            <OfferCard key={index} {...offer} />
          ))}

        </div>

      </div>

      {/* Collections Section */}

      <section className="my-16 max-w-6xl mx-auto px-4">

        <h2 className="text-2xl font-bold mb-8 text-white">
          Handpicked Collections for You
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {collections.map((collection, index) => (
            <CollectionCard key={index} {...collection} />
          ))}

        </div>

      </section>


      {/* Wonders Section */}

      <section className="my-16 max-w-6xl mx-auto px-4">

        <h2 className="text-2xl font-bold mb-8 text-white">
          Unlock Lesser-Known Wonders
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          {wonders.map((wonder, index) => (
            <WonderCard key={index} {...wonder} />
          ))}

        </div>

      </section>
      {/* Download App Section */}


      <DownloadApp />
    </div>
  );
}

function NavItem({ icon, text, active = false, onClick }: any) {
  return (
    <button
      className={`flex flex-col items-center ${active ? "text-blue-500" : "text-gray-600"
        }`}
      onClick={onClick}
    >
      {icon}
      <span className="text-sm">{text}</span>
    </button>
  );
}

function SearchInput({ icon, placeholder, value, onChange, subtitle, type }: any) {
  return (
    <div className="border rounded-lg p-3">
      <div className="flex items-center gap-2">
        {icon}
        <div className="flex-1">
          <div className="text-sm text-gray-500">{placeholder}</div>
          <input
            type={type}
            value={value}
            onChange={onChange}
            className="w-full outline-none"
          />
          <div className="text-xs text-gray-400">{subtitle}</div>
        </div>
      </div>
    </div>
  );
}
const OfferCard = ({ title, description, imageUrl }: any) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">

      <img
        src={imageUrl}
        alt={title}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">

        <h3 className="font-semibold text-lg">
          {title}
        </h3>

        <p className="text-gray-600 text-sm">
          {description}
        </p>

        <button className="mt-4 px-4 py-2 bg-blue-600 text-white rounded">
          Book Now
        </button>

      </div>

    </div>
  );
};
const CollectionCard = ({ title, imageUrl, tag }: any) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">

      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">

        <div className="absolute top-4 left-4">
          <span className="bg-white text-black text-sm font-semibold px-2 py-1 rounded">
            {tag}
          </span>
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">
            {title}
          </h3>
        </div>

      </div>

    </div>
  );
};
const WonderCard = ({ title, imageUrl }: any) => {
  return (
    <div className="relative group cursor-pointer overflow-hidden rounded-lg">

      <img
        src={imageUrl}
        alt={title}
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/70">

        <div className="absolute bottom-4 left-4 right-4">
          <h3 className="text-white text-lg font-semibold">
            {title}
          </h3>
        </div>

      </div>

    </div>
  );
};