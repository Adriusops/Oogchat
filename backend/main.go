package main

import (
	"bytes"
	"encoding/json"
	"io"
	"log"
	"net/http"
)

type ollama_json struct {
	Model  string `json:"model"`
	Prompt string `json:"prompt"`
	Stream bool   `json:"stream"`
	System string `json:"system"`
}

type ollama_response struct {
	Response string `json:"response"`
}

type request_body struct {
	Input string `json:"input"`
}

func main() {
	router := http.NewServeMux()

	router.HandleFunc("POST /chat", getChat)
	router.HandleFunc("OPTIONS /chat", getOptions)

	err := http.ListenAndServe(":7070", router)
	if err != nil {
		log.Fatal(err)
	}
}

func getOptions(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	w.WriteHeader(http.StatusOK)
}

func getChat(w http.ResponseWriter, r *http.Request) {

	w.Header().Set("Access-Control-Allow-Origin", "*")
	w.Header().Set("Access-Control-Allow-Methods", "POST")
	w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

	// save input
	input, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "Failed to read request body", http.StatusInternalServerError)
		return
	}

	var reqBody request_body

	err = json.Unmarshal(input, &reqBody)
	if reqBody.Input == "" {
		http.Error(w, "Failed to call Ollama", http.StatusBadRequest)
		return
	}

	prompt_System := `You are an ancient, wise sage who has read every text ever written.
					When a user gives you a text to summarize, you do not merely compress it.
					You distill its deepest truth into a few profound sentences — as a master
					would whisper wisdom to a student.

					Rules:
					- Take inspiration of Oogway in Kung fu panda
					- Speak slowly, with weight. Every word must earn its place.
					- Use metaphors, but keep them simple and universal.
					- Never use bullet points or lists. Only flowing, contemplative prose.
					- End with a single closing reflection — one sentence that lingers.
					- Maximum 4-5 sentences total. Wisdom is not verbose. Be concise. It must sound like punchlines.
					- Always respond in French, regardless of the input language.`

	instance := new(ollama_json)
	instance.Model = "mistral"
	instance.Prompt = string(reqBody.Input)
	instance.Stream = false
	instance.System = prompt_System

	// convert with json.Marshal
	bs, _ := json.Marshal(instance)

	req, err := http.NewRequest("POST", "http://localhost:11434/api/generate", bytes.NewBuffer(bs))
	req.Header.Set("Content-Type", "application/json")

	client := &http.Client{}
	resp, err := client.Do(req)
	if err != nil {
		http.Error(w, "Request body is empty", http.StatusBadRequest)
		return
	}
	defer resp.Body.Close()

	bodyBytes, err := io.ReadAll(resp.Body)
	if err != nil {
		http.Error(w, "Failed to read response body", http.StatusInternalServerError)
		return
	}

	var result ollama_response

	err = json.Unmarshal(bodyBytes, &result)
	if err != nil {
		http.Error(w, "Failed to Unmarshal", http.StatusInternalServerError)
		return
	}

	w.Write([]byte(result.Response))
}
