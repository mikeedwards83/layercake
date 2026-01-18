import api from '../api'

export class LogicalApplicationsApiClient {
  async getAll(projectKey: string): Promise<ILogicalApplicationsGetResponse> {
    const logicalApplications = await api.get<ILogicalApplicationsGetResponse>(`/api/projects/${projectKey}/logical`)
    return logicalApplications
  }

  async post(projectKey: string, request: ILogicalApplicationsPostRequest): Promise<ILogicalApplicationsPostResponse> {
    const createdLogicalApplication = await api.post<ILogicalApplicationsPostResponse>(`/api/projects/${projectKey}/logical`, request)
    return createdLogicalApplication
  }

  async getByKey(projectKey: string, logicalKey: string): Promise<ILogicalApplicationResponse> {
    const logicalApplication = await api.get<ILogicalApplicationResponse>(`/api/projects/${projectKey}/logical/${logicalKey}`)
    return logicalApplication
  }
}

export interface ILogicalApplicationsPostRequest {
  name: string
  key: string
  description?: string
  ownerId?: string
  applicationTypeId?: string
  customApplicationTypeName?: string
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
  key: string
  projectId: string
  description?: string
  ownerId?: string
  applicationTypeId?: string
  created: string
  createdBy: string
  updated: string
  updatedBy: string
}
