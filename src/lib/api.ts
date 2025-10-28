const API_URLS = {
  auth: 'https://functions.poehali.dev/41b0c85d-74fa-427a-ad52-e01e838a9463',
  artworks: 'https://functions.poehali.dev/70783a48-1bf7-4a48-bbf1-98d9f4be24fb',
  interactions: 'https://functions.poehali.dev/ba2f2ec8-722b-4520-b873-edef2e0c10fe',
  forum: 'https://functions.poehali.dev/3c1c267d-54d6-49e2-a3ff-6d708a52637a',
};

export interface User {
  id: number;
  email: string;
  username: string;
  avatar_url?: string;
  bio?: string;
  role: string;
  created_at: string;
}

export interface Artwork {
  id: number;
  user_id: number;
  title: string;
  description?: string;
  image_url: string;
  tags: string[];
  views: number;
  likes: number;
  comments: number;
  username: string;
  artist_avatar?: string;
  created_at: string;
}

export interface ForumThread {
  id: number;
  user_id: number;
  title: string;
  content: string;
  thread_type: string;
  tags: string[];
  is_active: boolean;
  views: number;
  replies: number;
  votes: number;
  username: string;
  avatar_url?: string;
  created_at: string;
}

export const authAPI = {
  register: async (email: string, password: string, username: string) => {
    const res = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'register', email, password, username }),
    });
    return res.json();
  },

  login: async (email: string, password: string) => {
    const res = await fetch(API_URLS.auth, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'login', email, password }),
    });
    return res.json();
  },

  getUser: async (userId: number) => {
    const res = await fetch(`${API_URLS.auth}?userId=${userId}`);
    return res.json();
  },
};

export const artworksAPI = {
  getAll: async (): Promise<Artwork[]> => {
    const res = await fetch(API_URLS.artworks);
    return res.json();
  },

  getById: async (id: number): Promise<Artwork> => {
    const res = await fetch(`${API_URLS.artworks}?id=${id}`);
    return res.json();
  },

  getByUser: async (userId: number): Promise<Artwork[]> => {
    const res = await fetch(`${API_URLS.artworks}?userId=${userId}`);
    return res.json();
  },

  create: async (data: {
    userId: number;
    title: string;
    description: string;
    imageUrl: string;
    tags: string[];
  }) => {
    const res = await fetch(API_URLS.artworks, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },
};

export const interactionsAPI = {
  like: async (artworkId: number, userId: number) => {
    const res = await fetch(API_URLS.interactions, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'like', artworkId, userId }),
    });
    return res.json();
  },

  comment: async (artworkId: number, userId: number, commentText: string) => {
    const res = await fetch(API_URLS.interactions, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'comment', artworkId, userId, commentText }),
    });
    return res.json();
  },

  getComments: async (artworkId: number) => {
    const res = await fetch(API_URLS.interactions, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'get_comments', artworkId }),
    });
    return res.json();
  },

  follow: async (followerId: number, followingId: number) => {
    const res = await fetch(API_URLS.interactions, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'follow', followerId, followingId }),
    });
    return res.json();
  },
};

export const forumAPI = {
  getThreads: async (): Promise<ForumThread[]> => {
    const res = await fetch(API_URLS.forum);
    return res.json();
  },

  getThread: async (id: number): Promise<ForumThread> => {
    const res = await fetch(`${API_URLS.forum}?id=${id}`);
    return res.json();
  },

  createThread: async (data: {
    userId: number;
    title: string;
    content: string;
    threadType: string;
    tags: string[];
  }) => {
    const res = await fetch(API_URLS.forum, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'create_thread', ...data }),
    });
    return res.json();
  },

  addComment: async (threadId: number, userId: number, commentText: string) => {
    const res = await fetch(API_URLS.forum, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'add_comment', threadId, userId, commentText }),
    });
    return res.json();
  },

  vote: async (threadId: number, userId: number, voteValue: number) => {
    const res = await fetch(API_URLS.forum, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'vote', threadId, userId, voteValue }),
    });
    return res.json();
  },
};
