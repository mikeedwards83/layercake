import { auth } from "@/firebase";

interface RequestOptions extends RequestInit {
  requiresAuth?: boolean;
}

class ApiClient {
  private baseURL: string;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  private async getAuthToken(): Promise<string | null> {
    const user = auth.currentUser;
    if (!user) {
      return null;
    }
    return await user.getIdToken();
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const { requiresAuth = true, headers = {}, ...fetchOptions } = options;

    const url = `${this.baseURL}${endpoint}`;
    const requestHeaders: HeadersInit = {
      "Content-Type": "application/json",
      ...headers,
    };

    if (requiresAuth) {
      const token = await this.getAuthToken();
      if (!token) {
        throw new Error("Authentication required but no user is logged in");
      }
      requestHeaders["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...fetchOptions,
      headers: requestHeaders,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // For validation errors (400), create an error with the validation details
      if (response.status === 400) {
        const error = new Error("Validation failed") as any;
        error.status = 400;
        error.request = errorData;
        error.validationErrors = errorData.errors;
        throw error;
      }

      throw new Error(
        errorData.message || `HTTP error! status: ${response.status}`
      );
    }

    return await response.json();
  }

  async get<T>(endpoint: string, params?:object, options?: RequestOptions): Promise<T> {
    
    endpoint = this.createUrl(endpoint, params);
    
    return this.request<T>(endpoint, {
      ...options,
      method: "GET",
    });
  }

  createUrl(endpoint:string, params?:any):string{

    if(!params){
      return endpoint;
    }

    const keys = Object.keys(params);

    let seperator = "?";
   
    if(endpoint.indexOf("?") > 0){
      seperator = "&";
    }

    for(let i =0; i< keys.length; i++){
      const key=keys[i];
      endpoint = `${endpoint}${seperator}${encodeURIComponent(key)}=${encodeURIComponent(params[key] as string)}`;
      seperator = "&";
    }

    return endpoint;
  }

  async post<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "POST",
      body: JSON.stringify(data),
    });
  }

  async put<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PUT",
      body: JSON.stringify(data),
    });
  }

  async patch<T>(
    endpoint: string,
    data?: any,
    options?: RequestOptions
  ): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "PATCH",
      body: JSON.stringify(data),
    });
  }

  async delete<T>(endpoint: string, options?: RequestOptions): Promise<T> {
    return this.request<T>(endpoint, {
      ...options,
      method: "DELETE",
    });
  }
}

export default ApiClient;
