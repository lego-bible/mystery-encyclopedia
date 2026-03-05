'use client';

import { useState, useEffect } from 'react';
import { marked } from 'marked';
import { 
  User, Sparkles, Search, Eye, Loader2, Ghost, ArrowLeft, 
  Copy, Trash2, Fingerprint, AlertTriangle, FileText, Key, LogOut 
} from 'lucide-react';

const AUTHOR_LIST = [
    "에드거 앨런 포", "아서 코난 도일", "아가사 크리스티", "모리스 르블랑", "엘러리 퀸",
    "레이먼드 챈들러", "대실 해밋", "조르주 심농", "에도가와 란포", "히가시노 게이고",
    "미야베 미유키", "요코미조 세이시", "시마다 소지", "도로시 L. 세이어스", "P. D. 제임스",
    "루스 렌들", "퍼트리샤 하이스미스", "로스 맥도널드", "에드 맥베인", "로렌스 블록",
    "마이클 코넬리", "제프리 디버", "이안 랜킨", "조 네스뵈", "스티그 라르손",
    "헤닝 만켈", "안드레아 카밀레리", "넬레 노이하우스", "기욤 뮈소", "베르나르 베르베르",
    "움베르토 에코", "가스통 르루", "G. K. 체스터턴", "S. S. 반 다인", "코넬 울리치",
    "아이작 아시모프", "프레드릭 브라운", "리 차일드", "더글러스 애덤스", "스티븐 킹",
    "할런 코벤", "존 그리샴", "스콧 터로", "댄 브라운", "기리노 나츠오", "미나토 가나에",
    "오츠이치", "찬호께이", "마츠모토 세이초", "아유카와 테츠야", "다카기 아키미츠",
    "교구쿠 나츠히코", "아리스가와 아리스", "노리즈키 린타로", "우타노 쇼고", "미치오 슈스케",
    "이사카 코타로", "치넨 미키토", "온다 리쿠", "모리 히로시", "니시자와 야스히코",
    "나카야마 시치리", "요네자와 호노부", "윌리엄 윌키 콜린스", "에밀 가보리오", "E. C. 벤틀리",
    "앤서니 버클리", "존 딕슨 카", "나이오 마쉬", "마저리 알링엄", "렉스 스타우트",
    "얼 스탠리 가드너", "조세핀 테이", "제임스 M. 케인", "짐 톰슨", "엘모어 레너드",
    "조지 V. 히긴스", "제임스 엘로이", "데니스 루헤인", "조지 펠레카노스", "데이비드 피스",
    "돈 윈슬로", "할런 엘리슨", "피터 러브지", "콜린 덱스터", "레지널드 힐",
    "피터 로빈슨", "찰스 윌포드", "로버트 B. Parker", "수 그래프턴", "사라 패러츠키",
    "자넷 이바노비치", "카린 슬로터", "길리언 플린", "폴라 호킨스", "B. A. 패리스",
    "피터 스완슨", "앤서니 호로비츠", "정유정", "김영하", "도진기", "서미애",
    "제임스 패터슨", "데이비드 발다치", "조너선 켈러먼", "페이 켈러먼", "리사 가드너",
    "샌드라 브라운", "제프리 아처", "로버트 해리스", "존 르카레", "프레더릭 포사이드",
    "켄 폴릿", "톰 클랜시", "앨리스테어 매클레인", "데스몬드 배글리", "잭 히긴스",
    "에릭 앰블러", "그레이엄 Greene", "서머싯 몸", "토마스 해리스", "아이라 레빈",
    "다프네 뒤 모리에", "셜리 잭슨", "퍼트리샤 콘웰", "캐시 라이크스", "테스 게릿슨",
    "제임스 롤린스", "더글러스 프레스턴", "링컨 차일드", "클라이브 커슬러", "스티브 베리",
    "빈스 플린", "다니엘 실바", "믹 헤런", "리처드 오스만", "크리스 휘태커",
    "스튜어트 터턴", "에드워드 케어리", "마가렛 애트우드", "토니 힐러먼", "C. J. 박스",
    "크레이그 존슨", "윌리엄 켄트 크루거", "제임스 리 버크", "월터 모슬리", "체스터 하임스",
    "리처드 라이트", "니콜라스 블레이크", "에드먼드 크리스핀", "마이클 이네스", "크리스티아나 브랜드",
    "헬렌 매킨스", "메리 히긴스 클라크", "샤를로테 링크", "세바스찬 피섹", "피에르 르메트르",
    "베르나르 미니에", "프랑크 틸리에", "프레드 바르가스", "장 크리스토프 그랑제", "카를로스 루이스 사폰",
    "아르투로 페레스 레베르테", "하비에르 마리아스", "조르조 팔레티", "유 네스뵈", "카린 포숨",
    "아르날두르 인드리다손", "아사 라르손", "리사 마르클룬드", "윌리엄 마킬바니", "데니스 미나",
    "루이즈 페니", "피터 메이", "앤 클리브스", "밸 맥더미드", "M. C. 비턴",
    "엘리자베스 조지", "데보라 크롬비", "찰스 토드", "재클린 윈스피어", "수잔 힐",
    "T. 제퍼슨 파커", "로버트 크레이스", "조너선 레뎀", "마이클 샤본",
    "도널드 E. 웨스트레이크", "로렌스 샌더스", "넬슨 드밀", "조셉 웜보", "조 R. 랜스데일",
    "앤드루 바흐스", "제임스 그레이디", "막스 알랑 콜린스", "미키 스필레인", "어빙 월리스",
    "시드니 셸던", "로버트 러들럼", "토마스 페리", "제임스 홀먼", "잭 케첨",
    "김성종", "김내성", "방구석", "추송웅", "이우혁", "전건우", "조영주", "홍선주",
    "박현주", "윤자영", "송시우", "최혁곤", "박하익", "황희", "나혁진", "백휴",
    "공진호", "김재희", "계창훈", "임지형", "김상현", "최민호", "정명섭", "곽재식",
    "빌 밸린저", "앤드류 클라반", "피터 블래티", "윌리엄 피터 블래티", "로버트 블로크",
    "프레드릭 포사이스", "제임스 그레디", "리처드 스타크", "도널드 웨스트레이크",
    "브라이언 가필드", "찰스 브론슨", "데이비드 모렐", "저스틴 스콧", "A. J. 퀴넬",
    "패트릭 쥐스킨트", "조지프 콘래드", "D. M. 드와이어", "딘 쿤츠", "리처드 매드슨",
    "레이 브래드버리", "H. P. 러브크래프트"
];

const THEME_LIST = [
    "본격 추리 (Honkaku)", "신본격 추리 (Shin-honkaku)", "하드보일드 (Hardboiled)", "사회파 추리 (Social Mystery)",
    "코지 미스터리 (Cozy Mystery)", "밀실 살인 (Locked-room Mystery)", "알리바이 트릭 (Alibi Trick)",
    "서술 트릭 (Unreliable Narrator)", "다잉 메시지 (Dying Message)", "클로즈드 서클 (Closed Circle)",
    "안락의자 탐정 (Armchair Detective)", "안티 미스터리 (Anti-Mystery)", "경찰 소설 (Police Procedural)",
    "법정 스릴러 (Legal Thriller)", "의료 미스터리 (Medical Mystery)", "역사 미스터리 (Historical Mystery)",
    "심리 스릴러 (Psychological Thriller)", "첩보 소설 (Spy Fiction)", "하이 테크 미스터리 (High-tech)",
    "누아르 (Noir)", "하드보일드 탐정 (Hardboiled PI)", "후더닛 (Whodunit)", "하우더닛 (Howdunit)",
    "와이더닛 (Whydunit)", "역추리 (Inverted Detective)", "괴도물 (Gentleman Thief)", "레드 헤링 (Red Herring)",
    "팜므 파탈 (Femme Fatale)", "아마추어 탐정 (Amateur Sleuth)", "탐정의 조수 (Sidekick)",
    "연쇄 살인마 (Serial Killer)", "범죄 심리학 (Criminal Psychology)", "법의학 수사 (Forensics)",
    "프로파일링 (Profiling)", "완벽한 범죄 (Perfect Crime)", "열차 미스터리 (Train Mystery)",
    "저택 미스터리 (Manor House Mystery)", "무인도 미스터리 (Island Mystery)", "도서관 미스터리 (Bibliomystery)",
    "일상 미스터리 (Ordinary Life)", "청춘 미스터리 (YA Mystery)", "골든 에이지 (Golden Age)",
    "콜드 케이스 (Cold Case)", "서바이벌 게임 (Survival Game)", "화이트 콜라 범죄 (White-collar Crime)",
    "사이코패스 분석", "서스펜스 (Suspense)", "도서 미스터리 (Library Mystery)", "미스터리 속의 유머",
    "초자연 미스터리", "몬스터 스릴러", "도플갱어 트릭", "교환 살인 (Exchange Murder)", "1인 2역 트릭",
    "시간차 트릭", "지형지물 트릭", "독살 미스터리", "암호 해독 (Cryptography)", "기억 상실 미스터리",
    "수도원 미스터리", "감옥 미스터리", "대학 캠퍼스 미스터리", "골동품점 미스터리", "정신병원 미스터리",
    "변격 추리 (Henkaku)", "네오 누아르 (Neo-Noir)", "하드보일드 느와르", "하드고어 스릴러", "데스 게임 (Death Game)",
    "복수극 (Revenge Drama)", "도난 사건 (Heist)", "정치 스릴러", "에코 스릴러", "테크노 스릴러",
    "우주 미스터리 (Space Mystery)", "평행 세계 미스터리", "타임 루프 미스터리", "판타지 미스터리",
    "동화 속의 미스터리", "신화적 추리 소설", "동양적 본격 추리", "북유럽 미스터리 (Nordic Noir)",
    "라틴 미스터리", "영국식 정통 추리", "미국식 하드보일드", "일본식 신본격", "한국식 사회파 추리",
    "도서 미스터리 전문직", "기자 탐정", "의사 탐정", "신부/스님 탐정", "어린이 탐정단", "할머니/할아버지 탐정",
    "부패 경찰 서사", "언더커버 스파이", "마피아/야쿠자 연대기", "카르텔 범죄 소설", "사이버 범죄 수사",
    "미스터리 문학 비평", "추리 소설의 역사", "캣 앤 마우스 (Cat and Mouse)", "타임 패러독스",
    "보험 사기 (Insurance Fraud)", "상속 분쟁 (Inheritance Dispute)", "유괴 사건 (Kidnapping)",
    "가스라이팅 서사", "스톡홀름 증후군", "리플리 증후군", "독가스 살인 트릭", "둔기 살인 분석",
    "익사 트릭", "추락사 위장", "자살 위장술", "타살 위장술", "고독사 미스터리", "인공지능 탐정",
    "빅 데이터 수사물", "드론 활용 범죄", "딥페이크 트릭", "다크 웹 범죄", "암호화폐 범죄",
    "소셜 미디어 미스터리", "라이브 스트리밍 살인", "고딕 미스터리", "서던 고딕", "빅토리안 미스터리",
    "에드워디안 미스터리", "대공황 시대 범죄", "냉전기 첩보전", "중세 수도원 추리", "고대 로마 수사",
    "조선 시대 수사물", "일제강점기 미스터리", "군대 미스터리", "기내 살인사건", "크루즈 살인",
    "등대 미스터리", "설산의 조난 미스터리", "동굴 탐험 미스터리", "수중 수사물", "서커스 미스터리",
    "호텔 살인사건", "극장 미스터리", "미술관 도난사건", "경매장 범죄", "와이너리 미스터리",
    "카지노 도박 범죄", "경마장 미스터리", "스포츠 미스터리", "요리 미스터리 (Culinary)", "패션 업계 범죄",
    "연예계 미스터리", "정치적 음모론", "종교적 광기", "컬트/사이비 범죄", "오컬트 추리물",
    "도시 괴담 분석", "저주받은 물건", "인체 발화 현상", "투명인간 트릭", "인격 교체 서사",
    "최면술 트릭", "가상 현실 (VR) 범죄", "메타버스 미스터리", "해킹과 보안", "생화학 테러물",
    "핵 테러 위협", "환경 미스터리", "동물 매개 범죄", "곤충학 수사 (Entomology)", "인류학적 수사 (Anthropology)",
    "치과 법의학 (Odontology)", "혈흔 형태 분석", "탄도학 분석", "필적 감정 수사", "거짓말 탐지기",
    "프로파일러의 고뇌", "소시오패스 시점", "피해자 가족의 복수", "목격자 보호 프로그램", "공소시효 미스터리",
    "오판과 누명", "탈옥 미스터리", "자경단 (Vigilante) 서사", "사립 탐정의 면허", "탐정의 트라우마",
    "은퇴한 탐정의 복귀", "맹인 탐정 서사", "다중 인격 탐정", "천재와 광기", "셜로키언 문화",
    "추리 소설의 법칙", "녹스의 십계", "반 다인의 20칙", "독자와의 대결", "메타 미스터리", "미스터리의 미래",
    "현대 사회의 고립", "군중 속의 고독", "디지털 발자국 수사", "신분 도용", "장기 밀매 미스터리",
    "무기 밀매 음모", "고대 유물 저주", "예술품 위작 트릭", "경찰 내부 배신", "검찰과 권력",
    "언론 조작 미스터리", "재벌가 가업 승계", "학원 폭력과 복수", "이웃집의 비밀", "발코니 감시 트릭",
    "택배 상자 트릭", "엘리베이터 폐쇄공포", "지하철 연쇄 범죄", "공중전화 박스 미스터리", "무전기 트릭",
    "몰래카메라 범죄", "인터넷 커뮤니티 괴담", "유튜브 라이브 범죄", "인플루언서의 실종", "딥웹의 살인마",
    "도시 재생과 범죄", "인구 절벽 미스터리", "가짜 뉴스 스릴러", "AI 판사의 판결", "기억 저장 기술 범죄",
    "나노 테크 살인", "유전자 조작 스릴러", "가상 국가 범죄", "화성 이주지 미스터리", "심해 도시 범죄",
    "가족 해체 미스터리", "다문화 사회 갈등", "노인 빈곤과 범죄", "청년 실업 스릴러", "환경 파괴 보복"
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