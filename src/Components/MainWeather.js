import React, { useEffect, useState } from "react";
import { APIKEY } from "./constant";

const MainWeather = () => {
  const [data, setData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [cities, setCities] = useState(["Indore", "Bhopal", "Goa", "Pune", "Delhi"]);
  const [sortOrder, setSortOrder] = useState("asc");
  const [inputValue, setInputValue] = useState("");
  const [searchedCity, setSearchedCity] = useState("");

  const fetchData = async (city) => {
    const res = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}&units=metric`
    );
    const data = await res.json();

    if (data && data.name) {
      setCityData((prevData) => [...prevData, data]);
    }
  };

  useEffect(() => {
    setCityData([]);
    cities.forEach((city) => {
      fetchData(city);
    });
  }, [cities]);

  useEffect(() => {
    if (cityData.length === cities.length) {
      setData(cityData.map((city) => ({ cityName: city.name })));
    }
  }, [cityData, cities]);

  const handleSort = () => {
    const sortedData = [...data];
    sortedData.sort((a, b) => {
      const tempA = cityData.find((city) => city.name === a.cityName)?.main?.temp || 0;
      const tempB = cityData.find((city) => city.name === b.cityName)?.main?.temp || 0;
      if (sortOrder === "asc") {
        return tempA - tempB;
      } else {
        return tempB - tempA;
      }
    });
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    setData(sortedData);
  };

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (inputValue.trim() !== "") {
      setCities((prevCities) => [...prevCities, inputValue.trim()]);
      setInputValue("");
      setSearchedCity(inputValue.trim());
    }
  };

  return (
    <div>
      <div className="formINput">
        <form onSubmit={handleSearch}>
          <input
            type="text"
            value={inputValue}
            onChange={handleInputChange}
            placeholder="Enter city name"
            className="input"
          />
          <button type="submit" className="submitButton">
            Submit
          </button>
        </form>
      </div>
      {searchedCity && (
        <div>
          Searched City: {searchedCity} - Current Temperature:{" "}
          {cityData.find((city) => city.name === searchedCity)?.main?.temp}&deg;C
        </div>
      )}

      <div className="TableMain">
        <table className="table">
          <thead>
            <tr>
              <th>City Name</th>
              <th>Humidity</th>
              <th onClick={handleSort} className="sortable">
                Temp (&deg;C) <span className="sort-order">{sortOrder === "asc" ? "▲" : "▼"}</span>
              </th>
              <th>Maximum Temp (&deg;C)</th>
              <th>Minimum Temp (&deg;C)</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => (
              <tr key={index}>
                <td>{item.cityName}</td>
                <td>{cityData[index]?.main?.humidity}</td>
                <td
                  className={cityData[index]?.main?.temp > 25 ? "hot-temperature" : "cold-temperature"}
                >
                  <span className="temperature-icon"></span>
                  {cityData[index]?.main?.temp}
                </td>
                <td>{cityData[index]?.main?.temp_max}</td>
                <td>{cityData[index]?.main?.temp_min}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MainWeather;
