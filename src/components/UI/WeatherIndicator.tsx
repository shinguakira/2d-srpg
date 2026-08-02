import { useGameStore } from '../../stores/gameStore';
import { getWeatherInfo } from '../../core/weather';
import { useState } from 'react';

export function WeatherIndicator() {
  const weather = useGameStore((s) => s.weather);
  const [showTooltip, setShowTooltip] = useState(false);

  if (weather === 'clear') return null;

  const info = getWeatherInfo(weather);

  return (
    <div
      className="weather-indicator"
      data-testid="weather-indicator"
      onMouseEnter={() => setShowTooltip(true)}
      onMouseLeave={() => setShowTooltip(false)}
    >
      <span className="weather-indicator__icon">{info.icon}</span>
      <span className="weather-indicator__name">{info.name}</span>
      {showTooltip && (
        <div className="weather-indicator__tooltip" data-testid="weather-tooltip">
          {info.effects.map((e, i) => (
            <div key={i} className="weather-indicator__effect">
              {e}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
