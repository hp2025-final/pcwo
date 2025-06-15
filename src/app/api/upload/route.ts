import { NextRequest, NextResponse } from 'next/server'
import { handleFileUpload } from '@/lib/upload'

export async function POST(request: NextRequest) {
  try {
    const result = await handleFileUpload(request)
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        data: {
          fileName: result.fileName,
          filePath: result.filePath
        }
      })
    } else {
      return NextResponse.json(
        { 
          success: false, 
          error: result.error 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error('Upload API error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to upload file' 
      },
      { status: 500 }
    )
  }
}
