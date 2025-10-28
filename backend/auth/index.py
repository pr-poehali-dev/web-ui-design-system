'''
Business: Authentication and user management
Args: event with httpMethod, body, queryStringParameters; context with request_id
Returns: HTTP response with user data or auth tokens
'''

import json
import os
import hashlib
import secrets
from typing import Dict, Any
import psycopg2
from psycopg2.extras import RealDictCursor

def hash_password(password: str) -> str:
    return hashlib.sha256(password.encode()).hexdigest()

def generate_token() -> str:
    return secrets.token_urlsafe(32)

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, X-User-Id, X-Auth-Token',
                'Access-Control-Max-Age': '86400'
            },
            'body': ''
        }
    
    dsn = os.environ.get('DATABASE_URL')
    conn = psycopg2.connect(dsn)
    
    try:
        if method == 'POST':
            body_data = json.loads(event.get('body', '{}'))
            action = body_data.get('action')
            
            if action == 'register':
                email = body_data.get('email')
                password = body_data.get('password')
                username = body_data.get('username')
                
                password_hash = hash_password(password)
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "INSERT INTO users (email, password_hash, username) VALUES (%s, %s, %s) RETURNING id, email, username, created_at",
                        (email, password_hash, username)
                    )
                    user = dict(cur.fetchone())
                    conn.commit()
                
                token = generate_token()
                
                return {
                    'statusCode': 201,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'user': user,
                        'token': token
                    }, default=str)
                }
            
            elif action == 'login':
                email = body_data.get('email')
                password = body_data.get('password')
                
                password_hash = hash_password(password)
                
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "SELECT id, email, username, avatar_url, bio, role, created_at FROM users WHERE email = %s AND password_hash = %s",
                        (email, password_hash)
                    )
                    user = cur.fetchone()
                    
                    if not user:
                        return {
                            'statusCode': 401,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'Invalid credentials'})
                        }
                    
                    user = dict(user)
                
                token = generate_token()
                
                return {
                    'statusCode': 200,
                    'headers': {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*'
                    },
                    'body': json.dumps({
                        'user': user,
                        'token': token
                    }, default=str)
                }
        
        elif method == 'GET':
            user_id = event.get('queryStringParameters', {}).get('userId')
            
            if user_id:
                with conn.cursor(cursor_factory=RealDictCursor) as cur:
                    cur.execute(
                        "SELECT id, email, username, avatar_url, bio, role, created_at FROM users WHERE id = %s",
                        (user_id,)
                    )
                    user = cur.fetchone()
                    
                    if not user:
                        return {
                            'statusCode': 404,
                            'headers': {
                                'Content-Type': 'application/json',
                                'Access-Control-Allow-Origin': '*'
                            },
                            'body': json.dumps({'error': 'User not found'})
                        }
                    
                    return {
                        'statusCode': 200,
                        'headers': {
                            'Content-Type': 'application/json',
                            'Access-Control-Allow-Origin': '*'
                        },
                        'body': json.dumps(dict(user), default=str)
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
