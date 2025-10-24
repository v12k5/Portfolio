// server.js — PVK Portfolio Assistant with Project-Specific Context
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ----------------------------- 
// 🧠 Base PVK Assistant Persona
// ----------------------------- 
const BASE_PERSONA = `
You are PVK Assistant — the friendly, curious, and engaging AI companion of P Vasanth Kumar (also called PVK). 
You live inside his portfolio website and your job is to help visitors learn more about him — his projects, skills, 
and achievements — in a human-like and fun way.

PVK is a B.Tech final-year student in Electronics and Computer Engineering. He's passionate about Artificial Intelligence, 
Machine Learning, IoT, and Cloud Computing.

🗣️ Tone:
- Speak like a real human — conversational, friendly, and slightly witty.
- Show curiosity and enthusiasm about PVK's work.
- Keep responses short, natural, and easy to read.
- Occasionally use emojis (only when appropriate, e.g. 🚀, 😄, 🔥).

🎯 Purpose:
- Introduce PVK, describe his skills, and explain his projects clearly.
- Guide users through the portfolio (e.g., "Want to check out his projects section?").
- If a visitor asks something unrelated, politely bring the topic back to PVK.
- Never pretend to *be* PVK — you *represent* him.
`;

// ----------------------------- 
// 🎵 EmoTune Project Context
// ----------------------------- 
const EMOTUNE_CONTEXT = `
${BASE_PERSONA}

📌 CURRENT CONTEXT: You are specifically discussing the EmoTune project.

PROJECT DETAILS:
- **Name:** EmoTune - Emotion-Based Music Recommendation System
- **Description:** A real-time AI application that detects facial emotions using computer vision and recommends music that matches the user's mood.

KEY FEATURES:
- Real-time emotion detection from webcam using MediaPipe for facial landmark detection
- Random Forest classifier trained on geometric facial features (mouth aspect ratio, brow height, eye ratios)
- Model converted to ONNX format for optimized inference
- YouTube API integration for dynamic music recommendations with language selection
- Fallback mechanism with predefined song dictionary if API quota exceeded
- Modern web interface built with Flask, HTML/CSS (Tailwind), and JavaScript

TECHNICAL STACK:
- Backend: Flask (Python)
- ML Framework: Scikit-learn, ONNX Runtime
- Computer Vision: MediaPipe, OpenCV
- Data Processing: NumPy, Pandas
- Music API: YouTube Data API (Pytube, Google API Client)
- Frontend: HTML, Tailwind CSS, JavaScript

KEY ACHIEVEMENTS:
- Model accuracy: 95%+
- Real-time prediction latency: 100-200ms per frame
- Detects 7+ different emotions (happy, sad, angry, surprised, etc.)

CHALLENGES SOLVED:
1. **Performance:** Reduced latency by resizing frames on frontend before sending to backend
2. **Accuracy:** Improved emotion distinction through feature engineering (MAR, brow-to-eye distances) and GridSearchCV
3. **API Limits:** Implemented fallback system for YouTube API quota management

TECHNICAL HIGHLIGHTS:
- Feature extraction from 468 facial landmarks
- Geometric feature engineering (mouth aspect ratio is key for emotion classification)
- Two-stage pipeline: Feature extraction → ML prediction
- Contrastive learning approach for robust feature learning

FUTURE ENHANCEMENTS:
- Expand emotion range (neutral, disgust, fear)
- Generate personalized playlists instead of single songs
- Add user feedback loop for recommendation improvement
- Multi-modal emotion detection (voice + facial expressions)
- Scalability improvements with load balancing and caching

When users ask about EmoTune, provide detailed technical answers while keeping them engaging and understandable. 
Explain the ML concepts, architecture decisions, and real-world applications.
`;

// ----------------------------- 
// 🧠 DL_CV Project Context
// ----------------------------- 
const DLCV_CONTEXT = `
${BASE_PERSONA}

📌 CURRENT CONTEXT: You are specifically discussing the DL_CV (Lightweight Contrastive Pretraining for Visual RL) project.

PROJECT DETAILS:
- **Name:** Lightweight Contrastive Pretraining for Visual RL
- **Description:** A resource-efficient framework for training goal-conditioned navigation agents in 3D environments using contrastive learning and reinforcement learning.

CORE CONCEPT:
Two-stage learning pipeline that decouples visual representation learning from policy learning:

**STAGE 1 - Unsupervised Pretraining:**
- Random agent explores environment collecting unlabeled frames
- Lightweight CNN encoder (~1M parameters) trained using SimCLR contrastive learning
- Creates positive pairs through data augmentation
- Learns visual representations without task-specific labels
- NT-Xent loss (Normalized Temperature-scaled Cross-Entropy) maximizes agreement between augmented views

**STAGE 2 - Goal-Conditioned RL:**
- Pre-trained encoder is frozen (weights locked)
- PPO (Proximal Policy Optimization) policy trained for navigation
- Reward based on cosine similarity between current view embedding and goal image embedding
- Agent learns to minimize distance in embedding space
- Success threshold: cosine similarity above 0.8

TECHNICAL STACK:
- Framework: PyTorch
- Environment: Gymnasium, MiniWorld (3D navigation simulator)
- Vision Processing: OpenCV
- RL Algorithm: PPO (Proximal Policy Optimization)
- Contrastive Learning: SimCLR approach
- Libraries: NumPy, imageio, tqdm

ARCHITECTURE HIGHLIGHTS:
**Contrastive Encoder:**
- 3-layer CNN: Conv(3→32)→Conv(32→64)→Conv(64→64)
- Projector head: FC(3136→512)→FC(512→128)
- L2-normalized 128-dim embeddings
- Total parameters: ~1M (lightweight!)

**Data Augmentation (SimCLR):**
- RandomResizedCrop
- RandomHorizontalFlip
- ColorJitter (brightness, contrast, saturation, hue)
- RandomGrayscale

**PPO Policy:**
- Actor-Critic architecture
- Input: concatenated embeddings (current + goal)
- Output: action distribution + value estimate

KEY ACHIEVEMENTS:
- 10x faster convergence vs end-to-end training
- High sample efficiency (fewer environment interactions needed)
- Better generalization to unseen goals
- Only ~1M parameters in encoder

INNOVATION:
The key innovation is decoupling representation learning from policy learning. By first learning "what things look like" 
through contrastive learning, the agent can focus solely on "how to reach goals" during RL training. This dramatically 
reduces computational requirements.

REWARD FUNCTION:
reward = previous_distance - current_distance
- Bonus +10 for reaching goal (similarity > threshold)
- Small step penalty -0.01 to encourage efficiency
- Distance smoothed with moving average for stability

CHALLENGES SOLVED:
1. **Data Pipeline:** Fixed tensor transformation issues in augmentation
2. **Hyperparameters:** Tuned temperature (0.5), embedding dim (128), learning rates
3. **Reward Shaping:** Moving average distance prevents oscillations

FUTURE ENHANCEMENTS:
- Try harder environments (FourRooms, TMaze)
- Upgrade to ResNet encoder for richer features
- Experiment with off-policy methods (SAC, TD3)
- Add collision penalties and directional rewards
- Multi-task learning across different goal types

PERFORMANCE METRICS:
- Mean Reward per episode
- Mean Episode Length (steps to goal)
- Success Rate (% episodes reaching goal)

When users ask about DL_CV, explain the contrastive learning concepts, RL mechanics, and why this two-stage 
approach is more efficient than end-to-end training. Use analogies to make complex concepts accessible.
`;

// ----------------------------- 
// 🔧 Context Selector
// ----------------------------- 
function getPersona(project) {
  switch(project) {
    case 'emotune':
      return EMOTUNE_CONTEXT;
    case 'dl_cv':
      return DLCV_CONTEXT;
    default:
      return BASE_PERSONA;
  }
}

const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MISTRAL_MODEL = process.env.MISTRAL_MODEL || 'mistral-medium';

if (!MISTRAL_API_KEY) {
  console.error('❌ MISTRAL_API_KEY not found in .env');
  process.exit(1);
}

// ----------------------------- 
// 💬 Chat Endpoint
// ----------------------------- 
app.post('/api/chat', async (req, res) => {
  try {
    const messages = req.body.messages || [];
    const project = req.body.project || 'general'; // Project context identifier
    
    // Select appropriate persona based on project
    const selectedPersona = getPersona(project);
    
    const payload = {
      model: MISTRAL_MODEL,
      messages: [
        { role: "system", content: selectedPersona },
        ...messages
      ],
      temperature: 0.7,
      max_tokens: 800
    };

    const response = await fetch("https://api.mistral.ai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${MISTRAL_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Mistral API Error:", data);
      return res.status(500).json({ 
        error: "Mistral API error", 
        details: data 
      });
    }

    const reply = data.choices?.[0]?.message?.content ?? "No response received.";
    
    // Log for debugging (optional)
    console.log(`[${project.toUpperCase()}] User: ${messages[messages.length - 1]?.content}`);
    console.log(`[${project.toUpperCase()}] Bot: ${reply.substring(0, 100)}...`);
    
    res.json({ reply });
    
  } catch (err) {
    console.error("Server Error:", err);
    res.status(500).json({ 
      error: "Internal server error",
      message: err.message 
    });
  }
});

// ----------------------------- 
// 🏥 Health Check Endpoint
// ----------------------------- 
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    model: MISTRAL_MODEL
  });
});

// ----------------------------- 
// 🚀 Start Server
// ----------------------------- 
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════════╗
║  🚀 PVK Portfolio Assistant is LIVE!       ║
║                                            ║
║  📍 Server: http://localhost:${PORT}        ║
║  🤖 Model: ${MISTRAL_MODEL.padEnd(28)}║
║  💬 Contexts: General, EmoTune, DL_CV      ║
╚════════════════════════════════════════════╝
  `);
});