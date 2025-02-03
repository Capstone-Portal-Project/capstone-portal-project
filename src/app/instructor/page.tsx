import { auth } from '@clerk/nextjs/server'
import React from 'react'

export default function Instructor() {
  auth.protect({ role: 'org:instructor' })
  
  return (
    <div>Instructor</div>
  )
}
