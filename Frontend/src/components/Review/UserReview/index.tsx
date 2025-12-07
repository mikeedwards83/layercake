import type { User } from "@/types/user"

interface UserProps {
  value: string
  users: User[]
}
export const UserReview = ({ value, users }: UserProps) => {
  const user = users.find((u) => u.id === value)

  return (
    <>
      {user && (
        <div className="d-flex align-items-center gap-3">
          <div
            className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center"
            style={{ width: '50px', height: '50px', fontSize: '20px', fontWeight: 'bold' }}>
            {user.name
              .split(' ')
              .map((n) => n[0])
              .join('')}
          </div>
          <div>
            <div className="fw-semibold fs-5">{user.name}</div>
            <small className="text-muted">{user.email}</small>
          </div>
        </div>
      )}
    </>
  )
}
