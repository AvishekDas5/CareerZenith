import os
print("✅ Imports loaded")

os.environ["GOOGLE_APPLICATION_CREDENTIALS"] = r"D:\LPU\SEM 8\Capstone\employment-platform\backend\job_recommendation\service-account-file.json"
print("✅ Google credentials set")

from google.cloud import firestore
db = firestore.Client()
print("✅ Firestore initialized")

from transformers import AutoTokenizer, AutoModelForTokenClassification, pipeline
model_name = "dslim/bert-base-NER"
print("✅ Hugging Face modules imported")

tokenizer = AutoTokenizer.from_pretrained(model_name)
print("✅ Tokenizer loaded")

model = AutoModelForTokenClassification.from_pretrained(model_name)
print("✅ Model loaded")

ner_pipeline = pipeline("ner", model=model, tokenizer=tokenizer)
print("✅ Pipeline ready")

from flask import Flask, request, jsonify
app = Flask(__name__)
print("✅ Flask app initialized")
