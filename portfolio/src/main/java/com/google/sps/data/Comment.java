package com.google.sps.data;

public final class Comment {

    private final String text;
    private final String username;
    private final String mood;
    private final String imageURL;
    private final long timestamp;

    public Comment(String text, String username, String mood, String imageURL, long timestamp) {
        this.text = text;
        this.username = username;
        this.mood = mood;
        this.imageURL = imageURL;
        this.timestamp = timestamp;
    }
}
