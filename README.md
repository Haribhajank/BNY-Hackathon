# 🏦 Bank Statement Data Extraction & Fraud Detection System

This project, built for the **BNY Hackathon**, is a smart system that automates **data extraction from bank statements**, provides a **manual review interface**, and utilizes **machine learning** to detect **fraudulent transactions**. The system is developed using **Django** for the backend, **React** for the frontend, and **MongoDB** for data storage.

---

## 🎯 Key Features

- **📄 PDF Upload**: Upload a bank statement PDF and extract data from it.
- **🔍 Data Extraction**: Automatically extract transaction data from PDFs using **OCR**.
- **💡 Fraud Detection**: Use the **DBSCAN** algorithm to identify potentially fraudulent transactions.
- **📝 Manual Review**: A user-friendly interface to review and modify extracted data.
- **📥 CSV Export**: Export the reviewed data as a CSV file for further use.

---

## 🚀 Tech Stack

- **Backend**: [Django](https://www.djangoproject.com/) - Web framework to handle file uploads, extraction, and fraud detection.
- **Frontend**: [React](https://reactjs.org/) - Interactive UI for file upload and data review.
- **Database**: [MongoDB](https://www.mongodb.com/) - NoSQL database to store extracted data and user interactions.
- **Machine Learning**: **DBSCAN** (Density-Based Spatial Clustering of Applications with Noise) - For detecting anomalies in transaction patterns.
- **OCR**: [Mathpix](https://mathpix.com/) - For accurate text extraction from bank statement PDFs.

---

## 🛠️ Project Setup

### **Backend Setup (Django)**

1. **Clone the repository**:

    ```bash
    git clone https://github.com/your-username/bank-statement-extraction.git
    cd backend/backend_server
    ```

2. **Run Django migrations**:

    ```bash
    python manage.py migrate
    ```

3. **Start the Django server**:

    ```bash
    python manage.py runserver
    ```

### **Frontend Setup (React)**

1. **Navigate to the frontend directory**:

    ```bash
    cd frontend
    ```

2. **Install dependencies**:

    ```bash
    npm install
    ```

3. **Start the development server**:

    ```bash
    npm start
    ```

Your **React frontend** will be running on `http://localhost:3000/` and the **Django backend** on `http://localhost:8000/`.

------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------



## 📄 **How to Use**

Follow these simple steps to use the **Bank Statement Data Extraction and Fraud Detection System**:

---

### Step 1: **Upload PDF and Extract Data**

Upload your **bank statement PDF** to extract transaction data.

📂 **Endpoint**: `/pdf/upload/`

✅ **Upon successful upload**, the system will automatically:

![Upload PDF](https://drive.google.com/uc?export=view&id=1DepUZyaKDF5oNbhFm-scjW3zcTQ9joV4)

- 🔄 **Convert** the PDF to an image.
- 🔍 **Extract** the transaction data using **OCR**.
- ⚠️ **Apply DBSCAN** to detect **anomalies** and **flag potential fraud**.

---

### Step 2: **Review Extracted Data**

After the system processes your PDF, the **extracted data** will be displayed in a **React table** for you to manually review. You can:

- 🖊️ **Edit** or **correct** any errors in the data.
- ✔️ **Verify** the accuracy of the extracted transactions.
![Image Description](https://drive.google.com/uc?export=view&id=1-EhXUbi852R4r6Wq12lVOEtQ-YtofA4k)




---

### Step 3: **Detect Fraud**

The system automatically flags **fraudulent transactions** identified by the **DBSCAN algorithm**. These flagged entries will be highlighted in the table.

- 🔴 **Red Highlight**: Fraudulent transactions.
- 👀 **Review these transactions** carefully to determine if they are indeed fraudulent.
![Fraud Detection](https://drive.google.com/uc?export=view&id=1bzDLgM5z6EdCpitgGF7I-1IZ0FqtW8KZ)

---

### Step 4: **Download CSV**

After reviewing and verifying the data, you can export the results as a **CSV file**.

- 🖱️ **Click on the "Download CSV" button** to download the file for further use.

---

🎉 **That's it!** You've successfully extracted, reviewed, and detected fraudulent transactions from a **bank statement PDF**.

---



## 👥 Collaborators

| Avatar | Name         | GitHub Profile                                    |
|--------|--------------|---------------------------------------------------|
| <img src="https://github.com/Haribhajank.png?size=50" width="50" height="50"> | Haribhajan   | [@Haribhajank](https://github.com/Haribhajank)      |
| <img src="https://github.com/ABHISHEKgauti25.png?size=50" width="50" height="50"> | Abhishek     | [@ABHISHEKgauti25](https://github.com/ABHISHEKgauti25)          |
| <img src="https://github.com/ayushmothiya.png?size=50" width="50" height="50"> | Ayush        | [@ayushmothiya](https://github.com/ayushmothiya)                |
| <img src="https://github.com/sudhanshuk1404.png?size=50" width="50" height="50"> | Sudhanshu    | [@sudhanshuk1404](https://github.com/sudhanshuk1404)        |











