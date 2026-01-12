import api from '../api'

export class LogicalApplicationsApiClient {
  async getAll(projectKey: string): Promise<ILogicalApplicationsGetResponse> {
    const logicalApplications = await api.get<ILogicalApplicationsGetResponse>(`/api/project/${projectKey}/logical`)
    return logicalApplications
  }

  async post(projectKey: string, request: ILogicalApplicationsPostRequest): Promise<ILogicalApplicationsPostResponse> {
    const createdLogicalApplication = await api.post<ILogicalApplicationsPostResponse>(`/api/project/${projectKey}/logical`, request)
    return createdLogicalApplication
  }

  async get(projectKey: string, id: string): Promise<ILogicalApplicationsPostResponse> {
    const logicalApplication = await api.get<ILogicalApplicationsPostResponse>(`/api/project/${projectKey}/logical/${id}`)
    return logicalApplication
  }
}

export interface ILogicalApplicationsPostRequest {
  name: string
  projectId: string
  description?: string
  ownerId?: string
}

export interface ILogicalApplicationsPostResponse {
  logicalApplication: ILogicalApplicationResponse
}

export interface ILogicalApplicationsGetResponse {
  logicalApplications: ILogicalApplicationResponse[]
}

export interface ILogicalApplicationResponse {
  id: string
  tenantId: string
  name: string
  projectId: string
  description?: string
  ownerId?: string
  created: string
  createdBy: string
  updated: string
  updatedBy: string
}
