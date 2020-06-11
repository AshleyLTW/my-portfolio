package com.google.sps.data;

/** A comment */
public final class Comment {

    private final String text;
    private final String username;
    private final long timestamp;

    public Comment(String text, String username, long timestamp) {
        this.text = text;
        this.username = username;
        this.timestamp = timestamp;
    }
}
