import { NextResponse } from 'next/server';

export const runtime = 'edge'; // Use Edge Runtime for better performance

export async function POST(request: Request) {
  try {
    // Consume the stream to measure the upload
    const reader = request.body?.getReader();
    let totalBytes = 0;
    
    if (reader) {
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        totalBytes += value.length;
      }
    } else {
      // Fallback if body is not a stream (shouldn't happen in modern environments)
      const blob = await request.blob();
      totalBytes = blob.size;
    }

    return NextResponse.json({ 
      success: true, 
      received: totalBytes,
      timestamp: Date.now()
    }, {
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Upload failed' }, { status: 500 });
  }
}

export async function OPTIONS() {
  return new NextResponse(null, {
    status: 204,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Content-Length',
      'Access-Control-Max-Age': '86400',
    },
  });
}
