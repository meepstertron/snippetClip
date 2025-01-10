# Use a lightweight base image
FROM python:3.9-slim

# Set the working directory
WORKDIR /app

# Copy only the requirements file first to leverage Docker layer caching
COPY requirements.txt .

# Install dependencies
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application code
COPY . .

# Create a non-root user for security
RUN useradd -m flaskuser
USER flaskuser

# Expose the application port
EXPOSE 5000

# Use environment variables for configuration
ENV FLASK_APP=main.py
ENV FLASK_DEBUG=0

# Use Gunicorn to serve the app
CMD ["gunicorn", "-w", "4", "-b", "0.0.0.0:5000", "main:app"]
