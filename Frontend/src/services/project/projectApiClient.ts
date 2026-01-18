import api from '../api'
import type { IProjectResponse } from '../projects/projectsApiClient'

export class ProjectApiClient {
  async getByKey(key: string): Promise<IProjectGetByKeyResponse> {
    const project = await api.get<IProjectGetByKeyResponse>(`/api/projects/${key}`)
    return project
  }
}

export interface IProjectGetByKeyResponse {
  project: IProjectResponse
}
