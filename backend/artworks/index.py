'''
Business: Artwork management - create, read, update artworks
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with artwork data
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
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
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
            artwork_id = params.get('id')
            user_id = params.get('userId')
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if artwork_id:
                    cur.execute("""
                        SELECT a.*, u.username, u.avatar_url as artist_avatar,
                               (SELECT COUNT(*) FROM artwork_likes WHERE artwork_id = a.id) as likes,
                               (SELECT COUNT(*) FROM artwork_comments WHERE artwork_id = a.id) as comments
                        FROM artworks a
                        JOIN users u ON a.user_id = u.id
                        WHERE a.id = %s
                    """, (artwork_id,))
                    artwork = cur.fetchone()
                    
                    if not artwork:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'Artwork not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(dict(artwork), default=str)
                    }
                
                elif user_id:
                    cur.execute("""
                        SELECT a.*, u.username, u.avatar_url as artist_avatar,
                               (SELECT COUNT(*) FROM artwork_likes WHERE artwork_id = a.id) as likes,
                               (SELECT COUNT(*) FROM artwork_comments WHERE artwork_id = a.id) as comments
                        FROM artworks a
                        JOIN users u ON a.user_id = u.id
                        WHERE a.user_id = %s
                        ORDER BY a.created_at DESC
                    """, (user_id,))
                else:
                    cur.execute("""
                        SELECT a.*, u.username, u.avatar_url as artist_avatar,
                               (SELECT COUNT(*) FROM artwork_likes WHERE artwork_id = a.id) as likes,
                               (SELECT COUNT(*) FROM artwork_comments WHERE artwork_id = a.id) as comments
                        FROM artworks a
                        JOIN users u ON a.user_id = u.id
                        ORDER BY a.created_at DESC
                        LIMIT 50
                    """)
                
                artworks = [dict(row) for row in cur.fetchall()]
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps(artworks, default=str)
                }
        
        elif method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            user_id = body_data.get('userId')
            title = body_data.get('title')
            description = body_data.get('description', '')
            image_url = body_data.get('imageUrl')
            tags = body_data.get('tags', [])
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute("""
                    INSERT INTO artworks (user_id, title, description, image_url, tags)
                    VALUES (%s, %s, %s, %s, %s)
                    RETURNING id, user_id, title, description, image_url, tags, created_at
                """, (user_id, title, description, image_url, tags))
                
                artwork = dict(cur.fetchone())
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(artwork, default=str)
            }
        
        return {
            'statusCode': 405,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({'error': 'Method not allowed'})
        }
    
    finally:
        conn.close()
