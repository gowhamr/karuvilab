import { NextResponse } from 'next/server';

export const runtime = 'nodejs'; // Use Node.js runtime for more stable body handling
export const dynamic = 'force-dynamic';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
  'Access-Control-Max-Age': '86400',
};

export async function POST(request: Request) {
  try {
    // Force consumption of the entire body
    const body = await request.arrayBuffer();
    
    // Validate that we actually received some data
    if (!body || body.byteLength === 0) {
      return NextResponse.json({ success: false, error: 'Empty body' }, { 
        status: 400,
        headers: corsHeaders 
      });
    }

    return new Response(JSON.stringify({ success: true, size: body.byteLength }), {
      status: 200,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json',
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
      },
    });
  } catch (error) {
    console.error('Upload API Error:', error);
    return NextResponse.json({ success: false, error: (error as Error).message }, { 
      status: 500, 
      headers: corsHeaders 
    });
  }
}

export async function OPTIONS() {
  return new Response(null, {
    status: 204,
    headers: corsHeaders,
  });
}
