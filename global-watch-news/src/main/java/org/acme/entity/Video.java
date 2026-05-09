package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntityBase;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "videos")
public class Video extends PanacheEntityBase {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;

    @Column(nullable = false, length = 500)
    public String title;

    @Column(columnDefinition = "TEXT")
    public String excerpt;

    @Column(columnDefinition = "TEXT")
    public String description;

    @Column(name = "video_url", length = 1000)
    public String videoUrl;

    @Column(name = "thumbnail_url", length = 1000)
    public String thumbnailUrl;

    @Column(length = 20)
    public String duration;

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

    @Column(name = "is_featured")
    public boolean isFeatured = false;

    @Column(name = "is_active")
    public boolean isActive = true;

    @Column
    public long views = 0;

    @Column(name = "published_at")
    public LocalDateTime publishedAt;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
        if (publishedAt == null) publishedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    public static List<Video> findActive(int page, int size) {
        return find("isActive = true ORDER BY publishedAt DESC").page(page, size).list();
    }

    public static List<Video> findFeatured() {
        return find("isFeatured = true AND isActive = true ORDER BY publishedAt DESC").page(0, 1).list();
    }

    public static long countActive() {
        return count("isActive = true");
    }
}