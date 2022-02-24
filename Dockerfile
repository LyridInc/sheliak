# Use the official lightweight Python image.
# https://hub.docker.com/_/python
FROM python:3.9 as build-python

# Copy local code to the container image.
ENV APP_HOME /app
WORKDIR $APP_HOME
COPY requirements.txt .

# Install production dependencies.
RUN pip install gunicorn

RUN echo "Starting to package..."

RUN pip install -r requirements.txt

FROM python:3.9-slim

# Copy local code to the container image.
COPY --from=build-python /usr/local/lib/python3.9/site-packages/ /usr/local/lib/python3.9/site-packages/
COPY --from=build-python /usr/local/bin/ /usr/local/bin/

ENV APP_HOME /app
WORKDIR $APP_HOME
COPY . .

WORKDIR /go/src/lyra/
COPY . .

CMD exec gunicorn --bind :$PORT --workers 4 --threads 2 config.wsgi