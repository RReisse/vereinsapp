import { useEffect, useState } from 'react';
import { ArrowLeft, Pencil, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import type { Player } from '../types';
import JerseyIcon from './JerseyIcon';
import { springGentle, fadeUp } from '../lib/motion';

interface PlayerDetailProps {
  player: Player;
  onBack: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (value === 0) { setDisplay(0); return; }
    const duration = 600;
    const start = performance.now();
    function tick(now: number) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      setDisplay(Math.round(eased * value));
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }, [value]);

  return <>{display}</>;
}

export default function PlayerDetail({ player, onBack, onEdit, onDelete }: PlayerDetailProps) {
  return (
    <div className="min-h-screen bg-surface-0">
      {/* Header */}
      <div className="relative overflow-hidden safe-top">
        <div className="absolute inset-0 animated-header-gradient" />
        <div className="absolute inset-0 shimmer-overlay" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
        />

        <div className="relative">
          <div className="flex items-center justify-between px-4 py-3">
            <motion.button
              onClick={onBack}
              whileTap={{ scale: 0.9 }}
              className="p-1.5 text-white hover:bg-white/15 rounded-full transition-colors"
            >
              <ArrowLeft size={22} />
            </motion.button>
            <div className="flex gap-1">
              <motion.button
                onClick={onEdit}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:bg-white/15 rounded-full transition-colors"
              >
                <Pencil size={17} />
              </motion.button>
              <motion.button
                onClick={onDelete}
                whileTap={{ scale: 0.9 }}
                className="p-2 text-white hover:bg-white/15 rounded-full transition-colors"
              >
                <Trash2 size={17} />
              </motion.button>
            </div>
          </div>

          <motion.div
            variants={fadeUp}
            initial="hidden"
            animate="show"
            className="flex flex-col items-center pb-8"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={springGentle}
            >
              <JerseyIcon number={player.number} size={80} />
            </motion.div>
            <h1
              className="text-[22px] font-bold text-white mt-3 tracking-[-0.02em]"
              style={{ textShadow: '0 2px 8px rgba(0,0,0,0.15)' }}
            >
              {player.name}
            </h1>
            <div className="flex items-center gap-2 mt-1.5">
              <span className="text-white/70 font-medium text-[14px]">{player.position}</span>
              <span
                className={`w-[8px] h-[8px] rounded-full ${
                  player.status === 'verletzt' ? 'status-dot-injured' : ''
                }`}
                style={{
                  backgroundColor: player.status === 'fit' ? 'var(--color-fit)' : 'var(--color-injured)',
                  boxShadow: player.status === 'fit' ? '0 0 0 2px #32d74b33' : '0 0 0 2px #ff453a33',
                }}
              />
              <span className="text-white/60 text-[13px]">
                {player.status === 'fit' ? 'Fit' : 'Verletzt'}
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats */}
      <div className="px-4 pt-5">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ ...springGentle, delay: 0.15 }}
          className="grid grid-cols-3 rounded-2xl overflow-hidden border border-border-strong bg-surface-1"
        >
          {[
            { label: 'Alter', value: player.age },
            { label: 'Spiele', value: player.games },
            { label: 'Tore', value: player.goals },
          ].map((stat, i) => (
            <div
              key={stat.label}
              className={`py-5 text-center ${i < 2 ? 'border-r border-border' : ''}`}
            >
              <div className="text-[26px] font-bold text-white tabular-nums">
                <AnimatedNumber value={stat.value} />
              </div>
              <div className="text-[10px] text-white-muted uppercase tracking-[0.14em] mt-1 font-medium">{stat.label}</div>
            </div>
          ))}
        </motion.div>

        {player.status === 'verletzt' && player.injury && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ ...springGentle, delay: 0.25 }}
            className="mt-4 p-4 bg-injured/8 border border-injured/20 border-l-2 border-l-injured rounded-2xl"
          >
            <div className="text-[10px] text-injured font-bold uppercase tracking-[0.14em]">Verletzung</div>
            <div className="text-[14px] text-white mt-1.5">{player.injury}</div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
