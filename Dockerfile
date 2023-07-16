# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.10 as build-python

# Copy local code to the container image.
RUN apt update && apt install pkg-config libxml2-dev libxmlsec1-dev libxmlsec1-openssl -y

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY requirements.txt .

# Install production dependencies.
RUN pip install gunicorn

RUN echo "Starting to package..."

RUN pip install -r requirements.txt

FROM python:3.10-slim

RUN apt update && apt install pkg-config libxml2-dev libxmlsec1-dev libxmlsec1-openssl -y

# Copy local code to the container image.
COPY --from=build-python /usr/local/lib/python3.10/site-packages/ /usr/local/lib/python3.10/site-packages/
COPY --from=build-python /usr/local/bin/ /usr/local/bin/

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . .

WORKDIR /go/src/lyra/
COPY . .

CMD exec gunicorn --bind :$PORT --workers 4 --threads 2 config.wsgi