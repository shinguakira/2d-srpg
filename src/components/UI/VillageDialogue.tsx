import { useGameStore } from '../../stores/gameStore';
import { WEAPONS } from '../../data/weapons';
import { useT } from '../../i18n/useT';

export function VillageDialogue() {
  const T = useT();
  const playerAction = useGameStore((s) => s.playerAction);
  const villageReward = useGameStore((s) => s.villageReward);
  const dismissVillageReward = useGameStore((s) => s.dismissVillageReward);

  if (playerAction !== 'village_visit' || !villageReward) return null;

  const weapon = WEAPONS[villageReward.weaponId];
  const weaponName = weapon ? weapon.name : villageReward.weaponId;

  return (
    <div className="village-dialogue" data-testid="village-dialogue" onClick={dismissVillageReward}>
      <div className="village-dialogue__panel">
        <div className="village-dialogue__speaker" data-testid="village-speaker">
          {T.name(villageReward.speaker)}
        </div>
        <div className="village-dialogue__text" data-testid="village-text">
          {T.t(villageReward.dialogue)}
        </div>
        <div className="village-dialogue__reward" data-testid="village-reward">
          {T.lang === 'ja' ? `${T.weapon(weaponName)}を手に入れた！` : `Received ${weaponName}!`}
        </div>
        <div className="village-dialogue__hint">
          {T.lang === 'ja' ? 'クリックで進む' : 'Click to continue'}
        </div>
      </div>
    </div>
  );
}
