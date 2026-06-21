import { NavLink } from 'react-router-dom';
import { MessageSquare, Eye, BarChart3, Pill } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { path: '/', icon: MessageSquare, label: '话术生成' },
  { path: '/preview', icon: Eye, label: '消息预览' },
  { path: '/feedback', icon: BarChart3, label: '反馈归类' }
];

interface SidebarProps {
  className?: string;
}

export function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn(
      'w-64 bg-white border-r border-primary-100 flex flex-col h-screen sticky top-0',
      className
    )}>
      <div className="p-6 border-b border-primary-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <Pill className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-lg text-ink">
              企微话术助手
            </h1>
            <p className="text-xs text-gray-500">药店私域运营工具</p>
          </div>
        </div>
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              'flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300',
              isActive 
                ? 'bg-primary-600 text-white shadow-card' 
                : 'text-gray-600 hover:bg-primary-50 hover:text-primary-600'
            )}
          >
            <item.icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
      
      <div className="p-4 border-t border-primary-100">
        <div className="bg-primary-50 rounded-xl p-4">
          <p className="text-xs text-primary-700 font-medium mb-1">
            💡 合规提醒
          </p>
          <p className="text-xs text-primary-600">
            所有话术均已通过合规审核，请勿自行修改核心内容。
          </p>
        </div>
      </div>
    </aside>
  );
}
