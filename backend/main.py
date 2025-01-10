from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError

from flask import Flask, Blueprint, request, jsonify
from secrets import DB_HOST, DB_USER, DB_PASSWORD, DB_NAME

app = Flask(__name__)
engine = create_engine(f'mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}/{DB_NAME}')