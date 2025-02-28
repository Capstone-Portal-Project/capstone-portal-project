"use client";

import React from 'react'
import { useState } from 'react'
import { DataTableUser } from '../columns'
import { useDraggable } from '@dnd-kit/core'
import { CSS } from '@dnd-kit/utilities'

type UserCardProps = {
    user: DataTableUser
}

export default function UserCard({ user }: UserCardProps) {
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const { 
        setNodeRef, 
        attributes, 
        listeners, 
        transform, 
        // transition 
    } = useDraggable({
        id: user.id.toString(),
        data: {
            type: "user",
            userId: user.id,
        }
    })
    // const style = {
    //     transition,
    //     transform: CSS.Transform.toString(transform),
    // }

    const style = transform
    ? {
        transform: `translate(${transform.x}px, ${transform.y}px)`,
      }
    : undefined;
    
    return (
        <div 
            ref={setNodeRef}
            {...attributes}
            {...listeners}
            className="bg-white shadow-lg rounded-lg p-4 cursor-grab hover:ring-inset hover:ring-2"
            style={style}
            onMouseEnter={() => setMouseIsOver(true)}
            onMouseLeave={() => setMouseIsOver(false)}
        >
            <h3 className="text-lg font-semibold">{user.username}</h3>
            <p className="text-sm text-gray-500">{user.email}</p>
        </div>
    )
}