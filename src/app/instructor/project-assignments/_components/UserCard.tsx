"use client";

import React from 'react'
import { useState } from 'react'
import { DataTableUser } from '../columns'
import { useDraggable } from '@dnd-kit/core'
import { StudentView, StudentViewContent } from './StudentView';
import * as Tabs from "@radix-ui/react-tabs"
import { StudentTabsContent, StudentTabsList, StudentTabsTrigger } from './StudentViewTabs';

type UserCardProps = {
    user: DataTableUser
}

export default function UserCard({ user }: { user: DataTableUser}) {
    const [open, setOpen] = useState(false);
    const [mouseIsOver, setMouseIsOver] = useState(false);
    const { 
        setNodeRef, 
        attributes, 
        listeners, 
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
    
    return (
        <StudentView open={open} onOpenChange={setOpen}>
            <div 
                ref={setNodeRef}
                className="bg-white border rounded-lg p-4 cursor-grab hover:ring-inset hover:ring-2"
                onClick={() => setOpen(true)} // Controls the attached modal, StudentView. Preferred to "reuse dialog" https://github.com/radix-ui/primitives/discussions/1532
                {...attributes}
                {...listeners}
                onMouseEnter={() => setMouseIsOver(true)}
                onMouseLeave={() => setMouseIsOver(false)}
            >
                <h3 className="text-lg font-semibold">{user.username}</h3>
                <p className="text-sm text-gray-500">{user.email}</p>
            </div>
            <StudentViewContent>
                <Tabs.Root className="grid gap-6 md:grid-cols-[1fr_280px]">
                    <div className="flex flex-col">
                        <div className="text-lg font-bold ml-2 mb-3">John Smith</div>
                        <div className="ml-2 text-[#8E9089]">Assigned to</div>
                        <div className="ml-2 mb-2">Project Name</div> 
                        <StudentTabsContent value="project-1">
                            <div className="grid grid-rows-2 border-[2px] h-[280px] p-2">
                                <div className="flex flex-col">
                                    <div>I want to join because...</div>
                                    <span className="w-full h-[1px] border-[1px]"/>
                                    I think I'm pretty cool, and honestly you should too!
                                </div>
                                <div className="flex flex-col">
                                    <div>I want to join because...</div>
                                    <span className="w-full h-[1px] border-[1px]"/>
                                    I think I'm pretty cool, and honestly you should too!
                                </div>                                   
                            </div>
                        </StudentTabsContent>
                        <StudentTabsContent value="project-2">
                            <div className="grid grid-rows-2 border-[2px] h-[280px] p-2">
                                <div className="flex flex-col">
                                    <div>I want to join because...</div>
                                    <span className="w-full h-[1px] border-[1px]"/>
                                    I'm more than just cool, I'm awesome!
                                </div>
                                <div className="flex flex-col">
                                    <div>I want to join because...</div>
                                    <span className="w-full h-[1px] border-[1px]"/>
                                    I'm more than just cool, I'm awesome!
                                </div>                                   
                            </div>                        
                        </StudentTabsContent>                                 
                    </div>
                    <StudentTabsList>
                        <StudentTabsTrigger value="project-1" />
                        <StudentTabsTrigger value="project-2" /> 
                    </StudentTabsList>
                </Tabs.Root>
            </StudentViewContent>
        </StudentView>
    )
}