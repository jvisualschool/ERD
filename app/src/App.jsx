import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Database,
    Table as TableIcon,
    Map as MapIcon,
    Layout,
    Key,
    Link as LinkIcon,
    RefreshCw,
    ChevronDown,
    Download,
    Lock,
    Unlock
} from 'lucide-react';

const API_URL = '/ERD/api/index.php';
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || '';

const App = () => {
    const [databases, setDatabases] = useState([]);
    const [selectedDb, setSelectedDb] = useState('');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('erd');
    const [selectedTable, setSelectedTable] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [theme, setTheme] = useState('dark');
    const [isAdmin, setIsAdmin] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [passwordInput, setPasswordInput] = useState('');
    const [showSplashModal, setShowSplashModal] = useState(false);

    const themeConfig = {
        dark: {
            bg: 'bg-slate-900',
            text: 'text-slate-100',
            card: 'bg-slate-800',
            border: 'border-white/5',
            divider: 'border-slate-700/20',
            input: 'bg-slate-900/50',
            tabInactive: 'text-slate-400',
            header: 'text-slate-200',
            subtext: 'text-slate-400',
            accent: 'text-emerald-400',
            labelBg: 'bg-slate-950/80'
        },
        light: {
            bg: 'bg-slate-50',
            text: 'text-slate-900',
            card: 'bg-white',
            border: 'border-slate-200',
            divider: 'border-slate-200',
            input: 'bg-slate-100',
            tabInactive: 'text-slate-500',
            header: 'text-slate-800',
            subtext: 'text-slate-600',
            accent: 'text-emerald-600',
            labelBg: 'bg-white/80'
        },
        gray: {
            bg: 'bg-slate-300',
            text: 'text-slate-950',
            card: 'bg-slate-100',
            border: 'border-slate-400/30',
            divider: 'border-slate-400/30',
            input: 'bg-slate-200',
            tabInactive: 'text-slate-600',
            header: 'text-slate-900',
            subtext: 'text-slate-700',
            accent: 'text-emerald-700',
            labelBg: 'bg-slate-200/80'
        }
    };

    const currentTheme = themeConfig[theme];

    const toggleTheme = () => {
        const themes = ['dark', 'light', 'gray'];
        const currentIndex = themes.indexOf(theme);
        const nextIndex = (currentIndex + 1) % themes.length;
        setTheme(themes[nextIndex]);
    };

    const handleAdminToggle = () => {
        if (isAdmin) {
            setIsAdmin(false);
            // Admin 모드 해제 시 ERD로 자동 전환
            if (selectedDb !== 'ERD' && databases.includes('ERD')) {
                setSelectedDb('ERD');
            }
        } else {
            setShowPasswordModal(true);
        }
    };

    const handlePasswordSubmit = (e) => {
        e.preventDefault();
        if (passwordInput === ADMIN_PASSWORD) {
            setIsAdmin(true);
            setShowPasswordModal(false);
            setPasswordInput('');
        } else {
            alert('비밀번호가 올바르지 않습니다.');
            setPasswordInput('');
        }
    };

    const filteredDatabases = useMemo(() => {
        const dbs = Array.isArray(databases) ? databases : [];
        if (isAdmin) {
            return dbs;
        }
        return dbs.filter(db => db === 'ERD');
    }, [databases, isAdmin]);

    useEffect(() => {
        fetchDatabases();
    }, []);

    useEffect(() => {
        fetchDatabases();
    }, [isAdmin]);

    useEffect(() => {
        if (selectedDb) {
            fetchTables(selectedDb);
        }
    }, [selectedDb]);

    const fetchDatabases = async () => {
        try {
            const response = await axios.get(`${API_URL}?action=get_databases`);
            const allDatabases = Array.isArray(response.data) ? response.data : [];
            setDatabases(allDatabases);
            if (allDatabases.length > 0) {
                // Admin 모드가 아니면 ERD만 선택 가능
                const availableDbs = isAdmin ? allDatabases : allDatabases.filter(db => db === 'ERD');
                if (availableDbs.length > 0) {
                    const defaultDb = availableDbs.includes('ERD') ? 'ERD' : availableDbs[0];
                    // 현재 선택된 DB가 사용 가능한지 확인
                    if (availableDbs.includes(selectedDb)) {
                        // 이미 유효한 DB가 선택되어 있으면 유지
                    } else {
                        setSelectedDb(defaultDb);
                    }
                } else if (selectedDb && !availableDbs.includes(selectedDb)) {
                    // 현재 선택된 DB가 사용 불가능하면 ERD로 변경
                    setSelectedDb('ERD');
                }
            }
        } catch (error) {
            console.error('Error fetching databases:', error);
        }
    };

    const fetchTables = async (db) => {
        setLoading(true);
        try {
            const response = await axios.get(`${API_URL}?action=get_tables&db=${db}`);
            setData(response.data);
            const tableNames = Object.keys(response.data.tables || {});
            if (tableNames.length > 0) {
                setSelectedTable(tableNames[0]);
            }
        } catch (error) {
            console.error('Error fetching tables:', error);
        } finally {
            setLoading(false);
        }
    };

    const tabs = [
        { id: 'erd', label: 'ERD Diagram', icon: MapIcon },
        { id: 'schema', label: 'Schema Explorer', icon: Layout },
        { id: 'data', label: 'Data Viewer', icon: TableIcon },
    ];

    const filteredTables = useMemo(() => {
        if (!data || !data.tables) return [];
        return Object.keys(data.tables).filter(name =>
            name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [data, searchTerm]);

    if (loading && !databases.length) {
        return (
            <div className={`flex items-center justify-center h-screen ${currentTheme.bg}`}>
                <motion.div animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity, ease: "linear" }}>
                    <RefreshCw className="w-12 h-12 text-slate-500" />
                </motion.div>
            </div>
        );
    }

    return (
        <div className={`${currentTheme.bg} ${currentTheme.text} transition-colors duration-300 min-h-screen`}>
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <header className="mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                            <h1 className={`text-4xl ${currentTheme.header} flex items-center gap-3`}>
                                <Database
                                    className={`w-10 h-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'} cursor-pointer hover:opacity-70 transition-opacity`}
                                    onClick={() => setShowSplashModal(true)}
                                />
                                <span className="font-semibold">MySQL</span> <span className={`font-extralight ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Viewer</span>
                            </h1>
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={toggleTheme}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentTheme.card} border ${currentTheme.border} shadow-sm hover:bg-black/5 ${currentTheme.text}`}
                                    title={`Current theme: ${theme}. Click to toggle.`}
                                >
                                    {theme}
                                </button>
                                <button
                                    onClick={handleAdminToggle}
                                    className={`px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${isAdmin ? 'bg-emerald-500 text-white' : `${currentTheme.card} border ${currentTheme.border}`} shadow-sm hover:bg-black/5 ${!isAdmin ? currentTheme.text : ''}`}
                                    title={isAdmin ? 'Admin 모드 활성화됨. 클릭하여 해제' : 'Admin 모드 활성화'}
                                >
                                    {isAdmin ? <Unlock className="w-3.5 h-3.5" /> : <Lock className="w-3.5 h-3.5" />}
                                </button>
                            </div>
                        </div>
                        <p className={`${currentTheme.subtext} font-extralight text-sm`}>
                            Auto-detecting schema & mapping relationships from <span className={`font-bold ${theme === 'dark' ? 'text-slate-300' : 'text-slate-800'}`}>{selectedDb || '...'}</span>
                        </p>
                    </div>

                    <div className={`flex ${currentTheme.card} p-1 rounded-xl border ${currentTheme.border} shadow-sm`}>
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all ${activeTab === tab.id ? 'bg-slate-500 text-white shadow-md' : `${currentTheme.tabInactive} hover:bg-black/5`
                                    }`}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="font-medium whitespace-nowrap text-sm">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        <div className={`${currentTheme.card} rounded-2xl p-6 border ${currentTheme.border} shadow-sm`}>
                            <div className="relative group mb-4">
                                <Database className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                <select
                                    value={selectedDb}
                                    onChange={(e) => setSelectedDb(e.target.value)}
                                    className={`appearance-none w-full ${currentTheme.input} border ${currentTheme.border} ${currentTheme.text} font-bold pl-10 pr-10 py-2.5 rounded-xl focus:outline-none cursor-pointer transition-all hover:bg-black/5 text-sm`}
                                >
                                    {filteredDatabases.map(db => (
                                        <option key={db} value={db}>{db}</option>
                                    ))}
                                </select>
                                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500 pointer-events-none" />
                            </div>
                            <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 border-b ${currentTheme.divider} pb-2`}>
                                <TableIcon className="w-5 h-5 text-slate-400" />
                                {filteredTables.length} Tables
                            </h2>
                            <div className="space-y-1 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                                {filteredTables.length > 0 ? filteredTables.map((tableName) => (
                                    <button
                                        key={tableName}
                                        onClick={() => setSelectedTable(tableName)}
                                        className={`w-full text-left px-4 py-3 rounded-xl transition-all border ${selectedTable === tableName ? 'bg-slate-500 text-white border-transparent shadow-md' : `border-transparent hover:${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} ${currentTheme.tabInactive}`
                                            }`}
                                    >
                                        <div className="flex items-center justify-between">
                                            <span className="font-bold truncate text-sm capitalize">{tableName}</span>
                                            <ChevronDown className={`w-4 h-4 opacity-50 transition-transform ${selectedTable === tableName ? '-rotate-90 text-white' : ''}`} />
                                        </div>
                                    </button>
                                )) : (
                                    <div className="py-8 text-center text-slate-500 text-xs">No tables found</div>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-3 min-h-[600px]">
                        {!selectedTable ? (
                            <div className={`${currentTheme.card} h-full flex flex-col items-center justify-center p-12 border ${currentTheme.border} text-slate-500 text-center`}>
                                <div className="p-6 bg-black/5 rounded-full mb-6">
                                    <Database className="w-12 h-12 opacity-20" />
                                </div>
                                <h3 className="text-xl font-bold mb-2">No Table Selected</h3>
                                <p className="max-w-xs mx-auto">Please select a table from the sidebar to visualize its schema and data.</p>
                            </div>
                        ) : (
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={activeTab + selectedDb + selectedTable}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                    className="h-full"
                                >
                                    {activeTab === 'erd' && <ERDDiagram data={data} theme={theme} currentTheme={currentTheme} />}
                                    {activeTab === 'schema' && <SchemaView table={selectedTable} schema={data.tables?.[selectedTable]?.schema} theme={theme} currentTheme={currentTheme} />}
                                    {activeTab === 'data' && <DataView table={selectedTable} data={data.tables?.[selectedTable]?.data} theme={theme} currentTheme={currentTheme} />}
                                </motion.div>
                            </AnimatePresence>
                        )}
                    </div>
                </main>

                <footer className={`mt-16 pt-8 border-t ${currentTheme.divider} text-center ${currentTheme.subtext} text-sm`}>
                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
                        <p>© 2026 MySQL Viewer.</p>
                        <span className="hidden md:inline">•</span>
                        <div className="flex items-center gap-2 flex-wrap justify-center">
                            <span>Built with</span>
                            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className={`font-semibold ${currentTheme.accent} hover:underline transition-colors`}>React</a>
                            <span>+</span>
                            <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className={`font-semibold ${currentTheme.accent} hover:underline transition-colors`}>Vite</a>
                            <span>+</span>
                            <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className={`font-semibold ${currentTheme.accent} hover:underline transition-colors`}>Tailwind CSS</a>
                        </div>
                        <span className="hidden md:inline">•</span>
                        <a
                            href="mailto:jvisualschool@gmail.com"
                            className={`${currentTheme.accent} hover:underline font-medium transition-colors`}
                        >
                            Jinho Jung
                        </a>
                    </div>
                </footer>
            </div>

            {/* Admin Password Modal */}
            <AnimatePresence>
                {showPasswordModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => {
                            setShowPasswordModal(false);
                            setPasswordInput('');
                        }}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${currentTheme.card} rounded-2xl p-6 border ${currentTheme.border} shadow-xl max-w-md w-full`}
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <Lock className={`w-6 h-6 ${currentTheme.accent}`} />
                                <h3 className={`text-xl font-bold ${currentTheme.header}`}>Admin 모드 활성화</h3>
                            </div>
                            <p className={`${currentTheme.subtext} mb-6 text-sm`}>
                                모든 데이터베이스에 접근하려면 비밀번호를 입력하세요.
                            </p>
                            <form onSubmit={handlePasswordSubmit}>
                                <input
                                    type="password"
                                    value={passwordInput}
                                    onChange={(e) => setPasswordInput(e.target.value)}
                                    placeholder="비밀번호 입력"
                                    className={`w-full ${currentTheme.input} border ${currentTheme.border} ${currentTheme.text} px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 mb-4`}
                                    autoFocus
                                />
                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowPasswordModal(false);
                                            setPasswordInput('');
                                        }}
                                        className={`flex-1 px-4 py-2 rounded-xl ${currentTheme.input} border ${currentTheme.border} ${currentTheme.text} font-medium transition-all hover:bg-black/5`}
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white font-medium transition-all hover:bg-emerald-600"
                                    >
                                        확인
                                    </button>
                                </div>
                            </form>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Splash Modal */}
            <AnimatePresence>
                {showSplashModal && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setShowSplashModal(false)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className={`${currentTheme.card} rounded-2xl border ${currentTheme.border} shadow-xl max-w-4xl w-full overflow-hidden`}
                        >
                            {/* 16:9 Image Area */}
                            <div className="w-full aspect-video relative overflow-hidden">
                                <img
                                    src="/ERD/splash.jpg"
                                    alt="MySQL Viewer Splash"
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            {/* Content Area */}
                            <div className="p-8">
                                <h2 className={`text-4xl ${currentTheme.header} flex items-center gap-3 mb-6`}>
                                    <Database className={`w-10 h-10 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                                    <span className="font-semibold">MySQL</span> <span className={`font-extralight ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>Viewer</span>
                                </h2>

                                <div className={`mt-8 pt-8 border-t ${currentTheme.divider}`}>
                                    <div className="flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4 text-sm">
                                        <p className={currentTheme.subtext}>© 2026 MySQL Viewer.</p>
                                        <span className="hidden md:inline">•</span>
                                        <div className="flex items-center gap-2 flex-wrap justify-center">
                                            <span className={currentTheme.subtext}>Built with</span>
                                            <a href="https://react.dev/" target="_blank" rel="noopener noreferrer" className={`font-semibold ${currentTheme.accent} hover:underline transition-colors`}>React</a>
                                            <span className={currentTheme.subtext}>+</span>
                                            <a href="https://vitejs.dev/" target="_blank" rel="noopener noreferrer" className={`font-semibold ${currentTheme.accent} hover:underline transition-colors`}>Vite</a>
                                            <span className={currentTheme.subtext}>+</span>
                                            <a href="https://tailwindcss.com/" target="_blank" rel="noopener noreferrer" className={`font-semibold ${currentTheme.accent} hover:underline transition-colors`}>Tailwind CSS</a>
                                        </div>
                                        <span className="hidden md:inline">•</span>
                                        <a
                                            href="mailto:jvisualschool@gmail.com"
                                            className={`${currentTheme.accent} hover:underline font-medium transition-colors`}
                                        >
                                            Jinho Jung
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ERDDiagram = ({ data, theme, currentTheme }) => {
    if (!data || !data.tables) return null;

    const tableNames = Object.keys(data.tables);
    const colsCount = Math.ceil(Math.sqrt(tableNames.length));
    const paddingX = 350;
    const marginY = 80;
    const colY = new Array(colsCount).fill(50);

    const tables = tableNames.map((id, index) => {
        const colIndex = index % colsCount;
        const columns = data.tables[id]?.schema || [];
        const height = 45 + (columns.length * 32) + 15;
        const x = 50 + colIndex * paddingX;
        const y = colY[colIndex];
        colY[colIndex] += height + marginY;
        return { id, x, y, height };
    });

    const relationships = data.relationships || [];
    const findTable = (id) => tables.find(t => t.id === id);
    const maxSvgHeight = Math.max(...colY) + 100;
    const maxSvgWidth = colsCount * paddingX + 100;

    return (
        <div className={`${currentTheme.card} rounded-2xl h-full min-h-[700px] overflow-auto relative p-0 custom-scrollbar border ${currentTheme.border} shadow-inner`}>
            <div className={`absolute top-4 right-4 flex gap-4 text-xs font-black z-20 ${currentTheme.labelBg} p-2 rounded-lg backdrop-blur uppercase tracking-widest`}>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-slate-500 rounded-sm"></div> PK</div>
                <div className="flex items-center gap-1"><div className="w-3 h-3 bg-emerald-500 rounded-sm"></div> FK</div>
            </div>

            <svg
                style={{ minWidth: maxSvgWidth, minHeight: maxSvgHeight }}
                className="w-full h-full"
                viewBox={`0 0 ${maxSvgWidth} ${maxSvgHeight}`}
            >
                <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="10" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill={theme === 'dark' ? '#475569' : '#94a3b8'} />
                    </marker>
                </defs>

                {tables.map((table) => {
                    const columns = data.tables?.[table.id]?.schema || [];
                    return (
                        <React.Fragment key={table.id}>
                            <rect x={table.x} y={table.y} width="240" height={table.height} fill={theme === 'dark' ? '#0f172a' : '#f1f5f9'} rx="12" stroke={theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)'} />
                            <foreignObject x={table.x} y={table.y} width="240" height={table.height} className="pointer-events-none">
                                <div className="rounded-xl overflow-hidden pointer-events-auto h-full">
                                    <div className={`${theme === 'dark' ? 'bg-slate-800' : 'bg-white'} px-3.5 py-2.5 font-bold text-sm capitalize flex items-center justify-between border-b ${currentTheme.divider} h-[45px]`}>
                                        <div className="flex items-center gap-2">
                                            <TableIcon className="w-3.5 h-3.5 text-slate-400" />
                                            <span className={`${currentTheme.text} text-base truncate`}>{table.id}</span>
                                        </div>
                                    </div>
                                    <div className="p-3.5 space-y-1.5">
                                        {columns.map((col, i) => (
                                            <div key={i} className="text-sm py-0.5 flex items-center justify-between min-h-[26px]">
                                                <span className={`flex items-center gap-2 font-medium text-xs ${theme === 'dark' ? 'text-slate-300' : 'text-slate-700'}`}>
                                                    {col.Key === 'PRI' && <Key className="w-3 h-3 text-slate-400" />}
                                                    {col.Key === 'MUL' && <LinkIcon className="w-3 h-3 text-emerald-500" />}
                                                    {col.Field}
                                                </span>
                                                <span className={`${theme === 'dark' ? 'text-slate-500' : 'text-slate-400'} font-bold opacity-60 text-[10px]`}>{col.Type}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </foreignObject>
                        </React.Fragment>
                    );
                })}

                {relationships.map((rel, idx) => {
                    const fromTable = findTable(rel.from_table);
                    const toTable = findTable(rel.to_table);
                    if (!fromTable || !toTable) return null;

                    const BOX_WIDTH = 240;
                    const c1 = { x: fromTable.x + BOX_WIDTH / 2, y: fromTable.y + fromTable.height / 2 };
                    const c2 = { x: toTable.x + BOX_WIDTH / 2, y: toTable.y + toTable.height / 2 };

                    const getEdgePoint = (rect, otherCenter) => {
                        const cx = rect.x + BOX_WIDTH / 2;
                        const cy = rect.y + rect.height / 2;
                        const dx = otherCenter.x - cx;
                        const dy = otherCenter.y - cy;
                        if (Math.abs(dx) * rect.height > Math.abs(dy) * BOX_WIDTH) {
                            return { x: cx + (dx > 0 ? BOX_WIDTH / 2 : -BOX_WIDTH / 2), y: cy + (dy * (BOX_WIDTH / 2)) / Math.abs(dx) };
                        } else {
                            return { x: cx + (dx * (rect.height / 2)) / Math.abs(dy), y: cy + (dy > 0 ? rect.height / 2 : -rect.height / 2) };
                        }
                    };

                    const p1 = getEdgePoint(fromTable, c2);
                    const p2 = getEdgePoint(toTable, c1);

                    return (
                        <g key={idx} className="pointer-events-none">
                            <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke={theme === 'dark' ? '#475569' : '#94a3b8'} strokeWidth="1.5" strokeDasharray="6,4" markerEnd="url(#arrowhead)" />
                            <circle cx={p1.x} cy={p1.y} r="2.5" fill={theme === 'dark' ? '#475569' : '#94a3b8'} />
                            <g transform={`translate(${(p1.x + p2.x) / 2}, ${(p1.y + p2.y) / 2})`}>
                                <rect x="-60" y="-11" width="120" height="22" rx="11" fill={theme === 'dark' ? '#0f172a' : '#ffffff'} stroke={theme === 'dark' ? '#334155' : '#e2e8f0'} strokeWidth="1.5" />
                                <text fill={theme === 'dark' ? '#f8fafc' : '#1e293b'} fontSize="9" textAnchor="middle" dy="3.5" className="font-black uppercase tracking-widest">
                                    FK: {rel.from_column}
                                </text>
                            </g>
                        </g>
                    );
                })}
            </svg>
        </div>
    );
};

const SchemaView = ({ table, schema, theme, currentTheme }) => {
    if (!schema) return (
        <div className={`${currentTheme.card} rounded-2xl p-6 border ${currentTheme.border} flex flex-col items-center justify-center py-20 text-slate-500`}>
            <Layout className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">Select a table to view its structure</p>
        </div>
    );
    return (
        <div className={`${currentTheme.card} rounded-2xl p-6 border ${currentTheme.border} shadow-sm overflow-hidden`}>
            <div className={`flex items-center justify-between mb-8 border-b ${currentTheme.divider} pb-4`}>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Layout className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`capitalize font-medium ${currentTheme.header}`}>{table}</span> <span className="font-light text-slate-500">Structure</span>
                </h2>
                <div className="flex gap-2">
                    <span className={`text-[10px] px-3 py-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} rounded-full font-black uppercase tracking-widest`}>
                        {schema.length} Columns
                    </span>
                </div>
            </div>
            <div className={`overflow-auto max-h-[600px] rounded-2xl border ${currentTheme.border} shadow-inner custom-scrollbar`}>
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-black/5 backdrop-blur-md">
                        <tr className={`${currentTheme.subtext} text-[10px] font-black uppercase tracking-widest border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                            <th className="py-5 px-6">Field</th>
                            <th className="py-5 px-6">Type</th>
                            <th className="py-5 px-6">Key</th>
                            <th className="py-5 px-6">Null</th>
                            <th className="py-5 px-6">Default</th>
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${currentTheme.divider}`}>
                        {schema.map((col, i) => (
                            <tr key={i} className={`hover:bg-black/5 transition-all group`}>
                                <td className={`py-5 px-6 font-mono text-base font-bold border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                                    <div className="flex items-center gap-2">
                                        {col.Key === 'PRI' ? <Key className="w-4 h-4 text-slate-400" /> : <div className="w-4" />}
                                        {col.Field}
                                    </div>
                                </td>
                                <td className={`py-5 px-6 text-base ${currentTheme.subtext} font-medium border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                                    <code className="text-sm">{col.Type}</code>
                                </td>
                                <td className={`py-5 px-6 border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                                    {col.Key && (
                                        <span className={`text-sm px-2 py-0.5 rounded font-black uppercase tracking-tighter border ${col.Key === 'PRI' ? 'bg-slate-500 text-white border-transparent' : 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                                            }`}>
                                            {col.Key === 'PRI' ? 'Primary' : 'Foreign'}
                                        </span>
                                    )}
                                </td>
                                <td className={`py-5 px-6 border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                                    <span className={`text-sm font-bold ${col.Null === 'YES' ? currentTheme.subtext : 'text-emerald-500 uppercase'}`}>
                                        {col.Null === 'YES' ? 'Nullable' : 'Required'}
                                    </span>
                                </td>
                                <td className={`py-5 px-6 text-sm ${currentTheme.subtext} border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                                    {col.Default || (col.Null === 'YES' ? 'NULL' : '-')}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

const DataView = ({ table, data, theme, currentTheme }) => {
    if (!data || data.length === 0) return (
        <div className={`${currentTheme.card} rounded-2xl p-6 border ${currentTheme.border} flex flex-col items-center justify-center py-20 text-slate-500`}>
            <Database className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg">No records found for <span className="text-slate-400 font-bold">{table}</span></p>
        </div>
    );

    const headers = Object.keys(data[0]);

    const downloadCSV = () => {
        // CSV 헤더 생성
        const csvHeaders = headers.join(',');

        // CSV 데이터 행 생성
        const csvRows = data.map(row => {
            return headers.map(header => {
                const value = row[header];
                // NULL 값 처리
                if (value === null || value === undefined) {
                    return '';
                }
                // 문자열에 쉼표, 따옴표, 줄바꿈이 있으면 따옴표로 감싸고 내부 따옴표는 이스케이프
                const stringValue = String(value);
                if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
                    return `"${stringValue.replace(/"/g, '""')}"`;
                }
                return stringValue;
            }).join(',');
        });

        // CSV 전체 내용
        const csvContent = [csvHeaders, ...csvRows].join('\n');

        // BOM 추가 (한글 깨짐 방지)
        const BOM = '\uFEFF';
        const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

        // 다운로드 링크 생성
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `${table}_${new Date().toISOString().split('T')[0]}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    return (
        <div className={`${currentTheme.card} rounded-2xl p-6 border ${currentTheme.border} shadow-sm overflow-hidden`}>
            <div className={`flex items-center justify-between mb-8 border-b ${currentTheme.divider} pb-4`}>
                <h2 className="text-2xl font-bold flex items-center gap-3">
                    <TableIcon className={`w-8 h-8 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`} />
                    <span className={`capitalize font-medium ${currentTheme.header}`}>{table}</span> <span className="font-light text-slate-500">Data Preview</span>
                </h2>
                <div className="flex items-center gap-3">
                    <span className={`text-[10px] px-3 py-1 ${theme === 'dark' ? 'bg-white/5' : 'bg-black/5'} rounded-full font-black uppercase tracking-widest`}>
                        {data.length} Records
                    </span>
                    <button
                        onClick={downloadCSV}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all ${currentTheme.card} border ${currentTheme.border} shadow-sm hover:bg-black/5 ${currentTheme.text}`}
                        title="Download as CSV"
                    >
                        <Download className="w-3.5 h-3.5" />
                        CSV
                    </button>
                </div>
            </div>
            <div className={`overflow-auto max-h-[600px] rounded-2xl border ${currentTheme.border} shadow-inner custom-scrollbar`}>
                <table className="w-full text-left border-collapse">
                    <thead className="sticky top-0 z-10 bg-black/5 backdrop-blur-md">
                        <tr className={`${currentTheme.subtext} text-[10px] font-black uppercase tracking-widest border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                            {headers.map(header => (
                                <th key={header} className="py-5 px-6">{header}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className={`divide-y ${currentTheme.divider}`}>
                        {data.map((row, i) => (
                            <tr key={i} className="hover:bg-black/5 transition-all group">
                                {headers.map(header => (
                                    <td key={header} className={`py-5 px-6 text-sm ${theme === 'dark' ? 'text-slate-200' : 'text-slate-800'} truncate max-w-[200px] font-medium border-b ${currentTheme.divider} ${theme === 'dark' ? 'border-[0.5px]' : ''}`}>
                                        {row[header] === null ? <span className="text-slate-500">NULL</span> : row[header]}
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default App;
