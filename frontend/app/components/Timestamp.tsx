'use client'

import { useState, useEffect } from "react";

export function Timestamp() {
  const [time, setTime] = useState<number>(new Date().getFullYear())

  useEffect(() => {
    setTime(new Date().getFullYear())
  }, [])

  // Always render the current year to avoid hydration mismatch
  return time
}