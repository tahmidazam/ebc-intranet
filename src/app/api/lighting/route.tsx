import { NextResponse } from 'next/server';

interface LightingData {
  [date: string]: {
    sunrise: string;
    sunset: string;
  };
}

export async function GET() {
  try {
    const response = await fetch('https://www.cucbc.org/downloads/lightings.xml', {
      headers: {
        'Accept': 'application/xml, text/xml, */*',
      },
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const text = await response.text();
    const lightingData: LightingData = {};
    const lightingsMatches = text.matchAll(/<lightings>[\s\S]*?<date>(\d{8})<\/date>[\s\S]*?<friendly_down>([^<]+)<\/friendly_down>[\s\S]*?<friendly_up>([^<]+)<\/friendly_up>[\s\S]*?<\/lightings>/g);
    
    for (const match of lightingsMatches) {
      const [, dateStr, timeUp, timeDown] = match;
      if (dateStr && timeUp && timeDown) {
        // Convert date from 20250101 to 2025-01-01
        const year = dateStr.substring(0, 4);
        const month = dateStr.substring(4, 6);
        const day = dateStr.substring(6, 8);
        const formattedDate = `${year}-${month}-${day}`;
        
        lightingData[formattedDate] = {
          sunrise: timeUp.trim(),
          sunset: timeDown.trim(),
        };
      }
    }

    return NextResponse.json(lightingData);
  } catch (error) {
    console.error('Failed to fetch lighting data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lighting data' },
      { status: 500 }
    );
  }
}