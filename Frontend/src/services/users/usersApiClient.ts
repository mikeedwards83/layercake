import api from '../api'

export class UsersApiClient {
  async getAll(): Promise<IUsersGetResponse> {
    const users = await api.get<IUsersGetResponse>('/api/users')
    return users
  }

  async getById(id: string): Promise<IUserResponse> {
    const user = await api.get<IUserResponse>(`/api/users/${id}`)
    return user
  }
}

export interface IUsersGetResponse {
  users: IUserResponse[]
}

export interface IUserResponse {
  uid: string
  email: string
  displayName?: string
  photoUrl?: string
  emailVerified: boolean
  disabled: boolean
  createdAt?: string
  lastSignInAt?: string
}
