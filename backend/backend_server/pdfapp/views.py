from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import fitz  # PyMuPDF
import requests
import os
import json
import base64
import logging
import re
import tempfile
import asyncio  # Import asyncio
import httpx  # Async HTTP client for Mathpix
from openai import AzureOpenAI
from imgurpython import ImgurClient
import pymongo
from bson import json_util
from django.http import HttpResponse
from pymongo import MongoClient

import pandas as pd
from sklearn.decomposition import PCA
from sklearn.preprocessing import StandardScaler
import numpy as np
# Import DBSCAN from sklearn.cluster instead of dbscan
from sklearn.cluster import DBSCAN 
from django.conf import settings


import cloudinary.uploader
import cloudinary.api

# Connect to MongoDB
client = MongoClient(settings.MONGO_CLIENT)  # Replace with your MongoDB connection string
db = client['bicStatement']  # Replace with your database name
collection = db['bicData']   # Replace with your collection name 

cloudinary.config(
  cloud_name = 'dov26aghv',  # Replace with your Cloudinary credentials
  api_key = '863114567915198',
  api_secret = 'WRmzVh-fRF_5kbxWq619rxsRi8M'
)


def upload_image_to_cloudinary(image_path):
    try:
        response = cloudinary.uploader.upload(image_path)
        image_url = response['url']  # Get the public URL
        return image_url
    except Exception as e:
        logging.error(f"Error uploading image to Cloudinary: {e}")
        return None



# Azure OpenAI setup
MODEL_MINI = 'gpt4omini'
client_mini = AzureOpenAI(
    api_key=settings.API_KEY,
    api_version=settings.API_VERSION,
    azure_endpoint = settings.AZURE_ENDPOINT
    )

prompt_latex_text = """
You are tasked with extracting specific information from LaTeX-formatted text. Each text contains bank transaction details, and the goal is to extract relevant information accurately. Follow the steps below:

1. Identify and extract the following fields:
    - Client Name: The name of the person or entity associated with the account.(if not available, return "null")
    - Bank Name: The name of the bank conducting the transaction. (if not available, return "null")
    - Account Number: The full account number associated with the client. (if not available, return "null")
    - Transaction Date: The date when the transaction occurred in the format (mm/dd/yyyy). (if not available, return "null")
    - Credit/Debit: Indicate whether the transaction is a credit or debit. Use "Credit" for incoming transactions and "Debit" for outgoing ones. (if not available, return "null")
    - Description: A brief description of the transaction. (if not available, return "null")
    - Amount: The transaction amount in the appropriate currency format. (if not available, return "null")
    - Balance: The account balance after the transaction, if available. (if not available, return "null")

2. Ensure that the output is structured in a strict JSON format with the following keys and corresponding values extracted from the image with no extra text.

Example JSON Output Format:


"{
    "client_name": "John Doe",
    "bank_name": "B1 Bank",
    "account_number": "1261234567",
    "transactions": [
        {
            "transaction_date": "08/19/2020",
            "credit/debit": "Credit",
            "description": "Correction: Cash Withdrawal GCC",
            "amount": "100.00",
            "balance": "132.27"
        },
        // Add more transactions as extracted from the statement
    ]
}"

Proceed with the task and ensure the output is correct and consistent.
"""

# Regex to extract JSON from OpenAI response
def extract_json_from_response(response):
    pattern = r'(\{.*\})'
    match = re.search(pattern, response, re.DOTALL)
    if match:
        json_part = match.group(1)
        return json_part
    return None

# Function to convert image to base64
def convert_image_to_base64(image_path):
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

# Async Mathpix OCR function
async def extract_text_from_image_async(image_base64):
    api_url = "https://api.mathpix.com/v3/text"
    payload = json.dumps({
        "src": f"data:image/png;base64,{image_base64}",
        "formats": ["text"],
        "include_smiles": True,
    })
    headers = {
        'app_id': settings.APP_ID,
        'app_key': settings.APP_KEY,
        'Content-Type': 'application/json'
    }

    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(api_url, headers=headers, data=payload, timeout=10)
            if response.status_code == 200:
                response_data = response.json()
                return response_data.get('text', '')
            logging.error(f"Mathpix request failed with status code {response.status_code}")
            return None
    except Exception as e:
        logging.error(f"Mathpix Error: {e}")
        return None

def extract_text_from_image(url):
    api_url = "https://api.mathpix.com/v3/text"
    payload = json.dumps({
        "src": url,
        "formats": ["text"],
        "include_smiles": True,
    })
    headers = {
        'app_id': settings.APP_ID,
        'app_key': settings.APP_KEY,
        'Content-Type': 'application/json'
    }

    try:
        # Use requests.post instead of async client
        response = requests.post(api_url, headers=headers, data=payload, timeout=25)

        # Check if the request was successful (HTTP status code 200)
        if response.status_code == 200:
            # Parse the JSON response and extract the text
            response_data = response.json()
            if 'error' in response_data and response_data["error"]:
                print(f'Got exception from Mathpix: {response_data["error"]} => for the image_url:{url}')

            extracted_text = response_data.get('text', '')
            if not extracted_text:
                print(f'No text extracted from Mathpix => for the image_url:{url}')
            return extracted_text
        else:
            return f"Request failed with status code {response.status_code}"
    except requests.Timeout as e:
        print(f"Got Timeout Exception from Mathpix: {e}")

    except Exception as e:
        # Handle any other exceptions
        print(f"Got Exception from Mathpix: {e} => for the image_url:{url}")

# Convert PDF pages to images
def pdf_to_images(pdf_path, output_dir, zoom=2):
    saved_path = []
    try:
        doc = fitz.open(pdf_path)
        
        # Ensure the output directory exists
        if not os.path.exists(output_dir):
            os.makedirs(output_dir)

        for page_num in range(doc.page_count):
            page = doc[page_num]
            matrix = fitz.Matrix(zoom, zoom)  # Set the matrix for higher resolution
            pix = page.get_pixmap(matrix=matrix)
            output_filename = os.path.join(output_dir, f"page_{page_num + 1}.png")
            saved_path.append(output_filename)
            pix.save(output_filename)
        
        return saved_path
    except Exception as e:
        logging.error(f"Error converting PDF to images: {e}")
        return []
    



# Function to upload image to Imgur
# def upload_image_to_imgur(image_path):
#     try:
#         response = client.upload_from_path(image_path, anon=True)  # Upload as anonymous
#         image_url = response['link']  # Get the public URL
#         return image_url
#     except Exception as e:
#         logging.error(f"Error uploading image to Imgur: {e}")
#         return None

# def upload_image_to_imgur(image_path):
#     try:
#         response = client.upload_from_path(image_path, anon=True)  # Upload as anonymous
#         image_url = response['link']  # Get the public URL
#         return image_url
#     except Exception as e:
#         logging.error(f"Error uploading image to Imgur: {e}")
#         return None






# Main function to convert PDF to images and upload them to Imgur
# def upload_pdf_images_to_imgur(pdf_path, output_dir, zoom=2):
#     # Convert PDF to images
#     image_paths = pdf_to_images(pdf_path, output_dir, zoom)
    
#     # Check if any images were generated
#     if not image_paths:
#         print("No images were generated from the PDF.")
#         return []

#     # Upload each image to Imgur and collect URLs
#     imgur_urls = []
#     for image_path in image_paths:
#         image_url = upload_image_to_imgur(image_path)
#         if image_url:
#             imgur_urls.append(image_url)
#             print(f"Uploaded {image_path} to Imgur: {image_url}")
#         else:
#             print(f"Failed to upload {image_path} to Imgur.")
    
#     return imgur_urls


def json_to_transaction(bank_statement_json):
  '''
  converting json file to the given format dataframe

  Args
  json_data: json file object
  Returns
  dataframe: pandas dataframe
  '''

  # Convert transactions to a pandas DataFrame
  transactions = pd.json_normalize(bank_statement_json['transactions'])

  # Data preprocessing
  # Replace 'null' with NaN before converting to float
  transactions['amount'] = transactions['amount'].str.replace(',', '').replace('null', None).astype(float)  
  transactions['balance'] = transactions['balance'].str.replace(',', '').replace('null', None).astype(float) 

  # Feature engineering: derive useful features
  transactions['transaction_type'] = transactions['credit/debit'].apply(lambda x: 1 if x == 'Credit' else 0)
  transactions['previous_balance'] = transactions['balance'].shift(1)

  #handling null values
  transactions['amount_change'] = transactions['amount'].diff().fillna(0)
  transactions['amount'] = transactions['amount'].fillna(0)
  transactions['balance'] = transactions['balance'].diff().fillna(0)


  # Drop unnecessary columns
  transactions = transactions.drop(['credit/debit', 'description'], axis=1)

  return transactions

def fraud_detection(json_file_path):
  
  transactions = json_to_transaction(json_file_path)
  scaler = StandardScaler()
  scaled_transactions = scaler.fit_transform(transactions[['amount', 'balance', 'amount_change']])

  # DBSCAN for outlier detection
  dbscan = DBSCAN(eps=0.5, min_samples=2)  # Initialize DBSCAN correctly
  dbscan.fit(scaled_transactions)  # Fit DBSCAN to the data
  transactions['anomaly_dbscan'] = dbscan.labels_

  # -1 indicates anomaly
  dbscan_anomalies = transactions[transactions['anomaly_dbscan'] == -1]
  # print(f"Anomalies detected by DBSCAN:\n{dbscan_anomalies}")

  return dbscan_anomalies.index




# Main function for uploading PDF and processing
@csrf_exempt
def upload_pdf(request):
    if request.method == 'POST':
        try:
            if 'file' not in request.FILES:
                return JsonResponse({"error": "No file uploaded"}, status=400)

            file = request.FILES['file']
            filename = file.name
            logging.info(f"Received file: {filename}")

            # Create temporary directories for saving PDF and images
            with tempfile.TemporaryDirectory() as temp_dir:
                pdf_path = os.path.join(temp_dir, filename)
                output_dir = os.path.join(temp_dir, 'images')

                # Save the uploaded PDF
                with open(pdf_path, 'wb+') as destination:
                    for chunk in file.chunks():
                        destination.write(chunk)
                logging.info("PDF saved successfully.")

                # Convert the PDF to high-quality images
                image_list = pdf_to_images(pdf_path, output_dir, zoom=4)
                if not image_list:
                    return JsonResponse({"error": "Failed to convert PDF to images"}, status=500)

                # Process the images asynchronously
                bank_statement_json = {}
                first_image = True

                # Create an event loop to handle async functions
                loop = asyncio.new_event_loop()
                asyncio.set_event_loop(loop)
                
                for image in image_list:
                    # Upload image to Imgur and get the URL
                    image_url = upload_image_to_cloudinary(image)
                    if not image_url:
                        return JsonResponse({"error": "Failed to upload image to Imgur"}, status=500)

                    image_base64 = convert_image_to_base64(image)  # Convert image to base64 for Mathpix OCR
                    # image_text = loop.run_until_complete(extract_text_from_image_async(image_base64)) # Extract text from image
                    image_text = extract_text_from_image(image_url) # Extract text from image
                    if not image_text:
                        return JsonResponse({"error": "Failed to extract text from image"}, status=500)

                    # Call OpenAI API to extract structured data (including image URL and extracted text)
                    try:
                        response = client_mini.chat.completions.create(
                            model=MODEL_MINI,
                            messages=[
                                {
                                    "role": "system", "content": prompt_latex_text
                                },
                                {
                                    "role": "user",
                                    "content": [
                                                {
                                                    "type": "text",
                                                    "text": "Latext query: " + image_text,
                                                },
                                                {
                                                "type": "image_url",
                                                "image_url": {
                                                    "url": image_url
                                                    },
                                                }
                                                ],
                                },
                            ],
                            temperature=0,
                        )

                        # Print the raw response to the console
                        # print("OpenAI raw response:", response)
                        # logging.info(f"OpenAI raw response: {response}")

                        output = extract_json_from_response(response.choices[0].message.content)

                        # Print the extracted JSON part from OpenAI response
                        # print("Extracted JSON from OpenAI response:", output)
                        # logging.info(f"Extracted JSON from OpenAI response: {output}")

                        if output is None:
                            logging.error("No JSON found in OpenAI response")
                            continue

                        output_data = json.loads(output)
                        if first_image:
                            bank_statement_json = output_data
                            first_image = False
                        else:
                            bank_statement_json['transactions'].extend(output_data['transactions'])

                    except Exception as e:
                        logging.error(f"OpenAI request failed: {e}")
                        continue

                # Now, detect fraud transactions
                anomaly_indices = fraud_detection(bank_statement_json)

                #Mongo connection
                # Save bank_statement_json in MongoDB
                try:
                    inserted_id = collection.insert_one(bank_statement_json).inserted_id
                    logging.info(f"Document inserted with ID: {inserted_id}")
                except Exception as e:
                    logging.error(f"Failed to insert into MongoDB: {e}")
                    return JsonResponse({"error": "Failed to save data to MongoDB"}, status=500)


                # Convert the bank statement JSON and ObjectId to strings using bson.json_util
                response_data = {
                    "data": bank_statement_json,
                    "anomalies": list(anomaly_indices),
                    "mongo_id": str(inserted_id)  # Convert ObjectId to string
                }

                # Serialize using bson.json_util to handle ObjectId and return an HttpResponse
                return HttpResponse(json_util.dumps(response_data), content_type="application/json")

        except Exception as e:
            logging.error(f"Error processing the request: {str(e)}")
            return JsonResponse({"error": "Internal Server Error"}, status=500)
    else:
        return JsonResponse({"error": "Invalid request method"}, status=400)
    