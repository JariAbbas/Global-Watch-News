package org.acme.entity;

import io.quarkus.hibernate.orm.panache.PanacheEntity;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "ticker")
public class Ticker extends PanacheEntity {

    @Column(nullable = false, length = 5000)
    public String content;

    @Column(length = 20)
    public String type = "UPDATE"; // BREAKING, UPDATE, ALERT, INFO

    @Column
    public int priority = 0;

    @Column(name = "is_active")
    public boolean isActive = true;

    @Column(name = "created_at")
    public LocalDateTime createdAt;

    @Column(name = "updated_at")
    public LocalDateTime updatedAt;

    @Column(name = "disabled_at")
    public LocalDateTime disabledAt;

    @Column(name = "created_by", length = 100)
    public String createdBy;

    // ===== LIFECYCLE =====
    @PrePersist
    public void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

    // ===== QUERIES =====
    public static List<Ticker> findActive() {
        return find("isActive = true ORDER BY priority DESC")
                .page(0, 10)
                .list();
    }

    public static List<Ticker> findAll_Admin() {
        return find("ORDER BY createdAt DESC").list();
    }
}