import api from '../api'

export class UsersApiClient {
  async getAll(params?: {
    search?: string
    status?: string
    verification?: string
    page?: number
    pageSize?: number
  }): Promise<IUsersGetResponse> {
    const queryParams = new URLSearchParams()

    if (params?.search) queryParams.append('search', params.search)
    if (params?.status) queryParams.append('status', params.status)
    if (params?.verification) queryParams.append('verification', params.verification)
    if (params?.page) queryParams.append('page', params.page.toString())
    if (params?.pageSize) queryParams.append('pageSize', params.pageSize.toString())

    const queryString = queryParams.toString()
    const url = queryString ? `/api/admin/users?${queryString}` : '/api/admin/users'

    const users = await api.get<IUsersGetResponse>(url)
    return users
  }

  async getById(id: string): Promise<IUserResponse> {
    const user = await api.get<IUserResponse>(`/api/admin/users/${id}`)
    return user
  }

  async create(data: IUserCreateRequest): Promise<IUserResponse> {
    const user = await api.post<IUserResponse>('/api/admin/users', data)
    return user
  }
}

export interface IUserCreateRequest {
  email: string
  firstName: string
  lastName: string
}

export interface IUsersGetResponse {
  users: IUserResponse[]
  totalCount: number
  page: number
  pageSize: number
  totalPages: number
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
