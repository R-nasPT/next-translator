import axios from "axios";

//สามารถ ใส่ token ได้หลายวิธี

export const axiosInstance = axios.create({
  baseURL: process.env.IFP_HOST,
  headers: {
    "Content-Type": "application/json",
    // Authorization: `Bearer ${process.env.IFP_TOKEN}`,
    // Authorization: `Bearer 1pzYTQUJynEjFOesdRULww0ViD8KX7-Pm5K9InXrL7I5xEtfsqkHru8xrSXM7jClXdiPW33ILfY9bLvNEGOD1lorOEZhjmLevTYijvhg5R-oYqafMrBI1NMHGTVgK7EbmA7l6V`,
  },
});

export function createAxiosInstance(token?: string) {

  // if (token) {
  //   instance.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  // }

  axiosInstance.interceptors.request.use(
    async (config) => {
      console.log(11111111111111111111);
      console.log(token);

      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
        //config.headers.Authorization = `Bearer ${token}`;
      }

      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (!error.response) {
        console.error("Network error or server not responding");
      } else {
        console.error(
          `API error: ${error.response.status} - ${error.response.statusText}`
        );
      }
      return Promise.reject(error);
    }
  );

  return axiosInstance;
}

export const strapiUrl = axios.create({
  baseURL: process.env.NEXT_PUBLIC_STRAPI_HOST, //<-- ต้องถูกประกาศด้วยคำนำหน้าว่า NEXT_PUBLIC_ หากต้องการให้สามารถเข้าถึงได้จากฝั่งไคลเอนต์
  headers: {
    "Content-Type": "application/json",
  },
});

// =================================================== The New Version ===================================================

import {
  AUTOMATION_HOST,
  IFP_FUNCTIONS_HOST,
  IFP_HOST,
} from '@/config/env';

type RequestConfig = {
  headers?: Record<string, string>;
  method?: string;
  body?: unknown;
  params?: Record<string, unknown>;
};

type ApiResponse<T> = {
  data: T;
  status: number;
  response: Response;
};

export class HttpService {
  private baseURL: string;
  private headers: Record<string, string>;
  private token?: string;

  constructor(baseURL: string, headers: Record<string, string> = {}) {
    this.baseURL = baseURL;
    this.headers = {
      'Content-Type': 'application/json',
      ...headers,
    };
  }

  setToken(token: string) {
    this.token = token;
  }

  private buildUrl(endpoint: string, params?: Record<string, unknown>): string {
    const url = new URL(`${this.baseURL}${endpoint}`);

    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          url.searchParams.append(key, value.toString());
        }
      });
    }

    return url.toString();
  }

  private async request<T>(
    endpoint: string,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T> | Response> {
    const url = this.buildUrl(endpoint, config.params);
    const headers = {
      ...this.headers,
      ...config.headers,
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };

    const response = await fetch(url, {
      method: config.method || 'GET',
      headers,
      ...(config.body ? { body: config.body instanceof FormData ? config.body : JSON.stringify(config.body) } : {}),
    });

    if (!response.ok) {
      return response;
    }

    const data = await response.json();
    return { data, status: response.status, response };
  }

  async get<T>(
    endpoint: string,
    config: { params?: Record<string, unknown>; headers?: Record<string, string> } = {}
  ): Promise<ApiResponse<T> | Response> {
    return this.request<T>(endpoint, {
      method: 'GET',
      params: config.params,
      headers: config.headers,
    });
  }

  async post<T>(
    endpoint: string,
    data?: unknown,
    options: { headers?: Record<string, string>; params?: Record<string, unknown> } = {}
  ): Promise<ApiResponse<T> | Response> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data,
      headers: options.headers,
      params: options.params,
    });
  }

  async put<T>(
    endpoint: string,
    data: unknown,
    options: { headers?: Record<string, string>; params?: Record<string, unknown> } = {}
  ): Promise<ApiResponse<T> | Response> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data,
      headers: options.headers,
      params: options.params,
    });
  }
}

// Create an instance of HttpService with the IFP_HOST base URL
export const httpService = new HttpService(IFP_HOST!);

// Utility function: Configures the HttpService instance with a provided token
/**
 * Sets an authentication token for the HttpService instance.
 *
 * @param {string} [token] - Optional token to set.
 * @returns {HttpService} - Configured HttpService instance.
 */
export function configureHttpServiceWithToken(token?: string) {
  if (token) {
    httpService.setToken(token);
  }
  return httpService;
}

// API request handlers: Wrapper functions for different base URLs
/**
 * Fetch data from IFP_HOST
 */
export async function fetchIFPHost(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  const url = `${IFP_HOST}${input}`;
  return fetch(url, init);
}

/**
 * Fetch data from IFP_FUNCTIONS_HOST
 */
export async function ifpFunctionsApi(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  const url = `${IFP_FUNCTIONS_HOST}${input}`;
  return fetch(url, init);
}

/**
 * Fetch data from AUTOMATION_HOST
 */
export async function automationApi(
  input: string | URL | globalThis.Request,
  init?: RequestInit
): Promise<Response> {
  const url = `${AUTOMATION_HOST}${input}`;
  return fetch(url, init);
}
