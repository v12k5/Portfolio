# PVK Portfolio Assistant

This repository contains the source code for P Vasanth Kumar's personal portfolio website, featuring a dynamic, context-aware AI assistant powered by Mistral AI.

**Live Site:** [https://pvk.app/](https://portfolio-pearl-nu-81.vercel.app/) *(Replace with your actual Vercel URL)*

---

## 🚀 Features

- **Interactive Portfolio:** A modern and responsive single-page portfolio showcasing projects, skills, and experience.
- **AI-Powered Chatbot:** A friendly AI assistant, "VasanthBot," that can answer visitor questions about PVK's work.
- **Project-Specific Context:** The chatbot intelligently loads different knowledge bases depending on which project page (`EmoTune` or `DL_CV`) the user is viewing, allowing for detailed, in-depth conversations.
- **Dynamic UI:** Built with pure HTML, CSS, and JavaScript, featuring a custom cursor, particle effects, and scroll-reveal animations for an engaging user experience.
- **Node.js Backend:** A lightweight Express.js server handles API requests to the Mistral AI service.

## 🛠️ Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript
- **Backend:** Node.js, Express.js
- **AI Engine:** Mistral AI
- **Deployment:** Vercel

## ⚙️ Local Setup

To run this project on your local machine, follow these steps:

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/v12k5/Portfolio.git
    cd Portfolio
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a file named `.env` in the root of the project and add your Mistral AI API key:
    ```env
    MISTRAL_API_KEY="your_mistral_api_key_here"
    ```

4.  **Run the server:**
    ```bash
    npm start
    ```
    The application will be running at `http://localhost:3000`.

## 🚀 Deployment

This project is optimized for deployment on [Vercel](https://vercel.com/).

1.  Push the code to a GitHub repository.
2.  Import the repository into Vercel.
3.  In the Vercel project settings, add your `MISTRAL_API_KEY` as an environment variable.
4.  Deploy! Vercel will automatically handle the build process.

## 📂 Project Structure

```
.
├── public/
│   ├── index.html         # Main portfolio page
│   ├── emotune.html       # EmoTune project page
│   ├── dl-cv.html         # DL_CV project page
│   └── image.jpg          # Background image
├── .env                   # Local environment variables (ignored by git)
├── .gitignore             # Specifies files for Git to ignore
├── package.json           # Project metadata and dependencies
├── server.js              # Express server and API logic for the chatbot
└── README.md              # This file
```
