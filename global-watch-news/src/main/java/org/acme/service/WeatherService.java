package org.acme.service;

import java.util.HashMap;
import java.util.Map;

import org.acme.entity.Location;
import org.acme.entity.WeatherResponse;
import org.acme.webclient.GeoClient;
import org.acme.webclient.WeatherClient;
import org.eclipse.microprofile.config.inject.ConfigProperty;
import org.eclipse.microprofile.rest.client.inject.RestClient;

import jakarta.enterprise.context.ApplicationScoped;

@ApplicationScoped
public class WeatherService {

    @RestClient
    WeatherClient weatherClient;

    @RestClient
    GeoClient geoClient;

    @ConfigProperty(name = "weather.api.key")
    String apiKey;

    public Map<String, Object> getDashboard(String city) {

        if (city == null || city.isBlank()) {
            city = "Karachi";
        }

        WeatherResponse res = weatherClient.get(city, apiKey, "metric");

        if (res == null || res.main == null) {
            throw new RuntimeException("Invalid weather response");
        }

        WeatherResponse.Main c = res.main;

        Map<String, Object> ui = new HashMap<>();

        ui.put("location", city + ", PK");
        ui.put("temp", Math.round(c.temp) + "°");
        ui.put("feelsLike", Math.round(c.feels_like) + "°C");
        ui.put("humidity", c.humidity + "%");

        ui.put("wind", res.wind != null ? res.wind.speed + " km/h" : "0 km/h");

        ui.put("visibility", res.visibility / 1000 + " km");

        ui.put("condition",
                res.weather != null ? res.weather[0].description : "Unknown"
        );

        return ui;
    }
}