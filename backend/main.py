from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from werkzeug.security import generate_password_hash, check_password_hash
from flask_cors import CORS

import uuid
import json

from flask import Flask, Blueprint, request, jsonify
from secrets import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

app = Flask(__name__)
CORS(app)
engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}')

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

    user = connection.execute(text("SELECT * FROM users WHERE username = :username"), username=username).fetchone()
    if user is None:
        connection.close()
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if not check_password_hash(user['password'], password):
        connection.close()
        return jsonify({'error': 'Invalid username or password'}), 401
    
    if user['token'] is None:
        token = str(uuid.uuid4())
        connection.execute(text("UPDATE users SET token = :token WHERE username = :username"), token=token, username=username)
        connection.commit()
        connection.close()
        return jsonify({'token': token}), 200
    else:
        token = user['token']
        connection.close()
        return jsonify({'token': token}), 200
    
    
    
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


