'use client'

import { UserButton, useUser } from '@clerk/nextjs'
import { Bot, Boxes, Camera, NotebookText, Users } from 'lucide-react'
import { Spinner } from './ui/spinner'

function UserButtonCustom() {
  const { user, isLoaded } = useUser()

  if (!isLoaded) {
    return <Spinner />
  }

  const role = user?.publicMetadata?.role

  return (
    <UserButton>
      <UserButton.MenuItems>
        <UserButton.Link
          label="Tanya AI"
          labelIcon={<Bot size={14} />}
          href="/dashboard/chat"
        />
      </UserButton.MenuItems>

      {(role === 'admin' || role === 'pengawas') && (
        <UserButton.MenuItems>
          <UserButton.Link
            label="Survey"
            labelIcon={<Camera size={14} />}
            href="/dashboard/survey"
          />
        </UserButton.MenuItems>
      )}

      {(role === 'admin' || role === 'pengawas') && (
        <UserButton.MenuItems>
          <UserButton.Link
            label="Report"
            labelIcon={<NotebookText size={14} />}
            href="/dashboard/report"
          />
        </UserButton.MenuItems>
      )}

      {role === 'admin' && (
        <UserButton.MenuItems>
          <UserButton.Link
            label="Manage Users"
            labelIcon={<Users size={14} />}
            href="/dashboard/manage-users"
          />
        </UserButton.MenuItems>
      )}

      {role === 'admin' && (
        <UserButton.MenuItems>
          <UserButton.Link
            label="Manage Materials"
            labelIcon={<Boxes size={14} />}
            href="/dashboard/manage-materials"
          />
        </UserButton.MenuItems>
      )}
    </UserButton>
  )
}

export default UserButtonCustom
