"use client"

import { Provider, useDispatch } from "react-redux"
import { store } from "./store"
import { useEffect } from "react"
import { setUser } from "./userSlice"

function LoadUser({ children }: { children: React.ReactNode }) {
  const dispatch = useDispatch()

  useEffect(() => {
    const storedUser = localStorage.getItem("user")

    if (storedUser) {
      dispatch(setUser(JSON.parse(storedUser)))
    }
  }, [dispatch])

  return <>{children}</>
}

export default function Providers({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <Provider store={store}>
      <LoadUser>{children}</LoadUser>
    </Provider>
  )
}