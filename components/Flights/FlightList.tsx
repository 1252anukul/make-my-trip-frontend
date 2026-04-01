"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { getflights } from "@/lib/api"
import { deleteflight } from "@/lib/api"
export default function FlightList({ onSelect }: any) {

  const [flights, setFlights] = useState([])
  const handleDelete = async (_id: string) => {
  await deleteflight(_id)

  // reload flights
  const updatedFlights = await getflights()
  setFlights(updatedFlights)
}

  useEffect(() => {

    const loadFlights = async () => {
      try {
        const data = await getflights()
        setFlights(data)
      } catch (error) {
        console.error("Failed to load flights", error)
      }
    }

    loadFlights()

  }, [])

return (
  <div>

    <h2 className="text-xl font-bold mb-4">Flight List</h2>

    <table className="w-full border">

      <thead>
        <tr className="border-b bg-gray-100 text-left">
          <th className="p-3">Flight Name</th>
          <th className="p-3">From</th>
          <th className="p-3">To</th>
          <th className="p-3">Seats</th>
          <th className="p-3">Price</th>
          <th className="p-3">Action</th>
        </tr>
      </thead>

      <tbody>
        {flights.map((flight: any, index: number) => (

          <tr key={flight._id || index} className="border-b">

            <td className="p-3">{flight.flightName}</td>

            <td className="p-3">{flight.from}</td>

            <td className="p-3">{flight.to}</td>

            <td className="p-3">{flight.availableSeats}</td>

            <td className="p-3">${flight.price}</td>

            <td className="p-3 flex gap-2">

              <Button onClick={() => onSelect(flight)}>
                Edit
              </Button>

              <Button
                variant="destructive"
                onClick={() => handleDelete(flight._id)}
              >
                Delete
              </Button>

            </td>

          </tr>

        ))}
      </tbody>

    </table>

  </div>
)

}