import api from '../api'

export class AuthenticationApiClient {
  async register(data: IUserRegistrationRequest): Promise<IRegistrationResponse> {
    return await api.post<IRegistrationResponse>('/api/authentication/users/register', data, {requiresAuth: false})
  }
}

export interface IUserRegistrationRequest {
  firstName: string
  lastName: string
  email: string
  password: string
}

export interface IUserResponse {
  id: string
  email: string
  displayName: string
  firstName: string
  lastName: string
  initials: string
  tenantIds: string[]
  createdAt: string
  updatedAt: string
}

export interface IRegistrationResponse {
  user: IUserResponse
  customToken: string
}
