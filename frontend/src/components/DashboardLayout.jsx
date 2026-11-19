import AIAssistant from './AIAssistant';
import {
  Inbox, CheckSquare, List, CheckCircle2, Clock, Calendar,
  Target, Folder, Activity, PieChart, Star, Search, User, ChevronDown, Compass
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) =>
    location.pathname === path
      ? 'flex items-center justify-between px-3 py-1.5 bg-sky-100/80 text-sky-900 border border-sky-200/70 rounded-lg font-medium text-sm shadow-xs transition-colors'
      : 'flex items-center justify-between px-3 py-1.5 text-slate-600 border border-transparent rounded-lg hover:bg-white/80 hover:text-slate-900 transition-colors text-sm';

  return (
    <div className="flex h-screen bg-gradient-to-br from-sky-50 via-slate-50 to-indigo-50/80 font-sans text-slate-800">

      {/* Light Pastel Sidebar */}
      <aside className="w-64 bg-gradient-to-b from-sky-50/90 via-white/80 to-indigo-50/70 border-r border-sky-100 flex flex-col h-full overflow-y-auto custom-scrollbar">

        {/* Profile & Search */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between cursor-pointer hover:bg-white/80 p-1.5 rounded-lg transition-colors">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 bg-gradient-to-br from-sky-200 to-indigo-200 rounded-full flex items-center justify-center ring-2 ring-white shadow-xs">
                <User size={14} className="text-indigo-800" />
              </div>
              <span className="font-semibold text-sm text-slate-800">Chris</span>
              <ChevronDown size={14} className="text-slate-400" />
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-sky-500/70" />
            <input
              type="text"
              placeholder="Search"
              className="w-full pl-8 pr-3 py-1.5 bg-white/90 border border-sky-100 rounded-lg text-sm text-slate-700 placeholder:text-slate-400 outline-none focus:bg-white focus:border-sky-300 focus:ring-2 focus:ring-sky-100 transition-all"
            />
          </div>
        </div>

        <nav className="flex-1 px-2.5 pb-4 space-y-5">

          {/* Inbox */}
          <div>
            <Link to="/inbox" className={isActive('/inbox')}>
              <div className="flex items-center gap-2.5">
                <Inbox size={16} className="text-sky-500" />
                <span>Inbox</span>
              </div>
            </Link>
          </div>

          {/* To Do */}
          <div>
            <div className="px-3 mb-1.5 text-xs font-semibold text-slate-400">To Do</div>
            <div className="space-y-0.5">
              <Link to="/" className={isActive('/')}>
                <div className="flex items-center gap-2.5">
                  <CheckSquare size={16} className="text-sky-600" />
                  <span>Today</span>
                </div>
              </Link>
              <Link to="/all-tasks" className={isActive('/all-tasks')}>
                <div className="flex items-center gap-2.5">
                  <List size={16} className="text-indigo-500" />
                  <span>All Tasks</span>
                </div>
              </Link>
              <Link to="/completed" className={isActive('/completed')}>
                <div className="flex items-center gap-2.5">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  <span>Completed</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Plan */}
          <div>
            <div className="px-3 mb-1.5 text-xs font-semibold text-slate-400">Plan</div>
            <div className="space-y-0.5">
              <Link to="/upcoming" className={isActive('/upcoming')}>
                <div className="flex items-center gap-2.5">
                  <Clock size={16} className="text-amber-500" />
                  <span>Upcoming</span>
                </div>
              </Link>
              <Link to="/timeline" className={isActive('/timeline')}>
                <div className="flex items-center gap-2.5">
                  <Calendar size={16} className="text-violet-500" />
                  <span>Timeline</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Big Picture */}
          <div>
            <div className="px-3 mb-1.5 text-xs font-semibold text-slate-400">Big Picture</div>
            <div className="space-y-0.5">
              <Link to="/life-areas" className={isActive('/life-areas')}>
                <div className="flex items-center gap-2.5">
                  <Compass size={16} className="text-teal-500" />
                  <span>Life Areas</span>
                </div>
              </Link>
              <Link to="/goals" className={isActive('/goals')}>
                <div className="flex items-center gap-2.5">
                  <Target size={16} className="text-rose-500" />
                  <span>Goals</span>
                </div>
              </Link>
              <Link to="/projects" className={isActive('/projects')}>
                <div className="flex items-center gap-2.5">
                  <Folder size={16} className="text-sky-500" />
                  <span>Projects</span>
                </div>
              </Link>
              <Link to="/habits" className={isActive('/habits')}>
                <div className="flex items-center gap-2.5">
                  <Activity size={16} className="text-emerald-500" />
                  <span>Habits</span>
                </div>
              </Link>
              <Link to="/insights" className={isActive('/insights')}>
                <div className="flex items-center gap-2.5">
                  <PieChart size={16} className="text-indigo-500" />
                  <span>Insights</span>
                </div>
              </Link>
            </div>
          </div>

          {/* Favorites */}
          <div>
            <div className="px-3 mb-1.5 text-xs font-semibold text-slate-400">Favorites</div>
            <div className="space-y-0.5">
              <Link to="/favorites/work" className={isActive('/favorites/work')}>
                <div className="flex items-center gap-2.5 text-sky-700">
                  <Star size={16} className="text-amber-500" />
                  <span>Work & Career</span>
                </div>
              </Link>
              <Link to="/favorites/revenue" className={isActive('/favorites/revenue')}>
                <div className="flex items-center gap-2.5 text-indigo-700">
                  <Target size={16} className="text-indigo-500" />
                  <span>Do 100K revenue</span>
                </div>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white/95 rounded-tl-2xl border-l border-t border-sky-100 shadow-sm mt-2">
        <header className="h-14 bg-gradient-to-r from-white via-sky-50/40 to-indigo-50/40 border-b border-sky-100 flex items-center px-6 justify-between shrink-0">
          <h1 className="text-lg font-semibold text-slate-800 capitalize tracking-tight">
            {location.pathname === '/' ? 'Today' : location.pathname.substring(1).replace(/-/g, ' ')}
          </h1>
          <Link
            to="/"
            className="bg-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-sky-700 transition-colors shadow-xs whitespace-nowrap shrink-0"
          >
            + New Task
          </Link>
        </header>

        <div className="flex-1 overflow-auto p-6 bg-gradient-to-br from-sky-50/35 via-white to-indigo-50/30 custom-scrollbar">
          {children}
        </div>
      </main>

      {/* Floating AI Assistant available across all routes */}
      <AIAssistant />

    </div>
  );
};

export default DashboardLayout;