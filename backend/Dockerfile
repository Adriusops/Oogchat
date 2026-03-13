#multi-stage build
#stage 1: build
FROM golang:1.26.1-alpine AS builder

WORKDIR /app

COPY go.mod .

RUN go mod download

COPY . .

RUN go build -o TLDRizer .

#stage 2: run
FROM alpine:latest

WORKDIR /app

COPY --from=builder /app/TLDRizer .

CMD ["./TLDRizer"]
