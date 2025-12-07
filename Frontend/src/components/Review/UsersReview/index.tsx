import { generateId } from '@/components/Form/formhelps'
import type { User } from '@/types/user'
import {Form } from 'react-bootstrap'
import { UserReview } from '../UserReview'

interface UsersReviewProps {
  label: string
  values: string[]
  users: User[]
  noResults?: string
}

export const UsersReview = ({ label, values, users, noResults }: UsersReviewProps) => {
  const id = generateId(label)

  return (
    <div className="mb-3">
      <Form.Label for={id} className="text-muted">
        {label}
      </Form.Label>
      {values.map((value) => (
        <UserReview value={value} users={users} />
      ))}
      {values.length == 0 && <p className="text-muted mb-0">{noResults}</p>}
    </div>
  )
}
