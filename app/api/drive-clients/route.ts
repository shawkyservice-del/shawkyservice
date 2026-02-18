import { NextResponse } from 'next/server'
import { google } from 'googleapis'
import path from 'path'

// Drive folder IDs for each area
const AREA_FOLDERS: Record<number, string> = {
  1: '1gbY2L__atgj4ldTAst5kt0MUk-UPECua', // العاصمة الإدارية
  2: '1FQx824rbptTI5XnerU1yL8jgr-exNJ28', // القاهرة الجديدة
  3: '1rjRXzPYnBRvH781XMREKmT4a1lw4ksib', // التجمع الخامس
  4: '1PuuDkHNHADwikE14_cycaDjNeXJk3ia5', // وسط
  5: '16tr64CqiMXODWqet3foBkX3s5LUMu7Pj', // أكتوبر
  6: '14RA5_-P6fG06u39LRpoYy_H9kTA9Xr1d', // الأقاليم
}

async function getDriveService() {
  try {
    // Try to use environment variable first (for Vercel)
    if (process.env.GOOGLE_CREDENTIALS) {
      const credentials = JSON.parse(process.env.GOOGLE_CREDENTIALS)
      const auth = new google.auth.GoogleAuth({
        credentials,
        scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      })
      const authClient = await auth.getClient()
      return google.drive({ version: 'v3', auth: authClient as any })
    }
    
    // Fallback to file (for local development)
    const credentialsPath = path.join(process.cwd(), 'google-credentials.json')
    const auth = new google.auth.GoogleAuth({
      keyFile: credentialsPath,
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
    })
    
    const authClient = await auth.getClient()
    return google.drive({ version: 'v3', auth: authClient as any })
  } catch (error) {
    console.error('Error initializing Drive service:', error)
    throw error
  }
}

async function getClientFoldersInArea(drive: any, folderId: string) {
  try {
    const response = await drive.files.list({
      q: `'${folderId}' in parents and mimeType='application/vnd.google-apps.folder' and trashed=false`,
      fields: 'files(id, name)',
      pageSize: 1000,
    })
    
    return response.data.files || []
  } catch (error) {
    console.error(`Error fetching folders for ${folderId}:`, error)
    return []
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const areaId = searchParams.get('areaId')
    
    const drive = await getDriveService()
    
    if (areaId) {
      // Get clients for specific area
      const folderId = AREA_FOLDERS[parseInt(areaId)]
      if (!folderId) {
        return NextResponse.json({ success: false, error: 'Invalid area ID' })
      }
      
      const folders = await getClientFoldersInArea(drive, folderId)
      
      const clients = folders.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        code: folder.name.split(' - ')[0] || folder.name,
        areaId: parseInt(areaId),
        filesCount: 0,
      }))
      
      return NextResponse.json({ success: true, clients, count: clients.length })
    }
    
    // Get all clients from all areas
    const allClients: any[] = []
    
    for (const [areaIdNum, folderId] of Object.entries(AREA_FOLDERS)) {
      const folders = await getClientFoldersInArea(drive, folderId)
      const clients = folders.map((folder: any) => ({
        id: folder.id,
        name: folder.name,
        code: folder.name.split(' - ')[0] || folder.name,
        areaId: parseInt(areaIdNum),
        filesCount: 0,
      }))
      allClients.push(...clients)
    }
    
    return NextResponse.json({ 
      success: true, 
      clients: allClients,
      totalCount: allClients.length,
      byArea: Object.keys(AREA_FOLDERS).reduce((acc, areaId) => {
        acc[areaId] = allClients.filter(c => c.areaId === parseInt(areaId)).length
        return acc
      }, {} as Record<string, number>)
    })
    
  } catch (error) {
    console.error('Error in drive-clients API:', error)
    return NextResponse.json({ 
      success: false, 
      error: 'Failed to fetch clients from Drive',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
