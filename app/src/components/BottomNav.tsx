import { Home, Users, Calendar, BarChart3, Wallet } from 'lucide-react';

const tabs = [
  { id: 'uebersicht', label: 'Übersicht', icon: Home },
  { id: 'kader', label: 'Kader', icon: Users },
  { id: 'kalender', label: 'Kalender', icon: Calendar },
  { id: 'statistik', label: 'Statistik', icon: BarChart3 },
  { id: 'kasse', label: 'Kasse', icon: Wallet },
] as const;

interface BottomNavProps {
  active: string;
  onNavigate: (tab: string) => void;
}

export default function BottomNav({ active, onNavigate }: BottomNavProps) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-nav-bg border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-[52px] max-w-lg mx-auto">
        {tabs.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNavigate(id)}
              className={`flex flex-col items-center gap-[2px] py-1 px-3 transition-colors ${
                isActive ? 'text-primary-dark' : 'text-text-secondary'
              }`}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.5} />
              <span className="text-[10px] font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
