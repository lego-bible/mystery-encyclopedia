'use client';

import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { 
  User, Sparkles, Search, Eye, Loader2, Ghost, ArrowLeft, 
  Copy, Trash2, Fingerprint, AlertTriangle, FileText, Key, LogOut 
} from 'lucide-react';

const AUTHOR_LIST = [
    "에드거 앨런 포", "아서 코난 도일", "아가사 크리스티", "모리스 르블랑", "엘러리 퀸",
    "레이먼드 챈들러", "대실 해밋", "에도가와 란포", "히가시노 게이고", "미야베 미유키"
    // 필요시 작가 리스트 추가
];

const THEME_LIST = [
    "본격 추리 (Honkaku)", "신본격 추리 (Shin-honkaku)", "하드보일드 (Hardboiled)",
    "밀실 살인 (Locked-room Mystery)", "서술 트릭 (Unreliable Narrator)"
    // 필요시 테마 리스트 추가
];

export default function Home() {
    const [view, setView] = useState('login');
    const [userApiKey, setUserApiKey] = useState('');
    const [selectedAuthor, setSelectedAuthor] = useState('');
    const [customAuthor, setCustomAuthor] = useState('');
    const [selectedTheme, setSelectedTheme] = useState('');
    const [customTheme, setCustomTheme] = useState('');
    const [resultContent, setResultContent] = useState('');
    const [targetName, setTargetName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [copySuccess, setCopySuccess] = useState(false);

    useEffect(() => {
        const savedKey = localStorage.getItem('mystery_app_key');
        if (savedKey) {
            setUserApiKey(savedKey);
            setView('home');
        }
    }, []);

    // TypeScript 에러 해결: e 변수에 FormEvent 타입 명시
    const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (userApiKey.trim().length < 20) {
            alert('올바른 API 키 형식이 아닙니다.');
            return;
        }
        localStorage.setItem('mystery_app_key', userApiKey);
        setView('home');
    };

    const handleLogout = () => {
        localStorage.removeItem('mystery_app_key');
        setUserApiKey('');
        setView('login');
    };

    // TypeScript 에러 해결: query와 isAuthor에 타입 명시
    const handleSearch = async (query: string, isAuthor: boolean) => {
        if (!query) return;
        
        setErrorMessage('');
        setView('loading');
        setTargetName(query);

        const instruction = isAuthor 
            ? "당신은 추리 소설 비평 거장입니다. 요청받은 작가에 대해 심층 백과사전 항목을 작성하세요. 1.생애 2.작품세계 3.대표작 4.의의를 포함하고 마크다운을 사용하세요."
            : "당신은 추리 소설 이론 전문가입니다. 해당 주제에 대해 상세한 백과사전 항목을 작성하세요. 1.정의 2.특징 3.대표사례 4.의의를 포함하고 마크다운을 사용하세요.";

        try {
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    query, 
                    instruction, 
                    userApiKey
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || '알 수 없는 오류');
            }

            setResultContent(data.text);
            setView('result');

        } catch (err: any) { // err에 any 타입 추가
            setErrorMessage(err.message);
            setView('error');
        }
    };

    const copyToClipboard = async () => {
        try {
            await navigator.clipboard.writeText(resultContent);
            setCopySuccess(true);
            setTimeout(() => setCopySuccess(false), 2000);
        } catch (err) {
            alert('복사에 실패했습니다.');
        }
    };

    // --- 렌더링: 로그인 화면 ---
    if (view === 'login') {
        return (
            <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
                <div className="max-w-md w-full bg-slate-800 p-8 rounded-2xl shadow-2xl border border-slate-700 fade-in">
                    <div className="text-center mb-8">
                        <Fingerprint className="w-16 h-16 text-rose-600 mx-auto mb-4" />
                        <h1 className="text-3xl font-black text-white italic tracking-tighter uppercase">
                            추리 소설 <span className="text-rose-600">백과사전</span>
                        </h1>
                        <p className="text-slate-400 text-sm mt-2">서비스 이용을 위해 Gemini API 키가 필요합니다.</p>
                    </div>
                    
                    <form onSubmit={handleLogin} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Google Gemini API Key</label>
                            <div className="relative">
                                <Key className="absolute left-4 top-4 w-5 h-5 text-slate-500" />
                                <input 
                                    type="password" 
                                    value={userApiKey}
                                    onChange={(e) => setUserApiKey(e.target.value)}
                                    placeholder="AIzaSy..."
                                    className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl py-4 pl-12 pr-4 text-white focus:border-rose-600 outline-none transition-all"
                                    required
                                />
                            </div>
                        </div>
                        <button type="submit" className="w-full bg-rose-700 hover:bg-rose-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg">
                            백과사전 접속하기
                        </button>
                    </form>
                    <p className="text-[10px] text-slate-500 mt-6 text-center leading-relaxed">
                        * 입력하신 키는 브라우저에만 저장되며 외부로 유출되지 않습니다.<br/>
                        Google AI Studio에서 무료로 키를 발급받으실 수 있습니다.
                    </p>
                </div>
            </div>
        );
    }

    // --- 렌더링: 메인 콘텐츠 ---
    return (
        <div className="relative min-h-screen p-4 md:p-12 bg-[#0f172a] text-[#e2e8f0]">
            <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(circle_at_center,_transparent_0%,_rgba(0,0,0,0.6)_100%)]"></div>
            
            <div className="relative max-w-4xl mx-auto">
                <header className="mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div className="text-center md:text-left">
                        <h1 className="text-4xl md:text-5xl font-black tracking-tighter text-white uppercase italic">
                            추리 소설 <span className="text-rose-600">백과사전</span>
                        </h1>
                        <p className="font-mono text-slate-500 text-xs tracking-widest uppercase mt-1">The Ultimate Mystery Encyclopedia</p>
                    </div>
                    <button onClick={handleLogout} className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 px-4 py-2 rounded-full text-xs font-bold transition-all border border-slate-700">
                        <LogOut className="w-4 h-4" /> 로그아웃 (키 파기)
                    </button>
                </header>

                {view === 'error' && (
                    <div className="bg-red-900/80 border-l-4 border-red-500 p-6 mb-8 text-white rounded fade-in">
                        <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
                            <AlertTriangle className="w-6 h-6" /> 시스템 오류
                        </h3>
                        <p className="mb-4 text-red-200">{errorMessage}</p>
                        <button onClick={() => setView('home')} className="bg-red-950 px-4 py-2 hover:bg-red-800 transition-colors">목차로 이동</button>
                    </div>
                )}

                {view === 'home' && (
                    <div className="grid gap-10 fade-in">
                        <section className="bg-[#f4f1ea] text-[#2c2c2c] rounded-sm shadow-2xl border-l-8 border-rose-800 p-8 md:p-12 relative overflow-hidden" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")'}}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-rose-800 text-white rounded-full"><User className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-bold uppercase tracking-tight">거장 백과 (Authors)</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                                <div>
                                    <label className="block font-bold mb-2 text-slate-500 uppercase italic text-xs">명단 선택</label>
                                    <select value={selectedAuthor} onChange={e => {setSelectedAuthor(e.target.value); setCustomAuthor('');}} className="w-full p-4 bg-white/70 border-2 border-slate-300 rounded-none outline-none focus:border-rose-700">
                                        <option value="">-- 작가 이름 선택 --</option>
                                        {AUTHOR_LIST.map(a => <option key={a} value={a}>{a}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2 text-slate-500 uppercase italic text-xs">직접 검색</label>
                                    <input type="text" value={customAuthor} onChange={e => {setCustomAuthor(e.target.value); setSelectedAuthor('');}} placeholder="작가를 입력하십시오..." className="w-full p-4 bg-white/70 border-2 border-slate-300 rounded-none outline-none focus:border-rose-700" />
                                </div>
                            </div>
                            <button onClick={() => handleSearch(customAuthor || selectedAuthor, true)} className="mt-10 w-full bg-slate-900 text-white font-bold py-5 px-8 flex items-center justify-center gap-3 hover:bg-rose-900 transition-all shadow-xl">
                                <Eye className="w-6 h-6" /> <span>백과 항목 열기</span>
                            </button>
                        </section>

                        <section className="bg-slate-800 border-t-8 border-indigo-900 p-8 md:p-12 shadow-2xl relative">
                            <div className="flex items-center gap-3 mb-8">
                                <div className="p-2 bg-indigo-900 text-white rounded-full"><Sparkles className="w-6 h-6" /></div>
                                <h2 className="text-3xl font-bold uppercase tracking-tight text-slate-100">테마 백과 (Themes)</h2>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 font-mono text-sm">
                                <div>
                                    <label className="block font-bold mb-2 text-slate-400 uppercase italic text-xs">분류 선택</label>
                                    <select value={selectedTheme} onChange={e => {setSelectedTheme(e.target.value); setCustomTheme('');}} className="w-full p-4 bg-slate-700 border-2 border-slate-600 text-white outline-none focus:border-indigo-500">
                                        <option value="">-- 주제/트릭 선택 --</option>
                                        {THEME_LIST.map(t => <option key={t} value={t} className="bg-slate-800">{t}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block font-bold mb-2 text-slate-400 uppercase italic text-xs">키워드 검색</label>
                                    <input type="text" value={customTheme} onChange={e => {setCustomTheme(e.target.value); setSelectedTheme('');}} placeholder="키워드를 입력하십시오..." className="w-full p-4 bg-slate-700 border-2 border-slate-600 text-white outline-none focus:border-indigo-500" />
                                </div>
                            </div>
                            <button onClick={() => handleSearch(customTheme || selectedTheme, false)} className="mt-10 w-full bg-indigo-900 text-white font-bold py-5 px-8 flex items-center justify-center gap-3 hover:bg-indigo-800 transition-all shadow-xl">
                                <Search className="w-6 h-6" /> <span>백과 데이터 분석 시작</span>
                            </button>
                        </section>
                    </div>
                )}

                {view === 'loading' && (
                    <div className="flex flex-col items-center justify-center py-32 text-center fade-in">
                        <div className="relative mb-8">
                            <Loader2 className="w-20 h-20 text-rose-700 animate-spin" />
                            <Ghost className="w-8 h-8 text-rose-200 absolute inset-0 m-auto animate-pulse" />
                        </div>
                        <h3 className="text-xl font-black text-white uppercase tracking-widest">백과 항목 열람 중...</h3>
                        <p className="text-slate-500 text-sm mt-2 italic">진실에 다가가는 중입니다.</p>
                    </div>
                )}

                {view === 'result' && (
                    <div className="fade-in">
                        <div className="flex flex-wrap gap-3 mb-6 sticky top-4 z-50">
                            <button onClick={() => setView('home')} className="bg-slate-100 text-slate-900 px-4 py-2 hover:bg-white shadow-lg flex items-center gap-2 border-b-4 border-slate-400 transition-all">
                                <ArrowLeft className="w-4 h-4" /> 목차로 귀환
                            </button>
                            <button onClick={copyToClipboard} className="bg-rose-800 text-white px-4 py-2 hover:bg-rose-700 shadow-lg flex items-center gap-2 border-b-4 border-rose-950 transition-all">
                                <Copy className="w-4 h-4" /> 항목 복제
                            </button>
                            {copySuccess && <span className="ml-auto bg-emerald-600 text-white px-4 py-2 rounded text-xs font-bold animate-bounce">복제 완료</span>}
                        </div>

                        <div className="bg-[#fdf6e3] text-[#1a1a1a] shadow-2xl border-8 border-double border-[#8b7d6b] p-8 md:p-16 relative mb-20" style={{backgroundImage: 'url("https://www.transparenttextures.com/patterns/parchment.png")'}}>
                            <div className="flex items-center gap-4 border-b-2 border-slate-300 pb-8 mb-10">
                                <FileText className="w-12 h-12 text-slate-400" />
                                <div>
                                    <span className="font-mono text-slate-500 text-[10px] block uppercase tracking-wider">Entry ID: {Math.floor(Math.random()*999999)}</span>
                                    <h2 className="text-2xl md:text-4xl font-black tracking-tight m-0">{targetName}</h2>
                                </div>
                            </div>
                            
                            <div 
                                className="prose max-w-none text-sm md:text-lg leading-relaxed font-serif"
                                dangerouslySetInnerHTML={{ __html: marked.parse(resultContent) as string }} 
                            />
                        </div>
                    </div>
                )}
            </div>
            
            <footer className="text-center py-10 opacity-20 font-mono text-[10px] tracking-tighter text-white">
                PUBLISHED BY MYSTERY ARCHIVES // SECURED BY USER KEY // VER:3.0-BYOK
            </footer>
        </div>
    );
}