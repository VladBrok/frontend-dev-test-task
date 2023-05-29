import axios, { AxiosRequestConfig, AxiosResponse } from "axios"
import { delay } from "../lib/delay"

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
})

const ARTIFICIAL_DELAY_MS = 500

axiosInstance.interceptors.request.use(async (config) => {
  await delay(ARTIFICIAL_DELAY_MS)
  return config
})

class InfrastructureClient {
  async get<T>(
    url: string,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await axiosInstance.get<T>(url, config)
    return response
  }

  async post<D, T>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await axiosInstance.post<T>(url, data, config)
    return response
  }

  async put<D, T>(
    url: string,
    data: D,
    config?: AxiosRequestConfig,
  ): Promise<AxiosResponse<T>> {
    const response = await axiosInstance.put<T>(url, data, config)
    return response
  }

  async delete<T>(url: string, config?: AxiosRequestConfig) {
    const response = await axiosInstance.delete<T>(url, config)
    return response
  }
}

export const Client = new InfrastructureClient()
