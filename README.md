# LLM Chat Bot

A production-ready full-stack AI chat application powered by LLM, built for low-latency conversations, persistent memory, and multimodal understanding.

Unlike basic chatbots, it integrates **Mem0** as a long-term memory layer, enabling more personalized, context-aware interactions across sessions.

Built with **Next.js**, **MongoDB**, **Tailwind CSS**, and **Cloudinary**, it delivers a modern, responsive experience inspired by ChatGPT and Gemini.

## Live Demo

You can view the live application at [LLM Chat Bot](https://akshay-chat-gpt-clone.vercel.app/)

## Features

- **Conversation Memory**: Integrated **Mem0** for conversational memory, allowing the bot to recall past interactions for a more personalized and context-aware experience.
- **Multimodal (Image Upload)**: Upload images via Cloudinary and ask questions about them — LLM analyzes them using its vision capabilities.
- **Typewriter Effect**: Bot responses animate in character-by-character for a natural, streaming feel.
- **Authentication**: Secure sign-in via NextAuth with Google OAuth; all chat APIs are session-protected.
- **Per-Chat History**: Messages are stored by chat and user; sidebar previews the last message of each chat.
- **Create/Delete Chats**: Create chats client-side and navigate immediately; delete with cleanup of associated messages.
- **Edit Previous Messages**: Supports editing sent messages to correct or refine prompts after sending.
- **LLM used**:  Gemini 2.5 Flash (Fast, high-quality AI responses powered by Google's latest model).
- **Responsive UI**: Optimized for desktop and mobile with a slide-out drawer sidebar.

## Screenshots

| Login Page | Chat Interface |
|:----------:|:--------------:|
| ![Login](https://res.cloudinary.com/dz1vsgxm5/image/upload/v1777923636/ChatGPTClone/Screenshot_2026-05-05_010928_dajfq7.png) | ![Chat](https://res.cloudinary.com/dz1vsgxm5/image/upload/v1777923636/ChatGPTClone/Screenshot_2026-05-05_010913_wfoivr.png) |

## Technologies Used

- **Framework**: Next.js

- **Language**: TypeScript

- **LLM**: Google Gemini 2.5 Flash

- **Memory** : Mem0

- **Styling**: TailwindCSS

- **Database**: MongoDB

- **File Storage**: Cloudinary

- **Authentication**: Next-Auth

- **Deployment**: Vercel

## Architecture

```
┌──────────────────────┐
│   Frontend (Next.js) │
│   React + Tailwind   │
└──────────┬───────────┘
           │
           ▼
┌──────────────────────┐
│  API Routes (Next.js)│
│   Server-side logic  │
└──────────┬───────────┘
           │
     ┌─────┴─────┐
     ▼           ▼
┌─────────┐ ┌─────────┐
│ Gemini  │ │  Mem0   │
│  API    │ │ Memory  │
│ (LLM)  │ │  Layer  │
└────┬────┘ └────┬────┘
     │           │
     └─────┬─────┘
           ▼
┌──────────────────────┐
│   MongoDB (Chats &   │
│   Message Persistence│
│       via Mongoose)  │
└──────────────────────┘
           │
           ▼
┌──────────────────────┐
│ Cloudinary (Image    │
│    Upload & Storage) │
└──────────────────────┘
```

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

        # Mem0 Keys
        MEM0_API_KEY = your-mem0-api-key
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
