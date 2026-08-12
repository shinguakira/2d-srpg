export function FormulasView() {
  return (
    <div className="debug-screen__reference" data-testid="debug-formulas-view">
      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Damage</h3>
        <div className="debug-screen__formula">
          Physical: STR + weapon.might - DEF - terrain.defenseBonus
        </div>
        <div className="debug-screen__formula">
          Magic (proficient): MAG + weapon.might - RES - terrain.defenseBonus
        </div>
        <div className="debug-screen__formula">
          Magic (non-proficient): STR + weapon.might - DEF - terrain.defenseBonus
        </div>
        <p className="debug-screen__desc-text">
          Effective damage: weapon.might x 3 (triple might vs effective targets)
        </p>
        <p className="debug-screen__desc-text">
          Weapon triangle: +1 damage (advantage), -1 damage (disadvantage)
        </p>
        <p className="debug-screen__desc-text">Non-proficient penalty: -2 damage</p>
        <p className="debug-screen__desc-text">Minimum damage: 0</p>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Skill</th>
              <th>Effect</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Tri-Magic</td>
              <td>x1.5 damage (all tomes)</td>
            </tr>
            <tr>
              <td>Vengeance</td>
              <td>+30% damage when HP &le; 25%</td>
            </tr>
            <tr>
              <td>Ironwall</td>
              <td>Adjacent allies take -50% damage</td>
            </tr>
            <tr>
              <td>Light vs Corrupted</td>
              <td>+50% damage (CRP &gt; 0)</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Hit %</h3>
        <div className="debug-screen__formula">Accuracy = SKL x 2 + LCK + weapon.hit</div>
        <div className="debug-screen__formula">Evade = SPD x 2 + LCK + terrain.avoidBonus</div>
        <div className="debug-screen__formula">Hit% = Accuracy - Evade</div>
        <p className="debug-screen__desc-text">
          Weapon triangle: +15 hit (advantage), -15 hit (disadvantage)
        </p>
        <p className="debug-screen__desc-text">Non-proficient penalty: -20 hit</p>
        <p className="debug-screen__desc-text">ATT &gt; 80: +5 hit bonus</p>
        <p className="debug-screen__desc-text">Clamped: 0-100%</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Crit %</h3>
        <div className="debug-screen__formula">
          Crit = floor(SKL / 2) + weapon.crit - defender.LCK
        </div>
        <p className="debug-screen__desc-text">Wrath skill: +20 crit when attacker HP &le; 50%</p>
        <p className="debug-screen__desc-text">Class bonus crit (e.g., Berserker +15)</p>
        <p className="debug-screen__desc-text">Clamped: 0-100%</p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Doubling</h3>
        <div className="debug-screen__formula">Doubles if: attacker.SPD - defender.SPD &ge; 5</div>
        <p className="debug-screen__desc-text">Pursuit skill: threshold reduced to &ge; 3</p>
        <p className="debug-screen__desc-text">
          Quick Riposte: guaranteed double on counter-attack when HP &ge; 70%
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Weapon Triangle</h3>
        <table className="debug-screen__table">
          <thead>
            <tr>
              <th>Type</th>
              <th>Advantage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Physical</td>
              <td>Sword &gt; Axe &gt; Lance &gt; Sword</td>
            </tr>
            <tr>
              <td>Magic</td>
              <td>Fire &gt; Wind &gt; Thunder &gt; Fire</td>
            </tr>
            <tr>
              <td>Dark / Light</td>
              <td>Mutual advantage</td>
            </tr>
          </tbody>
        </table>
        <p className="debug-screen__desc-text">
          Winner: +1 damage, +15 hit. Loser: -1 damage, -15 hit.
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">EXP</h3>
        <div className="debug-screen__formula">
          Base EXP = 30 + (defender.level - attacker.level) x 5
        </div>
        <div className="debug-screen__formula">Kill bonus: +50 EXP</div>
        <p className="debug-screen__desc-text">Minimum: 5 EXP. Maximum: 100 EXP.</p>
        <p className="debug-screen__desc-text">
          Level-up threshold: 100 EXP total (resets to 0 after level-up)
        </p>
      </div>

      <div className="debug-screen__section">
        <h3 className="debug-screen__section-title">Level-Up</h3>
        <p className="debug-screen__desc-text">
          For each stat: roll RNG (0-99) vs class growth rate percentage.
        </p>
        <p className="debug-screen__desc-text">
          If roll &lt; growth rate: +1 to that stat. Otherwise: +0.
        </p>
        <p className="debug-screen__desc-text">MOV does not grow on level-up.</p>
      </div>
    </div>
  );
}
