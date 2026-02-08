import { TbMailForward, TbMailCheck, TbCircleCheck, TbCircleX, TbUsers } from 'react-icons/tb'
import { UserStatus } from '@/services/users/usersApiClient'
import type { IconType } from 'react-icons'

export interface StatusBadgeInfo {
  variant: string
  icon: IconType
  label: string
}

/**
 * Get badge styling and information for a user status
 * @param status - The user status enum value
 * @returns Object containing variant, icon, and label for the status badge
 */
export const getStatusBadge = (status: UserStatus): StatusBadgeInfo => {
  switch (status) {
    case UserStatus.InvitePending:
      return {
        variant: 'warning',
        icon: TbMailForward,
        label: 'Invite Pending',
      }
    case UserStatus.EmailPending:
      return {
        variant: 'info',
        icon: TbMailCheck,
        label: 'Email Pending',
      }
    case UserStatus.Completed:
      return {
        variant: 'success',
        icon: TbCircleCheck,
        label: 'Active',
      }
    case UserStatus.Disabled:
      return {
        variant: 'danger',
        icon: TbCircleX,
        label: 'Disabled',
      }
    default:
      return {
        variant: 'secondary',
        icon: TbUsers,
        label: 'Unknown',
      }
  }
}
