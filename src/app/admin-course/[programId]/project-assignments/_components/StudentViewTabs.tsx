import * as Tabs from "@radix-ui/react-tabs";

const StudentTabsTrigger = ({ value, name, total }: { 
value: string, // Identifier for the content
name: string, // Name of the project
total: number // Total students on the team
}) => {
  return (
    <Tabs.Trigger 
    value={value}
    className="grid grid-cols-[1fr_3fr_1fr] data-[state=active]:bg-[#e9e5e4]"
    >
      <div className="flex justify-center items-center">
          <div className="bg-[#f7f5f5] h-[36px] w-[36px] rounded-md" />
      </div>
      <div className="tracking-tight pl-2 font-semibold">
          <div>
              {name || "Project Name"}
          </div>
          <div className="font-semibold text-[#D73F09]">
              {total || 0} Students
          </div>
      </div>
      <div className="flex justify-center items-center text-lg font-extrabold">
        #{value.slice(-1) ?? NaN}
      </div>
    </Tabs.Trigger>
  );
}

const StudentTabsList = ({ children }: { 
children: React.ReactElement 
}) => {
  return (
    <Tabs.List className="flex flex-col border-[2px] mt-6">
      <div className="font-bold">Ranks</div>   
      <div className="grid grid-rows-2">
        {children}
      </div>        
    </Tabs.List>
  );
}

const StudentTabsContent = ({ value, children }: { 
value: string, // Identifier for the trigger
children: React.ReactElement 
}) => {
  return (
    <Tabs.Content value={value}>
      {children}
    </Tabs.Content>
  );
}

const StudentTabs = ({ children }: { children: React.ReactElement }) => {
  return (
    <Tabs.Root className="grid gap-6 md:grid-cols-[1fr_240px]">
      <div className="flex flex-col">
        <div className="text-lg font-bold ml-2 mb-3">John Smith</div>
        <div className="ml-2 text-[#8E9089]">Assigned to</div>
        <div className="ml-2 mb-2">Project Name</div>
        { children }
      </div>
    </Tabs.Root>      
  );
}

export {
  StudentTabsTrigger,
  StudentTabsList,
  StudentTabsContent,
  StudentTabs
}