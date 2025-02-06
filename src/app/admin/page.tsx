import { auth } from '@clerk/nextjs/server'
import React from 'react'

export default function Admin() {
    
  auth.protect();    

  return (
    <div>Admin</div>
  )
}
