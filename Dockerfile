# Use an official Python 3.9 slim image as a parent image
FROM python:3.9-slim

# Set the working directory in the container
WORKDIR /app

# Copy the requirements file first to leverage Docker cache
COPY requirements.txt .

# Install any needed packages specified in requirements.txt
# --no-cache-dir ensures the image is smaller
RUN pip install --no-cache-dir --upgrade -r requirements.txt

# Copy the application code (the 'server' directory) into the container
# The source path is relative to the build context (your project root)
COPY server ./server

# Copy the frontend static files into the container
COPY docs ./docs

# Create a non-root user for security and switch to it
RUN addgroup --system app && adduser --system --ingroup app app
USER app

# Expose the port the container will listen on. This is good practice.
# The PORT environment variable will be provided by Cloud Run.
EXPOSE 8080

# Run uvicorn when the container launches.
# Use 0.0.0.0 to make it accessible from outside the container.
# Use the $PORT environment variable provided by Cloud Run.
CMD ["uvicorn", "server.main:app", "--host", "0.0.0.0", "--port", "8080"]