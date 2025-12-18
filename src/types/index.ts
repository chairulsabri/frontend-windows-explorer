export interface Folder {
  id: number
  name: string
  path: string
  parent_id: number | null
  created_at: string
  updated_at: string
  children?: Folder[]
}

export interface File {
  id: number
  name: string
  path: string
  folder_id: number | null
  extension: string | null
  size: number
  mime_type: string | null
  created_at: string
  updated_at: string
}

export interface Favorite {
  id: number
  item_type: 'file' | 'folder'
  item_id: number
  name: string
  path: string
  created_at: string
}

export interface CreateFolderDto {
  name: string
  path: string
  parent_id?: number | null
}

export interface UpdateFolderDto {
  name?: string
  path?: string
  parent_id?: number | null
}

export interface CreateFileDto {
  name: string
  path: string
  folder_id?: number | null
  extension?: string | null
  size?: number
  mime_type?: string | null
}

export interface UpdateFileDto {
  name?: string
  path?: string
  folder_id?: number | null
  extension?: string | null
  size?: number
  mime_type?: string | null
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  success: boolean
  data: T[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

export interface StorageStats {
  total_size: number
  total_files: number
  by_extension: {
    extension: string
    count: number
    total_size: number
  }[]
}
