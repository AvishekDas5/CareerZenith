import firebase_admin
from firebase_admin import credentials, firestore

cred = credentials.Certificate("./firebase_config.json")  # Ensure correct path
firebase_admin.initialize_app(cred)
db = firestore.client()
