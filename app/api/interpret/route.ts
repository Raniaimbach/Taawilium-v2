import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { dream, type } = body;

    if (!dream || !type) {
      return NextResponse.json({ error: 'Missing dream or type' }, { status: 400 });
    }

    let promptId = '';
    if (type === 'spiritual') promptId = 'ttdm_v3_islamic_spirit';
    else if (type === 'scientific') promptId = 'ttdm_v3_scientific';
    else if (type === 'comprehensive') promptId = 'ttdm_v3_comprehensive';
    else return NextResponse.json({ error: 'Invalid interpretation type' }, { status: 400 });

    const promptText = `Please interpret this dream (${type} style):\n${dream}`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are a dream interpreter.' },
        { role: 'user', content: promptText },
      ],
    });

    const result = completion.choices[0].message?.content || 'No interpretation found.';

    return NextResponse.json({ result, promptId });
  } catch (error: any) {
    console.error('❌ Error in interpretation:', error.message);
    return NextResponse.json({ result: '❌ حدث خطأ أثناء التفسير.', promptId: 'unknown' }, { status: 500 });
  }
}