import api from '../api'

export class ApplicationTypesApiClient {
  async getAll(): Promise<IApplicationTypesGetResponse> {
    const applicationTypes = await api.get<IApplicationTypesGetResponse>('/api/settings/applicationtypes')
    return applicationTypes
  }

  async post(request: IApplicationTypesPostRequest): Promise<IApplicationTypesPostResponse> {
    const createdApplicationType = await api.post<IApplicationTypesPostResponse>('/api/settings/applicationtypes', request)
    return createdApplicationType
  }
}

export interface IApplicationTypesPostRequest {
  name: string
}

export interface IApplicationTypesPostResponse {
  applicationType: IApplicationTypeResponse
}

export interface IApplicationTypesGetResponse {
  applicationTypes: IApplicationTypeResponse[]
}

export interface IApplicationTypeResponse {
  id: string
  name: string
  isCustom: boolean
}
