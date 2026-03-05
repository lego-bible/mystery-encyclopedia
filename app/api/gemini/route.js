import { NextResponse } from 'next/server';

export async function POST(req) {
    try {
        const { query, instruction, userApiKey } = await req.json();
        
        // 사용자가 입력한 키를 우선 사용하고, 없을 경우 서버 환경변수를 확인합니다.
        const apiKey = userApiKey || process.env.GEMINI_API_KEY;

        if (!apiKey) {
            return NextResponse.json({ 
                error: 'API 키가 필요합니다. 로그인 화면에서 키를 입력해주세요.' 
            }, { status: 401 });
        }

        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: instruction }] },
                contents: [{ parts: [{ text: `대상: ${query}\n위 대상에 대해 상세하고 전문적인 분석 보고서를 한국어로 작성해 주세요.` }] }]
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            // 키가 잘못되었을 경우 처리
            if (response.status === 400 || response.status === 403) {
                throw new Error('유효하지 않은 API 키입니다. 키를 다시 확인해주세요.');
            }
            throw new Error(errorData.error?.message || 'API 요청 실패');
        }

        const data = await response.json();
        const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
        
        return NextResponse.json({ text });

    } catch (error) {
        console.error("Gemini API Error:", error);
        return NextResponse.json({ error: error.message || '서버 통신 중 오류가 발생했습니다.' }, { status: 500 });
    }
}