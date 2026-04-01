"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { gethotels } from "@/lib/api"

export default function HotelList({ onSelect }: any) {

  const [hotels, setHotels] = useState([])

  useEffect(() => {
    loadHotels()
  }, [])

  const loadHotels = async () => {
    try {
      const data = await gethotels()
      setHotels(data)
    } catch (error) {
      console.error("Failed to load hotels", error)
    }
  }

  return (
  <div>

    <h2 className="text-xl font-bold mb-4">Hotel List</h2>

    <table className="w-full border">

      <thead>
        <tr className="border-b bg-gray-100 text-left">
          <th className="p-3">Hotel Name</th>
          <th className="p-3">Location</th>
          <th className="p-3">Price/Night</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {hotels.map((hotel: any, index: number) => (

          <tr key={hotel._id || index} className="border-b">

            <td className="p-3">{hotel.hotelName}</td>

            <td className="p-3">{hotel.location}</td>

            <td className="p-3">${hotel.pricePerNight}</td>

            <td className="p-3">
              <Button onClick={() => onSelect(hotel)}>
                Edit
              </Button>
            </td>

          </tr>

        ))}
      </tbody>

    </table>

  </div>
)
}