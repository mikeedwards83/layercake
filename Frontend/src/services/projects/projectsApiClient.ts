import api from '../api'

export class ProjectsApiClient {
  async getAll(): Promise<IProjectsGetResponse> {
    const projects = await api.get<IProjectsGetResponse>('/api/projects')
    return projects
  }

  async post(request: IProjectsPostRequest): Promise<IProjectsPostResponse> {
    const createdProject = await api.post<IProjectsPostResponse>('/api/projects', request)
    return createdProject
  }
}

export interface IProjectsPostRequest {
  name: string
  key: string
  description: string
  icon: string
  color: string
  ownerId?: string
}

export interface IProjectsPostResponse {
  project: IProjectResponse
}

export interface IProjectsGetResponse{
  projects: IProjectResponse[]
}

export interface IProjectResponse{
  id:string
  name: string
  key: string
  description: string
  icon: string
  color: string
  ownerId?: string
}