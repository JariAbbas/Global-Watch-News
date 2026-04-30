package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "news")
public class News extends PanacheEntity {

    @Column(nullable = false, length = 500)
    public String title;

    @Column(unique = true, length = 600)
    public String slug;

    @Column(columnDefinition = "TEXT")
    public String excerpt;

    @Column(columnDefinition = "TEXT")
    public String body;

    @Column(name = "image_url", length = 1000)
    public String imageUrl;

    @Column(name = "image_caption", length = 500)
    public String imageCaption;

    @Column(length = 200)
    public String source;

    @Column(name = "source_url", length = 1000)
    public String sourceUrl;

    @Column(length = 200)
    public String author;

    @Column(name = "author_role", length = 200)
    public String authorRole;

    @Column(length = 50)
    public String category;

    @Column(name = "is_trending")
    public boolean isTrending = false;

    @Column(name = "is_featured")
    public boolean isFeatured = false;

    @Column(name = "is_active")
    public boolean isActive = true;

    @Column
    public long views = 0;

    @Column(name = "read_time_min")
    public int readTimeMin = 3;

    @Column(name = "published_at")
    public LocalDateTime publishedAt;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @Column(name = "disabled_at")
    public LocalDateTime disabledAt;

    // ===== LIFECYCLE =====
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (publishedAt == null) publishedAt = LocalDateTime.now();
        if (slug == null || slug.isEmpty()) slug = generateSlug(title);
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ===== SLUG GENERATOR =====
    public static String generateSlug(String title) {
        return title.toLowerCase()
                .replaceAll("[^a-z0-9\\s-]", "")
                .replaceAll("\\s+", "-")
                .replaceAll("-+", "-")
                + "-" + System.currentTimeMillis();
    }

    // ===== QUERIES =====
    public static List<News> findActive(int page, int size) {
        return find("isActive = true ORDER BY publishedAt DESC")
                .page(page, size).list();
    }

    public static List<News> findByCategory(String category, int page, int size) {
        return find("category = ?1 and isActive = true ORDER BY publishedAt DESC",
                category).page(page, size).list();
    }

    public static List<News> findTrending() {
        return find("isTrending = true and isActive = true ORDER BY views DESC")
                .page(0, 10).list();
    }

    public static List<News> findFeatured() {
        return find("isFeatured = true and isActive = true ORDER BY publishedAt DESC")
                .page(0, 5).list();
    }

    public static List<News> search(String query) {
        String q = "%" + query.toLowerCase() + "%";
        return find("isActive = true and (LOWER(title) LIKE ?1 or LOWER(excerpt) LIKE ?1 or LOWER(body) LIKE ?1)", q)
                .page(0, 20).list();
    }

    public static News findBySlug(String slug) {
        return find("slug = ?1 and isActive = true", slug).firstResult();
    }
}