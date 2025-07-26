# 🌟 Star Meter - Celebrity Face Classifier

Star Meter is a Machine Learning powered web application that detects and classifies celebrity faces from uploaded images. The app features a modern frontend with drag-and-drop functionality and a high-performance backend powered by FastAPI, fully containerized with Docker for easy deployment.

👉 [Live Frontend Demo](https://prudhvi-232.github.io/StarMeter/)  
👉 [Backend API](https://starmeter-271169096125.asia-south2.run.app/)

 <!-- TODO: Replace with a real screenshot of your app -->

---

## ✨ Features

-   **Interactive Web UI**: A clean, responsive user interface for easy drag-and-drop image uploads using Dropzone.js.
-   **High-Performance Backend**: Built with FastAPI for fast, asynchronous API request handling.
-   **Face Detection**: Utilizes OpenCV's pre-trained Haar Cascade models to accurately detect faces in images.
-   **Celebrity Classification**: (Currently Mocked) A backend service that returns classification probabilities for a predefined list of celebrities.
-   **Containerized**: Fully containerized with Docker for consistent development and easy deployment.
-   **Cloud-Ready**: Configured for seamless deployment to serverless platforms like Google Cloud Run.

---

## 🛠️ Tech Stack

-   **Backend**: Python, FastAPI, Uvicorn
-   **Machine Learning**: OpenCV, NumPy
-   **Frontend**: HTML5, CSS3, JavaScript, jQuery, Dropzone.js, Bootstrap
-   **Deployment**: Docker, Google Cloud Run

---

## 📂 Project Structure

```
face-detection/
├── docs/                 # Contains all frontend static files (HTML, CSS, JS)
│   ├── app.css
│   ├── app.js
│   ├── dropzone.min.css
│   ├── dropzone.min.js
│   ├── images/
│   └── index.html
├── server/               # Contains the FastAPI backend application
│   └── main.py
├── .dockerignore         # Specifies files to exclude from the Docker image
├── Dockerfile            # Instructions for building the Docker container
└── requirements.txt      # Python dependencies
```

---

## 🚀 Getting Started

### Prerequisites

-   Python 3.8+
-   `pip` (Python package installer)
-   Docker Desktop

### Method 1: Running Locally (without Docker)

1.  **Clone the repository:**

    ```bash
    git clone <your-repository-url>
    cd face-detection
    ```

2.  **Install Python dependencies:**

    ```bash
    pip install -r requirements.txt
    ```

3.  **Run the FastAPI server:**
    The server will start on `http://127.0.0.1:8000`.

    ```bash
    uvicorn server.main:app --host 0.0.0.0 --port 8000 --reload
    ```

4.  **Open the web interface:**
    Navigate to the `docs/` folder and open the `index.html` file in your web browser.

### Method 2: Running with Docker (Recommended)

This is the easiest way to run the application, as it handles all dependencies within a container.

1.  **Build the Docker image:**
    From the project root, run:

    ```bash
    docker build -t star-meter-app .
    ```

2.  **Run the Docker container:**
    This command maps port 8000 on your machine to port 8000 in the container.

    ```bash
    docker run -p 8000:8000 star-meter-app
    ```

3.  **Access the application:**
    Open your web browser and go to **http://localhost:8000**.

---

## ☁️ Deployment to Google Cloud Run

This application is configured for easy deployment to Google Cloud Run.

1.  **Build and push the image to Google Container Registry (GCR):**
    Replace `YOUR_PROJECT_ID` with your actual Google Cloud project ID.

    ```bash
    gcloud builds submit --tag gcr.io/YOUR_PROJECT_ID/star-meter-app
    ```

2.  **Deploy the service to Cloud Run:**
    ```bash
    gcloud run deploy star-meter-app \
      --image gcr.io/YOUR_PROJECT_ID/star-meter-app \
      --platform managed \
      --region <your-chosen-region> \
      --allow-unauthenticated
    ```

---

## 📬 API Endpoint

**POST** `/classify`
Send image file in `form-data` body with key `file`.

Returns:

```json
{
	"predictions": [
		{
			"celebrity": "Celebrity Name",
			"probability": 0.92
		}
	],
	"faces_detected": 1
}
```

---

## 🧠 Future Enhancements

Here are some improvements planned for the next version:

-   ✅ **User Authentication**

    -   Add OAuth2 or JWT login
    -   Allow users to see their classification history

-   ✅ **Caching with Redis**

    -   Improve response time for repeated queries
    -   Cache model predictions

-   ✅ **Enhanced ML Model**

    -   Train on larger celebrity dataset
    -   Improve accuracy with deep learning models

-   ✅ **Image Optimization**

    -   Compress images before processing
    -   Support multiple image formats

-   ✅ **Analytics Dashboard**
    -   Track usage statistics
    -   Monitor model performance

---

## 🤝 Contributing

We welcome all contributions!

1. **Fork** the repo
2. Create a new branch: `git checkout -b feature-name`
3. Make your changes
4. Commit: `git commit -m "Added feature"`
5. Push and create a PR!

Make sure your code is readable and documented.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use, modify, and share!

---

## 👨‍💻 Author

Built with ❤️ by [prudhvi](https://github.com/Prudhvi-232)  
Powered by FastAPI, OpenCV & Google Cloud Platform

---
