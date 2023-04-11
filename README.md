# Orion Queue Pusher

## What is Orion?
Orion is our internal service that takes events and messages from our Farcaster nodes, and pushes them into our SQS queues.

## Why Orion?
ChatGPT came up with it

## How it works
```mermaid
graph LR
    A(Farcaster Hub) --> B(Orion Service)
    B --> C(SQS Queue)
```



