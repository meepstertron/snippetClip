from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS
import logging
from dotenv import load_dotenv
import os

load_dotenv()

logging.basicConfig(level=logging.DEBUG)

import uuid
import json

from flask import Flask, Blueprint, request, jsonify

app = Flask(__name__)
CORS(app)
engine = create_engine(
    f'mysql+pymysql://{os.getenv("DB_USER")}:{os.getenv("DB_PASSWORD")}@{os.getenv("DB_HOST")}/{os.getenv("DB_NAME")}'
)

main_blueprint = Blueprint('main', __name__)

def get_db_connection():
    try:
        connection = engine.connect()
        return connection
    except OperationalError as err:
        print(f"OperationalError: {err}")
        return None


@app.route('/auth', methods=['POST'])
def auth():
    request_data = request.get_json()
    username = request_data['username']
    password = request_data['password']
    
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500

    user = connection.execute(text("SELECT * FROM users WHERE email = :username"), {'username': username}).fetchone()
    user_id = user[0]
    if user is None:
        connection.close()
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if not check_password_hash(user[3], password):
        connection.close()
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if user[4] is None or len(user[4]) < 36 :
        token = str(uuid.uuid4())
        connection.execute(text("UPDATE users SET token = :token WHERE email = :username"), {'token': token, 'username': username})
        connection.commit()
        connection.close()
        return jsonify({'token': token}), 200
    else:
        token = user[4]
        connection.close()
        return jsonify({'token': token, 'id': user_id}), 200
    
@app.route('/register', methods=['POST'])
def register():
    request_data = request.get_json()
    email = request_data['email']
    username = request_data['username']
    password = request_data['password']
    
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    user = connection.execute(text("SELECT * FROM users WHERE email = :email"), {'email': email}).fetchone()
    if user is not None:
        connection.close()
        return jsonify({'error': 'User already exists'}), 400
    
    hashed_password = generate_password_hash(password)
    connection.execute(text("INSERT INTO users (email, username, password) VALUES (:email, :username, :password)"), {'email': email, 'username': username, 'password': hashed_password})
    connection.commit()
    connection.close()
    return jsonify({'message': 'User created successfully'}), 201


@app.route('/api/post/<action>', methods=['POST'])
def action(action):
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    request_data = request.get_json()
    post_id = request_data['id']
    if action == "upvote":
        token = request.headers.get('Authorization')
        token = token[1:] if token.startswith('"') else token
        token = token[:-1] if token.endswith('"') else token
        
        user = connection.execute(text("SELECT * FROM users WHERE token = :token"), {'token': token}).fetchone()
        if user is None:
            connection.close()
            return jsonify({'error': 'Invalid token'}), 401
        
        post = connection.execute(text("SELECT * FROM snippets WHERE id = :id"), {'id': post_id}).fetchone()
        if post is None:
            connection.close()
            return jsonify({'error': 'Invalid post id'}), 404
        
        upvotes = post[6]
        upvote_ids = json.loads(post[8])
        
        if user[0] in upvote_ids:
            connection.close()
            return jsonify({'error': 'User already upvoted this post'}), 400
        
        upvotes += 1
        upvote_ids.append(user[0])
        connection.execute(text("UPDATE snippets SET upvotes = :upvotes, upvote_ids = :upvote_ids WHERE id = :id"), {'upvotes': upvotes, 'upvote_ids': json.dumps(upvote_ids), 'id': post_id})
        connection.commit()
        connection.close()
        return jsonify({'message': 'Post upvoted successfully'}), 200
    
    elif action == "copy":
        post = connection.execute(text("SELECT * FROM snippets WHERE id = :id"), {'id': post_id}).fetchone()
        if post is None:
            connection.close()
            return jsonify({'error': 'Invalid post id'}), 404
        
        copies = int(post[7]) if post[7] else 0  # Convert to int and handle None case
        copies += 1
        connection.execute(text("UPDATE snippets SET copies = :copies WHERE id = :id"), {'copies': copies, 'id': post_id})
        connection.commit()
        connection.close()
        return jsonify({'message': 'Post copied successfully'}), 200


@app.route('/api/posts/<sort>')
def posts(sort):
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    if sort == 'new':
        posts = connection.execute(text("SELECT * FROM snippets ORDER BY created DESC LIMIT 20")).fetchall()
        posts = list(reversed(posts))
    elif sort == 'top':
        posts = connection.execute(text("SELECT * FROM snippets ORDER BY upvotes DESC LIMIT 20")).fetchall()
    elif sort == 'random':
        posts = connection.execute(text("SELECT * FROM snippets ORDER BY RAND() LIMIT 20")).fetchall()
    elif sort == 'featured':
        posts = connection.execute(text("SELECT * FROM snippets WHERE featured = 1 ORDER BY created DESC LIMIT 20")).fetchall()
    else:
        return jsonify({'error': 'Invalid sort parameter'}), 400
    
    posts_list = []
    for post in posts:
        post_dict = dict(post._mapping)
        post_dict['tags'] = json.loads(post_dict['tags'])
        post_dict['upvote_ids'] = json.loads(post_dict['upvote_ids'])
        post_dict['code'] = post_dict['code'].encode().decode('unicode_escape')
        author = connection.execute(text("SELECT * FROM users WHERE id = :author_id"), {'author_id': post_dict['authorid']}).fetchone()
        if author:
            author_dict = dict(author._mapping)
            
            author_dict.pop('password', None)
            author_dict.pop('token', None)
            post_dict['author'] = author_dict["username"]
        else:
            post_dict['author'] = None
        posts_list.append(post_dict)
    
    connection.close()
    return jsonify(posts_list), 200

@app.route('/api/search', methods=['GET'])
def search():
    query = request.args.get('query')
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    posts = connection.execute(text("SELECT * FROM snippets WHERE title LIKE :query OR code LIKE :query ORDER BY upvotes DESC"), {'query': f'%{query}%'}).fetchall()
    
    posts_list = []
    for post in posts:
        post_dict = dict(post._mapping)
        post_dict['tags'] = json.loads(post_dict['tags'])
        post_dict['upvote_ids'] = json.loads(post_dict['upvote_ids'])
        post_dict['code'] = post_dict['code'].encode().decode('unicode_escape')
        post_dict['author'] = connection.execute(text("SELECT * FROM users WHERE id = :author_id"), {'author_id': post_dict['authorid']}).fetchone()[1]
        posts_list.append(post_dict)
    
    connection.close()
    return jsonify(posts_list), 200

@app.route('/api/userinfo', methods=['GET'])
def userinfo():
    token = request.headers.get('Authorization')
    token = token[1:] if token.startswith('"') else token
    token = token[:-1] if token.endswith('"') else token
    logging.debug(f'Token received: {token}')
    
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    user = connection.execute(text("SELECT * FROM users WHERE token = :token"), {'token': token}).fetchone()
    if user is None:
        connection.close()
        return jsonify({'error': 'Invalid token'}), 401
    
    user_dict = dict(user._mapping)
    user_dict.pop('password')
    user_dict.pop('token')
    connection.close()
    return jsonify(user_dict), 200

@app.route('/api/post', methods=['POST'])
def post():
    request_data = request.get_json()
    title = request_data['title']
    code = request_data['code']
    tags = request_data['tags']
    language = request_data['language']
    token = request.headers.get('Authorization')
    token = token[1:] if token.startswith('"') else token
    token = token[:-1] if token.endswith('"') else token  # Fixed endswith syntax
    
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    user = connection.execute(text("SELECT * FROM users WHERE token = :token"), {'token': token}).fetchone()
    if user is None:
        connection.close()
        return jsonify({'error': 'Invalid token'}), 401
    
    tags = json.dumps(tags)
    empty_upvotes = json.dumps([])
    connection.execute(
        text("INSERT INTO snippets (title, code, tags, authorid, language, upvotes, upvote_ids, copies) VALUES (:title, :code, :tags, :authorid, :language, 0, :upvote_ids, 0)"),
        {'title': title, 'code': code, 'tags': tags, 'authorid': user[0], 'language': language, 'upvote_ids': empty_upvotes}
    )
    connection.commit()
    connection.close()
    return jsonify({'message': 'Post created successfully'}), 201


@app.route('/api/user', methods=['GET'])
def getuser():
    name = request.args.get('username')
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    user = connection.execute(text("SELECT * FROM users WHERE username = :name"), {'name': name}).fetchone()
    if user is None:
        connection.close()
        return jsonify({'error': 'Invalid username'}), 404
    
    posts = connection.execute(text("SELECT * FROM snippets WHERE authorid = :user_id"), {'user_id': user[0]}).fetchall()
    
    user_dict = dict(user._mapping)
    user_dict.pop('password')
    user_dict.pop('token')
    
    posts_list = []
    for post in posts:
        post_dict = dict(post._mapping)
        post_dict['tags'] = json.loads(post_dict['tags'])
        post_dict['upvote_ids'] = json.loads(post_dict['upvote_ids'])
        post_dict['code'] = post_dict['code'].encode().decode('unicode_escape')
        posts_list.append(post_dict)
        
    
    
    connection.close()
    return jsonify({'user': user_dict, 'posts': posts_list}), 200


@app.route('/api/tag/<tag>', methods=['GET'])
def tag(tag):
    
    connection = get_db_connection()
    if connection is None:
        return jsonify({'error': 'Internal server error'}), 500
    
    if not tag:
        return jsonify({'error': 'Tag cannot be null'}), 400
    
    tag_record = connection.execute(text("SELECT * FROM tags WHERE name = :tag"), {'tag': tag}).fetchone()
    if tag_record is None:
        connection.execute(text("INSERT INTO tags (name) VALUES (:tag)"), {'tag': tag})
        connection.commit()
    
    tag_record = connection.execute(text("SELECT * FROM tags WHERE name = :tag"), {'tag': tag}).fetchone()
    
    posts = connection.execute(text("""
        SELECT snippets.* FROM snippets
        WHERE JSON_CONTAINS(tags, :tag, '$')
    """), {'tag': f'"{tag}"'}).fetchall()
    
    posts_list = []
    for post in posts:
        post_dict = dict(post._mapping)
        post_dict['tags'] = json.loads(post_dict['tags'])
        post_dict['upvote_ids'] = json.loads(post_dict['upvote_ids'])
        post_dict['code'] = post_dict['code'].encode().decode('unicode_escape')
        posts_list.append(post_dict)
    
    return jsonify({'tag': dict(tag_record._mapping), 'posts': posts_list}), 200


