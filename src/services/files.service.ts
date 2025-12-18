import api from '@/lib/api'
import type { File, CreateFileDto, UpdateFileDto, ApiResponse, PaginatedResponse, StorageStats } from '@/types'

export const filesService = {
  async getAll(params?: {
    page?: number
    limit?: number
    search?: string
    sortBy?: string
    sortOrder?: 'ASC' | 'DESC'
  }): Promise<PaginatedResponse<File>> {
    return api.get('/files', { params })
  },

  async getById(id: number): Promise<ApiResponse<File>> {
    return api.get(`/files/${id}`)
  },

  async getByFolder(folderId: number): Promise<ApiResponse<File[]>> {
    return api.get(`/files/folder/${folderId}`)
  },

  async getByExtension(extension: string): Promise<ApiResponse<File[]>> {
    return api.get(`/files/extension/${extension}`)
  },

  async getStats(): Promise<ApiResponse<StorageStats>> {
    return api.get('/files/stats/storage')
  },

  async create(data: CreateFileDto): Promise<ApiResponse<File>> {
    return api.post('/files', data)
  },

  async update(id: number, data: UpdateFileDto): Promise<ApiResponse<File>> {
    return api.put(`/files/${id}`, data)
  },

  async move(id: number, folderId: number | null): Promise<ApiResponse<File>> {
    return api.post(`/files/${id}/move`, { folder_id: folderId })
  },

  async delete(id: number): Promise<ApiResponse<void>> {
    return api.delete(`/files/${id}`)
  },
}
