import api from '../api'

export class InvitesApiClient {
  async getDetails(token: string): Promise<IInviteDetailsResponse> {
    const response = await api.get<IInviteDetailsResponse>(`/api/invites/${token}`)
    return response
  }

  async accept(token: string, data: IAcceptInviteRequest): Promise<IAcceptInviteResponse> {
    const response = await api.post<IAcceptInviteResponse>(`/api/invites/${token}/accept`, data)
    return response
  }
}

export interface IInviteDetailsResponse {
  email: string
  firstName: string
  lastName: string
  invitedByName: string
  tenantName: string
  expiresAt: string
  isExpired: boolean
  isAccepted: boolean
}

export interface IAcceptInviteRequest {
  password: string
  confirmPassword: string
}

export interface IAcceptInviteResponse {
  customToken: string
  email: string
  displayName: string
}
