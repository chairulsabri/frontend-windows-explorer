import api from '@/lib/api'
import type { Favorite, ApiResponse } from '@/types'

export const favoritesService = {
  async getAll(): Promise<ApiResponse<Favorite[]>> {
    return api.get('/favorites')
  },

  async add(itemType: 'file' | 'folder', itemId: number): Promise<ApiResponse<Favorite>> {
    return api.post('/favorites', { item_type: itemType, item_id: itemId })
  },

  async remove(id: number): Promise<ApiResponse<void>> {
    return api.delete(`/favorites/${id}`)
  },

  async check(itemType: 'file' | 'folder', itemId: number): Promise<ApiResponse<{ is_favorite: boolean }>> {
    return api.get(`/favorites/check/${itemType}/${itemId}`)
  },
}
