package org.acme.resource;


import jakarta.transaction.Transactional;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import java.time.LocalDateTime;
import java.util.List;

import org.acme.entity.News;

@Path("/api/news")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class NewsResource {

    // GET paginated list
    @GET
    public List<News> getAll(
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        return News.findActive(page, size);
    }

    // GET by ID
    @GET
    @Path("/{id}")
    public Response getById(@PathParam("id") Long id) {
        News news = News.findById(id);
        if (news == null || !news.isActive)
            return Response.status(404).build();
        return Response.ok(news).build();
    }

    // GET by slug
    @GET
    @Path("/slug/{slug}")
    public Response getBySlug(@PathParam("slug") String slug) {
        News news = News.findBySlug(slug);
        if (news == null) return Response.status(404).build();
        return Response.ok(news).build();
    }

    // GET trending
    @GET
    @Path("/trending")
    public List<News> getTrending() {
        return News.findTrending();
    }

    // GET featured
    @GET
    @Path("/featured")
    public List<News> getFeatured() {
        return News.findFeatured();
    }

    // GET by category
    @GET
    @Path("/category/{cat}")
    public List<News> getByCategory(
            @PathParam("cat") String cat,
            @QueryParam("page") @DefaultValue("0") int page,
            @QueryParam("size") @DefaultValue("10") int size) {
        return News.findByCategory(cat, page, size);
    }

    // GET search
    @GET
    @Path("/search")
    public List<News> search(@QueryParam("q") String query) {
        if (query == null || query.isBlank())
            return List.of();
        return News.search(query);
    }

    // POST create
    @POST
    @Transactional
    public Response create(News news) {
        news.persist();
        return Response.status(201).entity(news).build();
    }

    // PUT update
    @PUT
    @Path("/{id}")
    @Transactional
    public Response update(@PathParam("id") Long id, News updated) {
        News news = News.findById(id);
        if (news == null) return Response.status(404).build();

        news.title       = updated.title;
        news.excerpt     = updated.excerpt;
        news.body        = updated.body;
        news.imageUrl    = updated.imageUrl;
        news.author      = updated.author;
        news.authorRole  = updated.authorRole;
        news.category    = updated.category;
        news.source      = updated.source;
        news.isTrending  = updated.isTrending;
        news.isFeatured  = updated.isFeatured;
        news.readTimeMin = updated.readTimeMin;

        return Response.ok(news).build();
    }

    // PATCH trending toggle
    @PATCH
    @Path("/{id}/trending")
    @Transactional
    public Response toggleTrending(@PathParam("id") Long id) {
        News news = News.findById(id);
        if (news == null) return Response.status(404).build();
        news.isTrending = !news.isTrending;
        return Response.ok(news).build();
    }

    // PATCH increment views
    @PATCH
    @Path("/{id}/views")
    @Transactional
    public Response incrementViews(@PathParam("id") Long id) {
        News news = News.findById(id);
        if (news == null) return Response.status(404).build();
        news.views++;
        return Response.ok().build();
    }

    // PATCH disable (soft delete)
    @PATCH
    @Path("/{id}/disable")
    @Transactional
    public Response disable(@PathParam("id") Long id) {
        News news = News.findById(id);
        if (news == null) return Response.status(404).build();
        news.isActive   = false;
        news.disabledAt = LocalDateTime.now();
        return Response.ok(news).build();
    }

    // DELETE hard delete
    @DELETE
    @Path("/{id}")
    @Transactional
    public Response delete(@PathParam("id") Long id) {
        News news = News.findById(id);
        if (news == null) return Response.status(404).build();
        news.delete();
        return Response.noContent().build();
    }


    @PATCH
    @Path("/{id}/enable")
    @Transactional
    public Response enable(@PathParam("id") Long id) {
        News news = News.findById(id);
        if (news == null) return Response.status(404).build();
        news.isActive = true;
        news.disabledAt = null;
        return Response.ok(news).build();
    }
}