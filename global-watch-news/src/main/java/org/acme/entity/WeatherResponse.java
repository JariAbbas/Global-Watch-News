package org.acme.entity;

public class WeatherResponse {

    public Main main;
    public Wind wind;
    public Weather[] weather;
    public int visibility;

    public static class Main {
        public double temp;
        public double feels_like;
        public int humidity;
    }

    public static class Wind {
        public double speed;
    }

    public static class Weather {
        public String description;
    }
}