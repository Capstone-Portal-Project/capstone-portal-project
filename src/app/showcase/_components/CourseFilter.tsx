import { useEffect, useState } from "react"
import { 
  Command,
  CommandGroup, 
  CommandItem, 
  CommandList 
} from "~/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { CheckIcon, ChevronDown } from "lucide-react";
import { cn } from "~/lib/utils";
import { Button } from "~/components/ui/button";

const CourseFilter = () => {
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const toggleOption = (option: string) => {
    const newSelectedValues = selectedValues.includes(option)
      ? selectedValues.filter((value) => value !== option)
      : [...selectedValues, option];
    setSelectedValues(newSelectedValues);
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full flex p-1 m-0 gap-0 h-8">
          <div className="flex justify-between w-full items-center">
            <span>Any</span>
            <ChevronDown className="" />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <Command>
          <CommandList>
            <CommandGroup>
              <CommandItem onSelect={() => toggleOption("CS 46x")}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedValues.includes("CS 46x")
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>CS 46x</span>
              </CommandItem>
              <CommandItem onSelect={() => toggleOption("ENGR 41x")}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedValues.includes("ENGR 41x")
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>ENGR 41x</span>
              </CommandItem>
              <CommandItem onSelect={() => toggleOption("FE/FOR 459")}>
                <div
                  className={cn(
                    "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                    selectedValues.includes("FE/FOR 459")
                      ? "bg-primary text-primary-foreground"
                      : "opacity-50 [&_svg]:invisible"
                  )}
                >
                  <CheckIcon className="h-4 w-4" />
                </div>
                <span>FE/FOR 459</span>
              </CommandItem>                          
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default CourseFilter;