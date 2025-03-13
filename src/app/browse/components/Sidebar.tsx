"use client"
<<<<<<< Updated upstream

import { Archive, BookOpen, Pin, Search } from "lucide-react";
=======
import { Archive, BookOpen, Check, ChevronDown, Pin, Search } from "lucide-react";
import Link from "next/link";
>>>>>>> Stashed changes
import React from "react";
import { Command } from "~/components/ui/command";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "~/components/ui/select";
import { cn } from "~/lib/utils";

type TabButtonProps = {
    isActive?: boolean,
    children?: React.ReactNode,
}

const TabButton = (props: TabButtonProps) => {
    const { isActive = false, children } = props;
    return (
        <div className={cn(
            'text-[#808080] py-1 pl-1 flex font-semibold gap-1',
            {
                'bg-[#D73F09] text-[#f7f5f5]': isActive,
                'hover:bg-[#e9e5e4]' : !isActive,
            }
        )}>{children}</div>
    );
}

const Sidebar = () => {
    return (
<<<<<<< Updated upstream
        <div className="bg-[#f7f5f5] h-full w-full rounded-lg flex flex-col pt-4 px-4 focus:outline-none space-y-3">
            <div>
                <span className="text-[#808080] font-bold">Tabs</span>
                <div className="border h-[1px] w-full" />
                    <TabButton>
                        <Archive /> Archived
                    </TabButton>
                    <TabButton { ...{isActive: true} }>
                        <BookOpen /> Active
                    </TabButton>
                    <TabButton>
                        <Pin /> Saved
                    </TabButton>
            </div>
            <div>
                <span className="text-[#808080] font-bold">Filters</span>
                <div className="border h-[1px] w-full mb-3" />
                <div className="flex flex-col space-y-3">
                    <div className="flex focus-within:ring-2 focus-within:ring-[#D73F09] content-center place-items-center bg-[#e9e5e4]">
                        <Search className="mx-1"/>
                        <textarea 
                        className="resize-none focus:outline-none w-full h-auto py-1 px-1 whitespace-nowrap overflow-hidden bg-[#e9e5e4]" 
                        rows={1} placeholder="Search..." />
                    </div>
                    <span className="text-[#808080]">Sort by</span>  
                </div>       
=======
        <div className="bg-[#f7f5f5] h-full w-full rounded-lg px-4 pt-4 pb-6 overflow-y-scroll">
            <div className="relative h-full flex flex-col focus:outline-none space-y-3">
                <div>
                    <span className="text-[#808080] font-bold">Tabs</span>
                    <div className="border h-[1px] w-full" />
                        <Link href="/archive">                    
                            <TabButton>
                                <Archive /> Archived
                            </TabButton>
                        </Link>
                        <TabButton { ...{isActive: true} }>
                            <BookOpen /> Active
                        </TabButton>
                        <Link href="savedProjects">
                            <TabButton>
                                <Pin /> Saved
                            </TabButton>                    
                        </Link>
                </div>
                <div>
                    <span className="text-[#808080] font-bold">Filters</span>
                    <div className="border h-[1px] w-full mb-3" />
                    <div className="flex flex-col space-y-3">
                        <div className="flex focus-within:ring-2 focus-within:ring-[#D73F09] content-center place-items-center bg-[#e9e5e4]">
                            <Search className="mx-1"/>
                            <textarea 
                            className="resize-none focus:outline-none w-full h-auto py-1 px-1 whitespace-nowrap overflow-hidden bg-[#e9e5e4]" 
                            rows={1} placeholder="Search..." />
                        </div>
                        <div>
                        <span className="text-[#808080]">Sort by</span>  
                            <Select>
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="None" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="latest">Latest</SelectItem>
                                <SelectItem value="oldest">Oldest</SelectItem>
                            </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <span className="text-[#808080]">Filter tags</span> 
                        
                        </div>
                        <div className="absolute bottom-0 right-0 px-3 py-1 bg-[#D73F09] text-[#f7f5f5] rounded-md inline-flex">
                            Apply
                        </div>

                    </div>       
                </div>                
>>>>>>> Stashed changes
            </div>
        </div>        
    );    
}

export default Sidebar;