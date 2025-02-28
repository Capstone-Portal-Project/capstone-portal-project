import React from 'react'
import { useState } from 'react'
import { DataTableUser } from '../columns'

type UserCardProps = {
    user: DataTableUser
}

export default function UserCard({ user }: UserCardProps) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    
    return (
        <div className="bg-white shadow-lg rounded-lg p-4 cursor-grab hover:ring-inset hover:ring-2"
        onMouseEnter={() => setMouseIsOver(true)}
        onMouseLeave={() => setMouseIsOver(false)}
        >
            <h3 className="text-lg font-semibold">{user.username}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
        </div>
    )
}