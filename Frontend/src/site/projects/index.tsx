import { useEffect, useState } from "react";
import api from "@/services/api";

interface WeatherForecast {
  date: string;
  temperatureC: number;
  temperatureF: number;
  summary: string;
}

const Page = () => {
  const [weatherData, setWeatherData] = useState<WeatherForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWeatherData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await api.get<WeatherForecast[]>("/WeatherForecast");
        setWeatherData(data);
      } catch (err: any) {
        setError(err.message || "Failed to fetch weather data");
        console.error("Error fetching weather data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherData();
  }, []);

  if (loading) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>
        <p>Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>
        <div className="text-red-500">
          <p>Error: {error}</p>
          <p className="text-sm mt-2">
            Make sure you are logged in and the backend API is running on http://localhost:5000
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Weather Forecast</h1>
      {weatherData.length === 0 ? (
        <p>No weather data available</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {weatherData.map((forecast, index) => (
            <div key={index} className="border rounded-lg p-4 shadow-sm">
              <h3 className="font-semibold text-lg mb-2">
                {new Date(forecast.date).toLocaleDateString()}
              </h3>
              <p className="text-gray-600">
                <span className="font-medium">Temperature:</span> {forecast.temperatureC}°C / {forecast.temperatureF}°F
              </p>
              <p className="text-gray-600">
                <span className="font-medium">Summary:</span> {forecast.summary}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Page;