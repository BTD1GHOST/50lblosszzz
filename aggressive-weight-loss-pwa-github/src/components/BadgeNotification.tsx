import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';

export default function BadgeNotification() {
  const { badges } = useStore();
  const [notification, setNotification] = useState<{ icon: string; name: string; xp: number } | null>(null);
  const [seenBadges, setSeenBadges] = useState<Set<string>>(new Set());

  useEffect(() => {
    const newlyUnlocked = badges.find(b => b.unlocked && b.unlockedDate === new Date().toISOString().split('T')[0] && !seenBadges.has(b.id));
    if (newlyUnlocked) {
      setNotification({ icon: newlyUnlocked.icon, name: newlyUnlocked.name, xp: newlyUnlocked.xp });
      setSeenBadges(prev => new Set([...prev, newlyUnlocked.id]));
      setTimeout(() => setNotification(null), 4000);
    }
  }, [badges, seenBadges]);

  if (!notification) return null;

  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 animate-bounce">
      <div className="bg-yellow-500 text-black px-6 py-3 rounded-2xl shadow-xl flex items-center gap-3 max-w-xs">
        <span className="text-3xl">{notification.icon}</span>
        <div>
          <div className="font-black text-sm">BADGE UNLOCKED!</div>
          <div className="font-bold">{notification.name}</div>
          <div className="text-xs">+{notification.xp} XP</div>
        </div>
      </div>
    </div>
  );
}
