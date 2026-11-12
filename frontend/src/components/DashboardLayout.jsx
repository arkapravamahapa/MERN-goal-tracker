import AIAssistant from './AIAssistant';
import { 
  Inbox, CheckSquare, List, CheckCircle2, Clock, Calendar, 
  Target, Folder, Activity, PieChart, Star, Search, User, ChevronDown
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const DashboardLayout = ({ children }) => {
  const location = useLocation();

  const isActive = (path) => location.pathname === path 
    ? "flex items-center justify-between px-3 py-1.5 bg-blue-50 text-blue-700 rounded-md font-medium text-sm" 
    : "flex items-center justify-between px-3 py-1.5 text-gray-700 rounded-md hover:bg-gray-100 transition-colors text-sm";

  return (
    <div className="flex h-screen bg-gray-50 font-sans text-gray-900">
      
      {/* Exact Replica Sidebar */}
      <aside className="w-64 bg-gray-50 border-r border-gray-200 flex flex-col h-full overflow-y-auto custom-scrollbar">
        
        {/* Profile & Search */}
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between cursor-pointer hover:bg-gray-200 p-1.5 rounded">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                <User size={14} className="text-gray-600"/>
              </div>
              <span className="font-medium text-sm">Chris</span>
              <ChevronDown size={14} className="text-gray-500" />
            </div>
          </div>
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search" className="w-full pl-8 pr-3 py-1.5 bg-gray-200/50 border-none rounded-md text-sm outline-none focus:bg-white focus:ring-1 focus:ring-blue-500" />
          </div>
        </div>
        
        <nav className="flex-1 px-2 pb-4 space-y-6">
          
          {/* Inbox */}
          <div>
            <Link to="/inbox" className={isActive('/inbox')}>
              <div className="flex items-center gap-2"><Inbox size={16} /> Inbox</div>
              <span className="text-xs text-gray-400">7</span>
            </Link>
          </div>

          {/* To Do */}
          <div>
            <div className="px-3 mb-1 text-xs font-semibold text-gray-400">To Do</div>
            <div className="space-y-0.5">
              <Link to="/" className={isActive('/')}>
                <div className="flex items-center gap-2"><CheckSquare size={16} /> Today</div>
                <span className="text-xs text-gray-400">17</span>
              </Link>
              <Link to="/all-tasks" className={isActive('/all-tasks')}>
                <div className="flex items-center gap-2"><List size={16} /> All Tasks</div>
              </Link>
              <Link to="/completed" className={isActive('/completed')}>
                <div className="flex items-center gap-2"><CheckCircle2 size={16} /> Completed</div>
              </Link>
            </div>
          </div>

          {/* Plan */}
          <div>
            <div className="px-3 mb-1 text-xs font-semibold text-gray-400">Plan</div>
            <div className="space-y-0.5">
              <Link to="/upcoming" className={isActive('/upcoming')}>
                <div className="flex items-center gap-2"><Clock size={16} /> Upcoming</div>
              </Link>
              <Link to="/timeline" className={isActive('/timeline')}>
                <div className="flex items-center gap-2"><Calendar size={16} /> Timeline</div>
              </Link>
            </div>
          </div>

          {/* Big Picture */}
          <div>
            <div className="px-3 mb-1 text-xs font-semibold text-gray-400">Big Picture</div>
            <div className="space-y-0.5">
              <Link to="/life-areas" className={isActive('/life-areas')}>
                <div className="flex items-center gap-2"> Life Areas</div>
              </Link>
              <Link to="/goals" className={isActive('/goals')}>
                <div className="flex items-center gap-2"><Target size={16} /> Goals</div>
              </Link>
              <Link to="/projects" className={isActive('/projects')}>
                <div className="flex items-center gap-2"><Folder size={16} /> Projects</div>
              </Link>
              <Link to="/habits" className={isActive('/habits')}>
                <div className="flex items-center gap-2"><Activity size={16} /> Habits</div>
              </Link>
              <Link to="/insights" className={isActive('/insights')}>
                <div className="flex items-center gap-2"><PieChart size={16} /> Insights</div>
              </Link>
            </div>
          </div>

          {/* Favorites */}
          <div>
            <div className="px-3 mb-1 text-xs font-semibold text-gray-400">Favorites</div>
            <div className="space-y-0.5">
              <Link to="/favorites/work" className={isActive('/favorites/work')}>
                <div className="flex items-center gap-2 text-blue-600"><Star size={16} /> Work & Career</div>
              </Link>
              <Link to="/favorites/revenue" className={isActive('/favorites/revenue')}>
                <div className="flex items-center gap-2 text-blue-600"><Target size={16} /> Do 100K revenue</div>
              </Link>
            </div>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-white rounded-tl-2xl border-l border-t border-gray-200 shadow-sm mt-2">
        <header className="h-14 bg-white border-b border-gray-100 flex items-center px-6 justify-between">
          <h1 className="text-lg font-semibold text-gray-800 capitalize">
            {location.pathname === '/' ? 'Today' : location.pathname.substring(1).replace('-', ' ')}
          </h1>
          <Link to="/" className="bg-blue-600 text-white px-4 py-1.5 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors">
            + New Task
          </Link>
        </header>
        
        <div className="flex-1 overflow-auto p-6 bg-white">
          {children}
        </div>
      </main>

      {/* Floating AI Assistant available across all routes */}
      <AIAssistant />

    </div>
  );
};

export default DashboardLayout;