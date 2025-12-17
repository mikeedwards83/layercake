import api from '../api'

export interface IWikiPage {
  id: string
  tenantId: string
  title: string
  key: string
  contents: string
  referenceId: string
  parentId: string
  updated: string
  updatedBy: string
  created: string
  createdBy: string
}

export interface IWikiPageGetResponse {
  wikiPage: IWikiPage
}

export interface IWikiPagesGetResponse {
  wikiPages: IWikiPage[]
}

export interface IWikiPageUpdateRequest {
  title?: string
  contents?: string
  parentId?: string
}

export interface IWikiPageCreateRequest {
  title: string
  contents: string
  parentId: string
  referenceId: string
}

export class WikiPageApiClient {
  /**
   * Get a wiki page by key and reference ID
   */
  async getByKeyAndReference(referenceId: string, key: string): Promise<IWikiPageGetResponse> {
    const response = await api.get<IWikiPageGetResponse>(`/api/wikipage/${referenceId}/${key}`)
    return response
  }

  /**
   * Get a wiki page by reference ID and parent ID (use '00000000-0000-0000-0000-000000000000' for root)
   */
  async getByReferenceAndParent(referenceId: string, parentId: string): Promise<IWikiPageGetResponse> {
    const response = await api.get<IWikiPageGetResponse>(`/api/wikipage/${referenceId}/parent/${parentId}`)
    return response
  }

  /**
   * Get all wiki pages for a reference ID
   */
  async getByReference(referenceId: string): Promise<IWikiPagesGetResponse> {
    const response = await api.get<IWikiPagesGetResponse>(`/api/wikipage/${referenceId}`)
    return response
  }

  /**
   * Update a wiki page
   */
  async update(id: string, data: IWikiPageUpdateRequest): Promise<IWikiPageGetResponse> {
    const response = await api.put<IWikiPageGetResponse>(`/api/wikipage/${id}`, data)
    return response
  }

  /**
   * Create a new wiki page
   */
  async create(data: IWikiPageCreateRequest): Promise<IWikiPageGetResponse> {
    const response = await api.post<IWikiPageGetResponse>('/api/wikipage', data)
    return response
  }
}
