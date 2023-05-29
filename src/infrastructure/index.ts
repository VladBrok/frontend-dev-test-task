// TODO
class InfrastructureClient {
  async get<T>(url: string): Promise<T> {
    return JSON.parse(localStorage.getItem(url) || "{}")
  }

  async post<D, T>(url: string, data: D): Promise<T> {
    return JSON.parse(localStorage.getItem(url) || "{}")
  }

  async put<D, T>(url: string, data: D): Promise<T> {
    return JSON.parse(localStorage.getItem(url) || "{}")
  }

  async delete<T>(url: string) {
    return JSON.parse(localStorage.getItem(url) || "{}")
  }
}

export const Client = new InfrastructureClient()
