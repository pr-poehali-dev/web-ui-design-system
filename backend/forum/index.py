'''
Business: Forum threads and comments management
Args: event with httpMethod, body; context with request_id
Returns: HTTP response with forum data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters', {}) or {}
            thread_id = params.get('id')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if thread_id:
                    cur.execute("""
                        SELECT t.*, u.username, u.avatar_url,
                               (SELECT COUNT(*) FROM thread_comments WHERE thread_id = t.id) as replies,
                               (SELECT COALESCE(SUM(vote_value), 0) FROM thread_votes WHERE thread_id = t.id) as votes
                        FROM forum_threads t
                        JOIN users u ON t.user_id = u.id
                        WHERE t.id = %s
                    """, (thread_id,))
                    
                    thread = cur.fetchone()
                    if not thread:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'Thread not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(dict(thread), default=str)
                    }
                
                cur.execute("""
                    SELECT t.*, u.username, u.avatar_url,
                           (SELECT COUNT(*) FROM thread_comments WHERE thread_id = t.id) as replies,
                           (SELECT COALESCE(SUM(vote_value), 0) FROM thread_votes WHERE thread_id = t.id) as votes
                    FROM forum_threads t
                    JOIN users u ON t.user_id = u.id
                    ORDER BY t.created_at DESC
                    LIMIT 50
                """)
                
                threads = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(threads, default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'create_thread':
                user_id = body_data.get('userId')
                title = body_data.get('title')
                content = body_data.get('content')
                thread_type = body_data.get('threadType', 'discussion')
                tags = body_data.get('tags', [])
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        INSERT INTO forum_threads (user_id, title, content, thread_type, tags)
                        VALUES (%s, %s, %s, %s, %s)
                        RETURNING id, user_id, title, content, thread_type, tags, created_at
                    """, (user_id, title, content, thread_type, tags))
                    
                    thread = dict(cur.fetchone())
                    conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(thread, default=str)
                }
            
            elif action == 'add_comment':
                thread_id = body_data.get('threadId')
                user_id = body_data.get('userId')
                comment_text = body_data.get('commentText')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        INSERT INTO thread_comments (thread_id, user_id, comment_text)
                        VALUES (%s, %s, %s)
                        RETURNING id, thread_id, user_id, comment_text, created_at
                    """, (thread_id, user_id, comment_text))
                    
                    comment = dict(cur.fetchone())
                    conn.commit()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(comment, default=str)
                }
            
            elif action == 'vote':
                thread_id = body_data.get('threadId')
                user_id = body_data.get('userId')
                vote_value = body_data.get('voteValue')
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute("""
                        INSERT INTO thread_votes (thread_id, user_id, vote_value)
                        VALUES (%s, %s, %s)
                        ON CONFLICT (thread_id, user_id) 
                        DO UPDATE SET vote_value = EXCLUDED.vote_value
                        RETURNING id
                    """, (thread_id, user_id, vote_value))
                    
                    conn.commit()
                    
                    cur.execute("""
                        SELECT COALESCE(SUM(vote_value), 0) as total_votes
                        FROM thread_votes WHERE thread_id = %s
                    """, (thread_id,))
                    
                    result = cur.fetchone()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({'votes': result['total_votes']})
                }
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid request'})
        }
    
    finally:
        conn.close()
