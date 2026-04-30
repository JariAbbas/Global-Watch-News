package org.acme.resource;



import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.List;

import org.acme.entity.Ticker;

@Path("/api/tickers")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class TickerResource {

    // GET active tickers (max 10)
    @GET
    @Path("/active")
    public List<Ticker> getActive() {
        return Ticker.findActive();
    }

    // GET all (admin)
    @GET
    @Path("/all")
    public List<Ticker> getAll() {
        return Ticker.findAll_Admin();
    }

    // POST create
    @POST
    @Transactional
    public Response create(Ticker ticker) {
        ticker.persist();
        return Response.status(201).entity(ticker).build();
    }

    // PUT update
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Ticker updated) {
        Ticker ticker = Ticker.findById(id);
        if (ticker == null) return Response.status(404).build();

        ticker.content  = updated.content;
        ticker.type     = updated.type;
        ticker.priority = updated.priority;

        return Response.ok(ticker).build();
    }

    // PATCH disable
    @PATCH
    @Path("/{id}/disable")
    @Transactional
    public Response disable(@PathParam("id") Long id) {
        Ticker ticker = Ticker.findById(id);
        if (ticker == null) return Response.status(404).build();

        ticker.isActive    = false;
        ticker.disabledAt  = LocalDateTime.now();

        return Response.ok(ticker).build();
    }

    // PATCH enable
    @PATCH
    @Path("/{id}/enable")
    @Transactional
    public Response enable(@PathParam("id") Long id) {
        Ticker ticker = Ticker.findById(id);
        if (ticker == null) return Response.status(404).build();

        ticker.isActive   = true;
        ticker.disabledAt = null;

        return Response.ok(ticker).build();
    }

    // DELETE
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Ticker ticker = Ticker.findById(id);
        if (ticker == null) return Response.status(404).build();
        ticker.delete();
        return Response.noContent().build();
    }
}