package org.acme.webclient;

import org.acme.entity.WeatherResponse;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;

@Path("/data/2.5/weather")
@RegisterRestClient(configKey = "weather-api")
public interface WeatherClient {

    @GET
    WeatherResponse get(
        @QueryParam("q") String city,
        @QueryParam("appid") String apiKey,
        @QueryParam("units") String units
    );
}