package com.spear.spear_backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "Poems")
public class Poem {

    @Id
    private String id;
    private String title;
    private String content;

    private String authorId;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean isDeleted;

    private List<String> tags;
    private int likes;
    private int shares;
    private int views;
    private int commentsCount;
    private String language;

    private List<String> relatedPoemIds;


    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public boolean isDeleted() { return isDeleted; }
    public void setDeleted(boolean deleted) { isDeleted = deleted; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public int getLikes() { return likes; }
    public void setLikes(int likes) { this.likes = likes; }

    public int getShares() { return shares; }
    public void setShares(int shares) { this.shares = shares; }

    public int getViews() { return views; }
    public void setViews(int views) { this.views = views; }

    public int getCommentsCount() { return commentsCount; }
    public void setCommentsCount(int commentsCount) { this.commentsCount = commentsCount; }

    public List<String> getRelatedPoemIds() { return relatedPoemIds; }
    public void setRelatedPoemIds(List<String> relatedPoemIds) { this.relatedPoemIds = relatedPoemIds; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }


}


