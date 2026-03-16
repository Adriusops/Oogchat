FROM ollama/ollama:latest

EXPOSE 11434

COPY . /app

RUN chmod +x /app/start.sh

ENTRYPOINT ["/app/start.sh"]
