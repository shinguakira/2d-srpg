const BEHAVIORS = [
  {
    id: 'aggressive',
    name: 'Aggressive',
    summary: 'Default. Seeks nearest player, prioritizes kills.',
    description:
      'Moves toward the nearest reachable player unit. Uses scoreTarget() to evaluate all attackable targets and picks the one with the highest expected value (damage x hit rate). Prioritizes kills and low-HP targets.',
    params: null,
  },
  {
    id: 'stationary',
    name: 'Stationary',
    summary: 'Stays in place, attacks units in range.',
    description:
      'Never moves from its starting position. Only attacks player units that move within its attack range. Useful for corridor guards and map obstacles.',
    params: null,
  },
  {
    id: 'boss',
    name: 'Boss',
    summary: 'Like stationary but heals on throne/fort.',
    description:
      'Behaves like stationary — stays on its tile and attacks units in range. Additionally heals each turn if standing on a throne or fort tile. Enhanced survival priority makes it prefer defensive actions.',
    params: null,
  },
  {
    id: 'guard',
    name: 'Guard',
    summary: 'Patrols within radius of guard point.',
    description:
      'Patrols within a defined radius of its guard point. Attacks any player unit that enters the radius. Returns to guard position when no targets are in range. Can optionally follow a patrol path.',
    params: 'radius: number, patrolPath?: Position[]',
  },
  {
    id: 'survival',
    name: 'Survival',
    summary: 'Prioritizes escaping, seeks forts for healing.',
    description:
      'Prioritizes fleeing from threats. Moves away from the nearest player units. Seeks fort tiles for healing when HP is low. Only attacks if cornered with no escape route.',
    params: null,
  },
  {
    id: 'thief',
    name: 'Thief',
    summary: 'Targets chests/villages, avoids combat.',
    description:
      'Moves toward chest and village tiles to loot them. Avoids combat whenever possible. If a target position is set, heads directly there. Steals items from adjacent player units when possible.',
    params: 'targetPosition?: Position',
  },
  {
    id: 'healer',
    name: 'Healer',
    summary: 'Heals injured allies with staves.',
    description:
      'Targets injured allied units with healing staves. Stays behind the front line to avoid being attacked. Prioritizes the most injured ally within healing range. Moves toward injured allies if none are in range.',
    params: null,
  },
  {
    id: 'escort',
    name: 'Escort',
    summary: 'Protects a specific unit, stays adjacent.',
    description:
      "Follows and protects a designated unit. Stays adjacent to the escort target at all times. Attacks any threat that comes within range of the escorted unit. Prioritizes the escort target's safety over dealing damage.",
    params: 'targetUnitId: string',
  },
  {
    id: 'coordinated',
    name: 'Coordinated',
    summary: 'Group tactics, waits for allies.',
    description:
      'Uses group tactics — waits until allied units in the same group are in position before attacking. Coordinates with other "coordinated" units sharing the same groupId to attack simultaneously for maximum impact.',
    params: 'groupId: string',
  },
  {
    id: 'ambush',
    name: 'Ambush',
    summary: 'Waits until player enters trigger range.',
    description:
      'Remains hidden/inactive until a player unit enters the trigger radius. Once triggered, permanently switches to aggressive behavior. Useful for surprise encounters and trap setups.',
    params: 'triggerRadius: number',
  },
] as const;

export function AIBehaviorsView({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const selected = BEHAVIORS.find((b) => b.id === selectedId) ?? null;

  return (
    <div className="debug-screen__split">
      <div className="debug-screen__list">
        {BEHAVIORS.map((b) => (
          <button
            key={b.id}
            className={`debug-screen__entry ${b.id === selectedId ? 'debug-screen__entry--selected' : ''}`}
            data-testid={`debug-ai-${b.id}`}
            onClick={() => onSelect(b.id)}
          >
            <div className="debug-screen__entry-info">
              <span className="debug-screen__entry-name">{b.name}</span>
              <span className="debug-screen__entry-meta">
                <span className="debug-screen__entry-class">{b.summary}</span>
              </span>
            </div>
          </button>
        ))}
      </div>

      <div className="debug-screen__detail">
        {selected ? (
          <BehaviorDetail behavior={selected} />
        ) : (
          <div className="debug-screen__empty">Select a behavior to view details</div>
        )}
      </div>
    </div>
  );
}

function BehaviorDetail({ behavior }: { behavior: (typeof BEHAVIORS)[number] }) {
  return (
    <div data-testid={`debug-detail-${behavior.id}`}>
      <div className="debug-screen__detail-header">
        <div className="debug-screen__detail-header-info">
          <h2 className="debug-screen__detail-name">{behavior.name}</h2>
          <span
            className="debug-screen__badge debug-screen__badge--large"
            style={{ background: '#7c3aed' }}
          >
            AI Behavior
          </span>
        </div>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Description</h3>
        <p className="debug-screen__desc-text">{behavior.description}</p>
      </div>

      {behavior.params && (
        <div className="debug-screen__section">
          <h3 className="debug-screen__section-title">Parameters</h3>
          <div className="debug-screen__formula">{behavior.params}</div>
        </div>
      )}

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Target Scoring Formula</h3>
        <p className="debug-screen__desc-text">
          Used by all combat-capable behaviors to pick the best attack target:
        </p>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Factor</th>
              <th>Score</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Kill potential</td>
              <td style={{ color: '#ef4444' }}>+100</td>
            </tr>
            <tr>
              <td>Damage dealt</td>
              <td>x2</td>
            </tr>
            <tr>
              <td>Hit chance</td>
              <td>x0.5</td>
            </tr>
            <tr>
              <td>Low HP target</td>
              <td style={{ color: '#fbbf24' }}>+30 (proportional to missing HP)</td>
            </tr>
            <tr>
              <td>Counter damage</td>
              <td style={{ color: '#ef4444' }}>-penalty (proportional to threat)</td>
            </tr>
            <tr>
              <td>Terrain advantage</td>
              <td style={{ color: '#22c55e' }}>+10</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
