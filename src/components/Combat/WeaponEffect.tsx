import type { WeaponType } from '../../core/types';

type WeaponEffectProps = {
  weaponType: WeaponType;
  side: 'left' | 'right'; // which side the attacker is on
};

/** Renders a weapon-specific impact/trail effect as an SVG overlay */
export function WeaponEffect({ weaponType, side }: WeaponEffectProps) {
  const mirror = side === 'right' ? 'scaleX(-1)' : undefined;

  switch (weaponType) {
    case 'sword':
      return (
        <svg className="weapon-effect weapon-effect--slash" width="60" height="60" viewBox="0 0 60 60" style={{ transform: mirror }}>
          <line x1="10" y1="50" x2="50" y2="10" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="weapon-effect__line" />
          <line x1="10" y1="50" x2="50" y2="10" stroke="#93c5fd" strokeWidth="1.5" strokeLinecap="round" className="weapon-effect__line weapon-effect__line--glow" />
        </svg>
      );

    case 'lance':
      return (
        <svg className="weapon-effect weapon-effect--thrust" width="80" height="20" viewBox="0 0 80 20" style={{ transform: mirror }}>
          <line x1="0" y1="10" x2="70" y2="10" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="weapon-effect__line" />
          <polygon points="70,4 80,10 70,16" fill="#c0c0c0" className="weapon-effect__tip" />
        </svg>
      );

    case 'axe':
      return (
        <svg className="weapon-effect weapon-effect--arc" width="60" height="60" viewBox="0 0 60 60" style={{ transform: mirror }}>
          <path d="M 15,50 Q 10,25 30,10 Q 50,25 45,50" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" className="weapon-effect__arc" />
          <path d="M 15,50 Q 10,25 30,10 Q 50,25 45,50" fill="none" stroke="#fca5a5" strokeWidth="1.5" strokeLinecap="round" className="weapon-effect__arc weapon-effect__arc--glow" />
        </svg>
      );

    case 'fire':
      return (
        <svg className="weapon-effect weapon-effect--fire" width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="8" fill="#ef4444" opacity="0.8" className="weapon-effect__flame weapon-effect__flame--outer" />
          <circle cx="25" cy="25" r="5" fill="#fbbf24" opacity="0.9" className="weapon-effect__flame weapon-effect__flame--mid" />
          <circle cx="25" cy="25" r="2" fill="#fff" opacity="0.9" className="weapon-effect__flame weapon-effect__flame--core" />
          <circle cx="25" cy="20" r="4" fill="#ef4444" opacity="0.5" className="weapon-effect__flame weapon-effect__flame--flicker" />
        </svg>
      );

    case 'thunder':
      return (
        <svg className="weapon-effect weapon-effect--thunder" width="40" height="70" viewBox="0 0 40 70">
          <polyline points="20,0 15,20 25,25 12,45 22,48 18,70" fill="none" stroke="#fbbf24" strokeWidth="3" strokeLinejoin="round" className="weapon-effect__bolt" />
          <polyline points="20,0 15,20 25,25 12,45 22,48 18,70" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinejoin="round" className="weapon-effect__bolt weapon-effect__bolt--core" />
        </svg>
      );

    case 'wind':
      return (
        <svg className="weapon-effect weapon-effect--wind" width="50" height="50" viewBox="0 0 50 50" style={{ transform: mirror }}>
          <path d="M 5,20 Q 20,10 35,20 Q 50,30 35,40" fill="none" stroke="#86efac" strokeWidth="2" className="weapon-effect__gust weapon-effect__gust--1" />
          <path d="M 8,30 Q 25,18 40,30 Q 52,40 38,45" fill="none" stroke="#22c55e" strokeWidth="1.5" className="weapon-effect__gust weapon-effect__gust--2" />
          <path d="M 3,35 Q 18,28 33,35" fill="none" stroke="#86efac" strokeWidth="1" className="weapon-effect__gust weapon-effect__gust--3" />
        </svg>
      );

    case 'staff':
      return (
        <svg className="weapon-effect weapon-effect--heal" width="50" height="50" viewBox="0 0 50 50">
          <circle cx="25" cy="25" r="15" fill="none" stroke="#fbbf24" strokeWidth="2" opacity="0.6" className="weapon-effect__glow weapon-effect__glow--outer" />
          <circle cx="25" cy="25" r="8" fill="none" stroke="#fff" strokeWidth="1.5" opacity="0.8" className="weapon-effect__glow weapon-effect__glow--inner" />
          <line x1="25" y1="15" x2="25" y2="35" stroke="#fbbf24" strokeWidth="2" className="weapon-effect__cross" />
          <line x1="15" y1="25" x2="35" y2="25" stroke="#fbbf24" strokeWidth="2" className="weapon-effect__cross" />
        </svg>
      );

    default:
      return null;
  }
}
