# ChatGPT-Clone: Next.js Chat Application

A modern, responsive ChatGPT-style chat application built with Next.js, NextAuth, MongoDB (Mongoose), Tailwind and Cloudinary. It supports authenticated chat sessions, per-chat message history, and clean client-side navigation with optimistic UX.

## Overview

This app lets authenticated users create chats, view their message history, and continue conversations with a seamless UI. Each chat has a stable identifier, and messages are scoped to both the chat and the signed-in user to ensure privacy and data isolation.

## Live Demo

You can view the live application at [ChatGPT-Clone](https://akshay-chat-gpt-clone.vercel.app/)

## Features

- **Responsive UI**:  Optimized for desktop and mobile with a minimal, accessible layout.
- **Authentication**:  Secure sign-in via NextAuth; sessions protect all chat APIs.
- **Memory Capability**: Integrated **Mem0** for conversational memory, allowing the bot to recall past interactions for a more personalized and context-aware experience.
- **Per-Chat History**:  Messages are stored by chat and user; list items preview the last message.
- **Create/Delete Chats**:  Create chats client-side and navigate immediately; delete with cleanup of associated messages.
- **Edit previous messages**:  Supports editing sent messages with server-side validation and updated timestamps to correct or refine content after sending

## Screenshots
### Login Page

![CoolChat Screenshot](https://res.cloudinary.com/dz1vsgxm5/image/upload/v1757269523/ChatGPTClone/Screenshot_2025-09-07_230056_tbljkw.png)

### Chat Interface

![Login Screenshot](https://res.cloudinary.com/dz1vsgxm5/image/upload/v1757269546/ChatGPTClone/Screenshot_2025-09-07_230150_hdhnl8.png)

## Technologies Used

- **Framework**: Next.js

- **Language**: TypeScript

- **Memory** : Mem0

- **Styling**: TailwindCSS

- **Database**: MongoDB

- **File Storage**: Cloudinary

- **Authentication**: Next-Auth

- **Deployment**: Vercel

## Installation

To run this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/Akshaygarg034/Chat-GPT-Clone.git
   ```

2. Navigate to the project directory:

    ```bash
    cd ChatGPT-Clone
    ```

3. Install the dependencies:

    ```bash
    npm install
    ```

4. Add a .env file in the root directory with the following variables:

    ```bash
        # Gemini API keys
        GEMINI_API_KEY = your-gemini-api-key

        # Next Auth keys
        GOOGLE_ID = your-next-auth-google-id
        GOOGLE_SECRET = your-next-auth-google-secret
        NEXTAUTH_SECRET = your-next-auth-secret
        NEXTAUTH_URL = your-next-auth-url

        # MongoDB Keys
        MONGODB_URI= your-mongo-uri
        MONGODB_DB=your-mongodb-db-name

        # Cloudinary Keys
        NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
        NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your-cloudinary-upload-preset

        CLOUDINARY_API_SECRET = your-cloudinary-api-secret
        CLOUDINARY_API_KEY = your-cloudinary-api-key
    ```

5. Start the Next.js app:

    ```bash
    npm run dev
    ```

6. Open your web browser and visit <http://localhost:3000/> to use the app locally.


## Contact

If you have any questions, feedback, or would like to get in touch with me, feel free to reach out to me:
- **Email**: [gargakshay034@gmail.com](gargakshay034@gmail.com)
- **Linkedin**: [https://www.linkedin.com/in/akshay-garg-360281213](https://www.linkedin.com/in/akshay-garg-360281213/)
