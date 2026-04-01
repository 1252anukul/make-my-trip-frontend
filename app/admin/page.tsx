"use client"

import { useState, useEffect } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import FlightList from "@/components/Flights/FlightList"
import HotelList from "@/components/Hotel/HotelList"

import { addflight, addhotel, editflight, edithotel, getuserbyemail } from "@/lib/api"

interface User {
  _id: string
  firstName: string
  lastName: string
  email: string
  role: string
  phoneNumber: string
}

interface Flight {
  id?: string
  flightName: string
  from: string
  to: string
  departureTime: string
  arrivalTime: string
  price: number
  availableSeats: number
}

interface Hotel {
  id?: string
  hotelName: string
  location: string
  pricePerNight: number
  availableRooms: number
  amenities: string
}

function UserSearch() {
  const [email, setEmail] = useState("")
  const [user, setUser] = useState<User | null>(null)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    const data = await getuserbyemail(email)
    setUser(data)
  }

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex gap-2">
        <Input
          placeholder="Search user by email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit">Search</Button>
      </form>

      {user && (
        <div className="border p-4 rounded">
          <p><b>Name:</b> {user.firstName} {user.lastName}</p>
          <p><b>Email:</b> {user.email}</p>
          <p><b>Role:</b> {user.role}</p>
          <p><b>Phone:</b> {user.phoneNumber}</p>
        </div>
      )}
    </div>
  )
}

function AddEditFlight({ flight }: { flight: Flight | null }) {

  const [formData, setFormData] = useState<Flight>({
    flightName: "",
    from: "",
    to: "",
    departureTime: "",
    arrivalTime: "",
    price: 0,
    availableSeats: 0
  })

  // 🔴 THIS IS THE FIX
  useEffect(() => {
    if (flight) {
      setFormData(flight)
    }
  }, [flight])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault()

  if (flight) {
    await editflight(
      flight.id!,
      formData.flightName,
      formData.from,
      formData.to,
      formData.departureTime,
      formData.arrivalTime,
      formData.price,
      formData.availableSeats
    )
  } else {
    await addflight(
      formData.flightName,
      formData.from,
      formData.to,
      formData.departureTime,
      formData.arrivalTime,
      formData.price,
      formData.availableSeats
    )
  }

  // refresh browser after add or update
  window.location.reload()
}

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <Input name="flightName" value={formData.flightName} onChange={handleChange} placeholder="Flight Name" />

      <Input name="from" value={formData.from} onChange={handleChange} placeholder="From" />

      <Input name="to" value={formData.to} onChange={handleChange} placeholder="To" />

      <Input name="departureTime" value={formData.departureTime} onChange={handleChange} type="datetime-local" />

      <Input name="arrivalTime" value={formData.arrivalTime} onChange={handleChange} type="datetime-local" />

      <Input name="price" value={formData.price} onChange={handleChange} type="number" placeholder="Price" />

      <Input name="availableSeats" value={formData.availableSeats} onChange={handleChange} type="number" placeholder="Seats" />

      <Button type="submit">
        {flight ? "Update Flight" : "Add Flight"}
      </Button>

    </form>
  )
}

function AddEditHotel({ hotel }: { hotel: Hotel | null }) {

  const [formData, setFormData] = useState<Hotel>({
    hotelName: "",
    location: "",
    pricePerNight: 0,
    availableRooms: 0,
    amenities: ""
  })

  // 🔴 Fill form when clicking Edit
  useEffect(() => {
    if (hotel) {
      setFormData(hotel)
    }
  }, [hotel])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData({
      ...formData,
      [name]: value
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (hotel) {
      await edithotel(
        hotel.id!,
        formData.hotelName,
        formData.location,
        formData.pricePerNight,
        formData.availableRooms,
        formData.amenities
      )
    } else {
      await addhotel(
        formData.hotelName,
        formData.location,
        formData.pricePerNight,
        formData.availableRooms,
        formData.amenities
      )
    }

    // refresh page
    window.location.href = "/admin?tab=hotels"
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">

      <Input
        name="hotelName"
        value={formData.hotelName}
        onChange={handleChange}
        placeholder="Hotel Name"
      />

      <Input
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Location"
      />

      <Input
        name="pricePerNight"
        value={formData.pricePerNight}
        onChange={handleChange}
        type="number"
        placeholder="Price"
      />

      <Input
        name="availableRooms"
        value={formData.availableRooms}
        onChange={handleChange}
        type="number"
        placeholder="Rooms"
      />

      <Input
        name="amenities"
        value={formData.amenities}
        onChange={handleChange}
        placeholder="Amenities"
      />

      <Button type="submit">
        {hotel ? "Update Hotel" : "Add Hotel"}
      </Button>

    </form>
  )
}

export default function AdminPage() {

  const [activeTab, setActiveTab] = useState("flights")
  const [selectedFlight, setSelectedFlight] = useState<Flight | null>(null)
  const [selectedHotel, setSelectedHotel] = useState<Hotel | null>(null)

  return (
    <div className="container mx-auto p-6">

      <h1 className="text-3xl font-bold mb-6">
        Admin Dashboard
      </h1>

      <Tabs value={activeTab} onValueChange={setActiveTab}>

        <TabsList className="grid grid-cols-3 w-full">
          <TabsTrigger value="flights">Flights</TabsTrigger>
          <TabsTrigger value="hotels">Hotels</TabsTrigger>
          <TabsTrigger value="users">Users</TabsTrigger>
        </TabsList>

        <TabsContent value="flights">
          <Card>
            <CardHeader>
              <CardTitle>Manage Flights</CardTitle>
              <CardDescription>Add or edit flights</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-6">
              <FlightList onSelect={setSelectedFlight} />
              <AddEditFlight flight={selectedFlight} />
            </CardContent>

          </Card>
        </TabsContent>

        <TabsContent value="hotels">
          <Card>
            <CardHeader>
              <CardTitle>Manage Hotels</CardTitle>
              <CardDescription>Add or edit hotels</CardDescription>
            </CardHeader>

            <CardContent className="grid grid-cols-2 gap-6">
              <HotelList onSelect={setSelectedHotel} />
              <AddEditHotel hotel={selectedHotel} />
            </CardContent>

          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>User Management</CardTitle>
              <CardDescription>Search users by email</CardDescription>
            </CardHeader>

            <CardContent>
              <UserSearch />
            </CardContent>

          </Card>
        </TabsContent>

      </Tabs>

    </div>
  )
}