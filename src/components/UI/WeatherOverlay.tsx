import { useGameStore } from '../../stores/gameStore';
import '../../styles/ui/weather.css';

export function WeatherOverlay() {
  const weather = useGameStore((s) => s.weather);

  if (weather === 'clear') return null;

  return (
    <div
      className={`weather-overlay weather-overlay--${weather}`}
      data-testid="weather-overlay"
      data-weather={weather}
    />
  );
}
