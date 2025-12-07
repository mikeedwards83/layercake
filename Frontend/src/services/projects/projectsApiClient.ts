import api from '../api'

export class ProjectsApiClient {
  async post(request: ProjectsPostRequest): Promise<ProjectsPostResponse> {
    const createdProject = await api.post<ProjectsPostResponse>('/api/projects', request)
    return createdProject
  }
}

export interface ProjectsPostRequest {
  name: string
  key: string
  description: string
  icon: string
  color: string
  ownerId?: string
}

export interface ProjectsPostResponse {
  id:string
  name: string
  key: string
  description: string
  icon: string
  color: string
  ownerId?: string
}
