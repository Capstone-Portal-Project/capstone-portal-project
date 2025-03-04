import React from 'react'
import { auth } from '@clerk/nextjs/server'

export default function InstructorDashboard () {

    auth.protect();

  return (
    <div>instructor page</div>
  )
}
