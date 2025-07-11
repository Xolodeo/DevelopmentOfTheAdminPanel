FROM python:3.10
RUN apt-get update && apt-get install -y postgresql-client
WORKDIR /usr/src/app
COPY requirements.txt ./
RUN pip install --no-cache-dir -r requirements.txt
COPY . .
CMD ["sh", "-c", "until pg_isready -h db -p 5432; do echo waiting for db; sleep 2; done; uvicorn main:app --host 0.0.0.0 --port 3000"]
