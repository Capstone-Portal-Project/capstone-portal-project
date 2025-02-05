import React from 'react'
import { OrganizationProfile } from '@clerk/nextjs'

export default function ManageCourse() {
  
  return (
    <div className="container mx-6 p-6">
      <div>ManageCourse</div>
      <OrganizationProfile 
        appearance={{
          elements: {
            cardBox: 'shadow-none border border-gray-200',
          },
        }}
      />
    </div>
  )
}