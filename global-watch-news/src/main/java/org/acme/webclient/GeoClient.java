package org.acme.webclient;

import java.util.List;

import org.acme.entity.Location;
import org.acme.entity.WeatherResponse;
import org.eclipse.microprofile.rest.client.inject.RegisterRestClient;

import jakarta.ws.rs.GET;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.QueryParam;


@Path("/geo/1.0/reverse")
@RegisterRestClient(configKey = "weather-api")
public interface GeoClient {

    @GET
    List<Location> reverse(
        @QueryParam("lat") double lat,
        @QueryParam("lon") double lon,
        @QueryParam("limit") int limit,
        @QueryParam("appid") String key
    );
}