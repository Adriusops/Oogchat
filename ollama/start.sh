#!/bin/bash

# Start the Ollama server in the background
ollama serve &

sleep 5

# Run the model
ollama pull mistral

wait
