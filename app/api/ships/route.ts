import {  NextResponse } from "next/server";

export async function GET() {
    const apiKey = process.env.SHIPTRACKING_API_KEY;
    const LOCODE = 'GBPME';
  
    try {
      const res = await fetch(`https://api.myshiptracking.com/api/v2/port/inport?unloco=${LOCODE}`, {
        headers: {
          'Authorization': `Bearer ${apiKey}`
        }
      });
  
      if (!res.ok) {
        throw new Error(`API error: ${res.status}`);
      }
  
      const data = await res.json();
      return NextResponse.json(data);
    } catch (err) {
      const error = err instanceof Error ? err.message : 'An unknown error occurred';
      return NextResponse.json({ error }, { status: 500 });
    }
  }
  