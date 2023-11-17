# Dockerfile

# Pull base image
FROM python:3.11.4-slim-buster

# Set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install system dependencies
RUN apt-get update && apt-get install -y netcat

# Set work directory
WORKDIR /usr/src/kpro_web

# Install dependencies
RUN pip install --upgrade pip
COPY ./requirements.txt .
RUN pip install -r requirements.txt

# copy entrypoint.sh
COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g' /usr/src/kpro_web/entrypoint.sh
RUN chmod +x /usr/src/kpro_web/entrypoint.sh

# Copy project
COPY . .

# run entrypoint.sh
ENTRYPOINT ["/usr/src/kpro_web/entrypoint.sh"]
