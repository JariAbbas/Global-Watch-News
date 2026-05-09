package org.acme.resource;

import java.util.Map;

import org.acme.service.WeatherService;

import jakarta.inject.Inject;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;

@Path("/weather")
public class WeatherResource {

    @Inject
    WeatherService service;

    @GET
    public Map<String, Object> get(@QueryParam("city") String city) {
        return service.getDashboard(city);
    }
}