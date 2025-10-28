'''
Business: Handle likes, comments, and follows
Args: event with httpMethod, body; context with request_id
Returns: HTTP response with interaction data
'''

import json
import os
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'POST')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, DELETE, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        body_data = json.loads(event.get('body', '{}'))
        action = body_data.get('action')
        
        if action == 'like':
            artwork_id = body_data.get('artworkId')
            user_id = body_data.get('userId')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO artwork_likes (artwork_id, user_id)
                    VALUES (%s, %s)
                    ON CONFLICT (artwork_id, user_id) DO NOTHING
                    RETURNING id
                """, (artwork_id, user_id))
                
                result = cur.fetchone()
                conn.commit()
                
                cur.execute("""
                    SELECT COUNT(*) as count FROM artwork_likes WHERE artwork_id = %s
                """, (artwork_id,))
                
                likes = cur.fetchone()['count']
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'likes': likes, 'liked': result is not None})
            }
        
        elif action == 'comment':
            artwork_id = body_data.get('artworkId')
            user_id = body_data.get('userId')
            comment_text = body_data.get('commentText')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO artwork_comments (artwork_id, user_id, comment_text)
                    VALUES (%s, %s, %s)
                    RETURNING id, artwork_id, user_id, comment_text, created_at
                """, (artwork_id, user_id, comment_text))
                
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
        
        elif action == 'get_comments':
            artwork_id = body_data.get('artworkId')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    SELECT c.*, u.username, u.avatar_url
                    FROM artwork_comments c
                    JOIN users u ON c.user_id = u.id
                    WHERE c.artwork_id = %s
                    ORDER BY c.created_at DESC
                """, (artwork_id,))
                
                comments = [dict(row) for row in cur.fetchall()]
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(comments, default=str)
            }
        
        elif action == 'follow':
            follower_id = body_data.get('followerId')
            following_id = body_data.get('followingId')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO user_follows (follower_id, following_id)
                    VALUES (%s, %s)
                    ON CONFLICT (follower_id, following_id) DO NOTHING
                    RETURNING id
                """, (follower_id, following_id))
                
                result = cur.fetchone()
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'followed': result is not None})
            }
        
        return {
            'statusCode': 400,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Invalid action'})
        }
    
    finally:
        conn.close()
