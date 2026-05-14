import { Home, Users, Calendar, BarChart3, Wallet } from 'lucide-react';
import { motion } from 'motion/react';
import { springSnappy } from '../lib/motion';

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
    <nav className="fixed bottom-0 left-0 right-0 z-50">
      {/* Fade gradient above nav */}
      <div className="h-6 bg-gradient-to-t from-surface-0 to-transparent pointer-events-none" />
      {/* Glass nav bar */}
      <div className="bg-surface-1/70 backdrop-blur-2xl backdrop-saturate-150 border-t border-white/[0.06] safe-bottom">
        <div className="flex justify-around items-center h-[56px] max-w-lg mx-auto">
          {tabs.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => onNavigate(id)}
                className="relative flex flex-col items-center gap-[2px] py-1 px-3 transition-colors"
              >
                {isActive && (
                  <motion.span
                    layoutId="tab-indicator"
                    className="absolute -top-px left-1/2 -translate-x-1/2 w-6 h-[2.5px] bg-amber rounded-full"
                    transition={springSnappy}
                  />
                )}
                <motion.div
                  animate={{ y: isActive ? -1 : 0 }}
                  transition={springSnappy}
                >
                  <Icon
                    size={22}
                    strokeWidth={isActive ? 2.2 : 1.4}
                    className={isActive ? 'text-amber' : 'text-white-muted'}
                  />
                </motion.div>
                <span
                  className={`text-[10px] font-medium tracking-[0.02em] ${
                    isActive ? 'text-amber' : 'text-white-muted'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
