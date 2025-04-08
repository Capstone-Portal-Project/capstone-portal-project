'use client'

import React, { useState } from 'react'
import { OrganizationProfile } from '@clerk/nextjs'
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from '../../../../components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../../../components/ui/dialog'
import { Button } from '../../../../components/ui/button'
import { Toaster, useToast } from "~/components/ui/toaster";
import { updateProgramStatus, getProgramStatus } from '../../../../server/api/routers/program'

// Define enum values locally for UI logic
const programStatuses = [
  'submissions',
  'matching',
  'active',
  'ending',
  'archived',
  'hidden',
] as const

type ProgramStatus = (typeof programStatuses)[number]

const statusDescriptions: Record<ProgramStatus, string> = {
  submissions: 'This will open the course to accepting applications.',
  matching: 'This will open matching for students.',
  active: 'This will let students can see which team they are in.',
  ending: 'This will open final project showcase reports.',
  archived: 'This means the program is complete and its projects are displayed in the project showcase.',
  hidden: 'This means the program is complete and its projects are NOT displayed in the project showcase.',
}

export default function ManageCourse() {
  const [status, setStatus] = useState<ProgramStatus | undefined>()
  const [pendingStatus, setPendingStatus] = useState<ProgramStatus | null>(null)
  const [open, setOpen] = useState(false)
  const { toast } = useToast()

  const programId = 5 // TODO: replace with dynamic value when ready

  const handleStatusChange = (value: ProgramStatus) => {
    setPendingStatus(value)
    setOpen(true)
  }

  const handleConfirm = async () => {
    if (!pendingStatus) return
    const result = await updateProgramStatus(programId, pendingStatus)
    if (!result.error) {
      setStatus(pendingStatus)
      toast({
        title: 'Program status updated',
        description: `Status changed to "${pendingStatus}".`,
      })
    } else {
      toast({
        title: 'Error',
        description: 'Failed to update program status.',
        variant: 'destructive',
      })
    }
    setPendingStatus(null)
    setOpen(false)
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex md:flex-row gap-16">
        <div>
          <OrganizationProfile
            appearance={{
              elements: {
                cardBox: 'shadow-none border border-gray-200',
              },
            }}
          />
        </div>

        <div className="w-full md:w-64">
          <label className="block mb-2 text-md font-medium text-gray-700">
            Program Status
          </label>
          <Select value={status} onValueChange={handleStatusChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select status..." />
            </SelectTrigger>
            <SelectContent>
              {programStatuses.map((value) => (
                <SelectItem key={value} value={value}>
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Status Change</DialogTitle>
          </DialogHeader>
          <div className="py-2 text-sm text-gray-600">
            Are you sure you want to change the program status to{' '}
            <strong className="capitalize">{pendingStatus}</strong>?<br />
            <span>{pendingStatus && statusDescriptions[pendingStatus]}</span>
          </div>
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirm}>Confirm</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      <Toaster />
    </div>
  )
}
