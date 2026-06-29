package com.spear.spear_backend.dto;

import java.util.List;

public class CreatePoemRequest {
    private String title;
    private String content;
    private String authorId;
    private List<String> tags;
    private String language; // Optional: Include the language field

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public List<String> getTags() { return tags; }
    public void setTags(List<String> tags) { this.tags = tags; }

    public String getLanguage() { return language; }
    public void setLanguage(String language) { this.language = language; }
}
