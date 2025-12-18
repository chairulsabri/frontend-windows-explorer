import api from '@/lib/api'
import type { Folder, CreateFolderDto, UpdateFolderDto, ApiResponse, PaginatedResponse } from '@/types'

export const foldersService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  }): Promise<PaginatedResponse<Folder>> {
    return api.get('/folders', { params })
  },

  async getById(id: number): Promise<ApiResponse<Folder>> {
    return api.get(`/folders/${id}`)
  },

  async getContents(id: number): Promise<ApiResponse<{ folders: Folder[]; files: any[] }>> {
    return api.get(`/folders/${id}/contents`)
  },

  async getTree(): Promise<ApiResponse<Folder[]>> {
    return api.get('/folders/tree/all')
  },

  async create(data: CreateFolderDto): Promise<ApiResponse<Folder>> {
    return api.post('/folders', data)
  },

  async update(id: number, data: UpdateFolderDto): Promise<ApiResponse<Folder>> {
    return api.put(`/folders/${id}`, data)
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete(`/folders/${id}`)
  },
}
