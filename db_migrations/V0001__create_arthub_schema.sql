-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create artworks table
CREATE TABLE IF NOT EXISTS artworks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    image_url TEXT NOT NULL,
    tags TEXT[],
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create artwork_likes table
CREATE TABLE IF NOT EXISTS artwork_likes (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER REFERENCES artworks(id),
    user_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(artwork_id, user_id)
);

-- Create artwork_comments table
CREATE TABLE IF NOT EXISTS artwork_comments (
    id SERIAL PRIMARY KEY,
    artwork_id INTEGER REFERENCES artworks(id),
    user_id INTEGER REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create forum_threads table
CREATE TABLE IF NOT EXISTS forum_threads (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    thread_type VARCHAR(50) DEFAULT 'discussion',
    tags TEXT[],
    is_active BOOLEAN DEFAULT true,
    views INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create thread_comments table
CREATE TABLE IF NOT EXISTS thread_comments (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id),
    user_id INTEGER REFERENCES users(id),
    comment_text TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create thread_votes table
CREATE TABLE IF NOT EXISTS thread_votes (
    id SERIAL PRIMARY KEY,
    thread_id INTEGER REFERENCES forum_threads(id),
    user_id INTEGER REFERENCES users(id),
    vote_value INTEGER CHECK (vote_value IN (-1, 1)),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(thread_id, user_id)
);

-- Create user_follows table
CREATE TABLE IF NOT EXISTS user_follows (
    id SERIAL PRIMARY KEY,
    follower_id INTEGER REFERENCES users(id),
    following_id INTEGER REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(follower_id, following_id)
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    from_user_id INTEGER REFERENCES users(id),
    notification_type VARCHAR(50) NOT NULL,
    related_id INTEGER,
    message TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_artworks_user_id ON artworks(user_id);
CREATE INDEX IF NOT EXISTS idx_artworks_created_at ON artworks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_artwork_likes_artwork_id ON artwork_likes(artwork_id);
CREATE INDEX IF NOT EXISTS idx_artwork_comments_artwork_id ON artwork_comments(artwork_id);
CREATE INDEX IF NOT EXISTS idx_forum_threads_user_id ON forum_threads(user_id);
CREATE INDEX IF NOT EXISTS idx_thread_comments_thread_id ON thread_comments(thread_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(user_id, is_read);