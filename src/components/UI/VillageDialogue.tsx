import { useGameStore } from '../../stores/gameStore';
import { WEAPONS } from '../../data/weapons';

export function VillageDialogue() {
  const playerAction = useGameStore((s) => s.playerAction);
  const villageReward = useGameStore((s) => s.villageReward);
  const dismissVillageReward = useGameStore((s) => s.dismissVillageReward);

  if (playerAction !== 'village_visit' || !villageReward) return null;

  const weapon = WEAPONS[villageReward.weaponId];
  const weaponName = weapon ? weapon.name : villageReward.weaponId;

  return (
    <div
      className="village-dialogue"
      data-testid="village-dialogue"
      onClick={dismissVillageReward}
    >
      <div className="village-dialogue__panel">
        <div className="village-dialogue__speaker" data-testid="village-speaker">
          {villageReward.speaker}
        </div>
        <div className="village-dialogue__text" data-testid="village-text">
          {villageReward.dialogue}
        </div>
        <div className="village-dialogue__reward" data-testid="village-reward">
          Received {weaponName}!
        </div>
        <div className="village-dialogue__hint">Click to continue</div>
      </div>
    </div>
  );
}
