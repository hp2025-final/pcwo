import { writeFile, mkdir } from 'fs/promises'
import { join } from 'path'
import { NextRequest } from 'next/server'

export class FileUploadError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'FileUploadError'
  }
}

export interface UploadResult {
  success: boolean
  fileName?: string
  filePath?: string
  error?: string
}

export async function uploadFile(
  file: File,
  directory: 'products' | 'brands' | 'categories' | 'shops' = 'products'
): Promise<UploadResult> {
  try {
    // Validate file
    if (!file) {
      throw new FileUploadError('No file provided')
    }

    // Check file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      throw new FileUploadError('File size exceeds 5MB limit')
    }

    // Check file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      throw new FileUploadError('Invalid file type. Only JPEG, PNG, and WebP are allowed')
    }

    // Generate unique filename
    const timestamp = Date.now()
    const originalName = file.name.replace(/[^a-zA-Z0-9.-]/g, '')
    const extension = originalName.split('.').pop()
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${extension}`

    // Create upload directory
    const uploadDir = join(process.cwd(), 'public', 'uploads', directory)
    await mkdir(uploadDir, { recursive: true })

    // Write file
    const filePath = join(uploadDir, fileName)
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    return {
      success: true,
      fileName,
      filePath: `/uploads/${directory}/${fileName}`
    }
  } catch (error) {
    console.error('File upload error:', error)
    return {
      success: false,
      error: error instanceof FileUploadError 
        ? error.message 
        : 'Failed to upload file'
    }
  }
}

export async function handleFileUpload(request: NextRequest): Promise<UploadResult> {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const directory = (formData.get('directory') as string) || 'products'

    if (!file) {
      return {
        success: false,
        error: 'No file provided'
      }
    }

    return await uploadFile(file, directory as 'products' | 'brands' | 'categories')
  } catch (error) {
    console.error('Handle file upload error:', error)
    return {
      success: false,
      error: 'Failed to process file upload'
    }
  }
}

export function deleteFile(): Promise<void> {
  // Implementation for file deletion if needed
  return Promise.resolve()
}
