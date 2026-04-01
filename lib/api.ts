const BASE_URL = process.env.NEXT_PUBLIC_API_URL!;



// ✅ LOGIN
export const login = async (email: string, password: string) => {
  const res = await fetch(`${BASE_URL}/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Login failed");
  }

  return res.json();
};

// ✅ SIGNUP
export const signup = async (user: any) => {
  const res = await fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(user),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "Signup failed");
  }

  return res.json();
};
// ---------------- FLIGHTS ----------------

export const addflight = async (
  flightName: string,
  from: string,
  to: string,
  departureTime: string,
  arrivalTime: string,
  price: number,
  availableSeats: number
) => {
  const res = await fetch(`${BASE_URL}/flights/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats,
    }),
  });

  if (!res.ok) {
    throw new Error("Failed to add flight");
  }

  return res.json();
};
export const editflight = async (
  id: string,
  flightName: string,
  from: string,
  to: string,
  departureTime: string,
  arrivalTime: string,
  price: number,
  availableSeats: number
) => {

  const res = await fetch(`${BASE_URL}/flights/update/${id}`, {

    method: "PUT",

    headers: {
      "Content-Type": "application/json"
    },

    body: JSON.stringify({
      flightName,
      from,
      to,
      departureTime,
      arrivalTime,
      price,
      availableSeats
    })

  })

  return res.json()
}
export const getflights = async () => {
  const res = await fetch(`${BASE_URL}/flights`)

  if (!res.ok) {
    throw new Error("Failed to fetch flights")
  }

  return res.json()
}
export const deleteflight = async (id: string) => {

  const res = await fetch(`${BASE_URL}/flights/delete/${id}`, {
    method: "DELETE"
  })

  if (!res.ok) {
    throw new Error("Failed to delete flight")
  
  }
  

}
export const handleflightbooking = async (
  userId: string,
  flightId: string,
  quantity: number,
  total: number
) => {
  const res = await fetch(`${BASE_URL}/book-flight`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      userId,
      flightId,
      quantity,
      total,
    }),
  });

  return res.json();
};
export const addhotel = async (
  hotelName: string,
  location: string,
  pricePerNight: number,
  availableRooms: number,
  amenities: string
) => {

  const res = await fetch(`${BASE_URL}/hotels/add`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities
    })
  })

  return res.json()
}

export const edithotel = async (
  id: string,
  hotelName: string,
  location: string,
  pricePerNight: number,
  availableRooms: number,
  amenities: string
) => {
  const res = await fetch(`${BASE_URL}/hotels/update/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      hotelName,
      location,
      pricePerNight,
      availableRooms,
      amenities,
    }),
  });

  return res.json();
}
export const handlehotelbooking = async (
  userId: string,
  hotelId: string,
  quantity: number,
  amount: number
) => {
  return {
    id: Date.now(),
    userId,
    hotelId,
    quantity,
    amount,
  };
};
// HOTEL APIs
export const gethotels = async () => {
  const res = await fetch(`${BASE_URL}/hotels`)
  return res.json()
}

// ---------------- USERS ----------------
export const getuserbyemail = async (email: string) => {
  const res = await fetch(`${BASE_URL}/users/email/${email}`)

  if (!res.ok) {
    throw new Error("User not found")
  }

  return res.json()
}
export const getflight = async () => {
  const res = await fetch(`${BASE_URL}/flights`)
  return res.json()
}

export const gethotel = async () => {
  const res = await fetch(`${BASE_URL}/hotels`)
  return res.json()
}

export const editprofile = async (data: any) => {
  const res = await fetch(`${BASE_URL}/api/user/update`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};