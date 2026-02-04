import api from '../api'
import type { IContainer, IContainerType } from '@/types/container'

export class ContainersApiClient {
  async getAll(projectKey: string, logicalKey: string): Promise<IContainersGetResponse> {
    const containers = await api.get<IContainersGetResponse>(`/api/projects/${projectKey}/logical/${logicalKey}/containers`)
    return containers
  }

  async post(projectKey: string, logicalKey: string, request: IContainersPostRequest): Promise<IContainersPostResponse> {
    const createdContainer = await api.post<IContainersPostResponse>(`/api/projects/${projectKey}/logical/${logicalKey}/containers`, request)
    return createdContainer
  }
}

export class ContainerTypesApiClient {
  async getAll(): Promise<IContainerTypesGetResponse> {
    const containerTypes = await api.get<IContainerTypesGetResponse>('/api/containertypes')
    return containerTypes
  }
}

export interface IContainersPostRequest {
  name: string
  key: string
  description?: string
  type: number
  icon?: string
}

export interface IContainersPostResponse {
  container: IContainer
}

export interface IContainersGetResponse {
  containers: IContainer[]
}

export interface IContainerTypesGetResponse {
  containerTypes: IContainerType[]
}
