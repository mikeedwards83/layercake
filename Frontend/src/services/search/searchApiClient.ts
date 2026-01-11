import api from '../api'

export interface IWikiPageSearchResult {
  id: string
  title: string
  key: string
}

export interface IWikiPageSearchResponse {
  results: IWikiPageSearchResult[]
}

export class SearchApiClient {
  /**
   * Search for wiki pages by title and reference ID
   * @param referenceId - The reference ID to search within
   * @param title - Optional title search term
   * @param limit - Maximum number of results (1-20, default 5)
   */
  async searchWikiPages(
    referenceId: string,
    title?: string,
    limit: number = 5
  ): Promise<IWikiPageSearchResponse> {
    const params: Record<string, string | number> = {
      referenceId,
      limit: Math.min(Math.max(limit, 1), 20), // Ensure limit is between 1 and 20
    }

    if (title) {
      params.title = title
    }

    const response = await api.get<IWikiPageSearchResponse>('/api/search/wikipages',  params )
    return response
  }

  /**
   * Get the latest wiki pages by reference ID
   * @param referenceId - The reference ID to search within
   * @param limit - Maximum number of results (1-20, default 5)
   */
  async getLatestWikiPages(
    referenceId: string,
    limit: number = 5
  ): Promise<IWikiPageSearchResponse> {
    const params: Record<string, string | number> = {
      referenceId,
      limit: Math.min(Math.max(limit, 1), 20), // Ensure limit is between 1 and 20
    }

    const response = await api.get<IWikiPageSearchResponse>('/api/search/wikipages/latest',  params )
    return response
  }
}
