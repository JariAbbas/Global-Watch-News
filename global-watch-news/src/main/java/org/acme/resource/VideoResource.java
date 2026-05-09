package org.acme.resource;

import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.acme.entity.Video;
import java.util.List;

@Path("/api/videos")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class VideoResource {

    @GET
    public Response getAll(
        @QueryParam("page") @DefaultValue("0") int page,
        @QueryParam("size") @DefaultValue("12") int size
    ) {
        List<Video> videos = Video.findActive(page, size);
        long total = Video.countActive();
        return Response.ok(new PagedResponse(videos, total, page, size)).build();
    }

    @GET
    @Path("/featured")
    public Response getFeatured() {
        return Response.ok(Video.findFeatured()).build();
    }

    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        Video v = Video.findById(id);
        if (v == null || !v.isActive)
            return Response.status(Response.Status.NOT_FOUND).build();
        return Response.ok(v).build();
    }

    @POST
    @Transactional
    public Response create(Video video) {
        video.id = null;
        video.persist();
        return Response.status(Response.Status.CREATED).entity(video).build();
    }

    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, Video updated) {
        Video v = Video.findById(id);
        if (v == null) return Response.status(Response.Status.NOT_FOUND).build();
        v.title       = updated.title;
        v.excerpt     = updated.excerpt;
        v.description = updated.description;
        v.videoUrl    = updated.videoUrl;
        v.thumbnailUrl= updated.thumbnailUrl;
        v.duration    = updated.duration;
        v.source      = updated.source;
        v.sourceUrl   = updated.sourceUrl;
        v.author      = updated.author;
        v.authorRole  = updated.authorRole;
        v.category    = updated.category;
        v.isFeatured  = updated.isFeatured;
        v.isActive    = updated.isActive;
        return Response.ok(v).build();
    }

    @PATCH
    @Path("/{id}/views")
    @Transactional
    public Response incrementViews(@PathParam("id") Long id) {
        Video v = Video.findById(id);
        if (v == null) return Response.status(Response.Status.NOT_FOUND).build();
        v.views++;
        return Response.ok().build();
    }

    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        Video v = Video.findById(id);
        if (v == null) return Response.status(Response.Status.NOT_FOUND).build();
        v.isActive = false;
        return Response.noContent().build();
    }

    public record PagedResponse(List<Video> content, long total, int page, int size) {}
}