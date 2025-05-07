# NeuroFlow AI

This web app employs an AI model, trained with TensorFlow.js, to predict whether a simulated individual is "focused" or "distracted." This prediction is based on simulated brain wave data (alpha, beta, gamma) generated every second. The app also features a glowing meter indicating the AI's confidence level in its prediction and visually represents the AI's "brain structure" using simple cards. Finally, it displays the predicted state with emojis: 🧠 for focused and 😴 for distracted.

> ⚡ **Note:** There is an explanation to install this Web App below for developers, however you don't need to install anything to try this Web App!  
> An online demo is available here: [Live Web App Deployment](https://neuro-flow-ai-git-main-eduardo-j-morales-projects.vercel.app/)

## Features

- **Synthetic EEG Generation**: Simulated alpha/beta/gamma waves
- **In-Browser ML Training**: TensorFlow.js neural network
- **3D Focus Feedback**: Color-changing brain sphere
- **Precision Session Timer**: Focus-duration analytics
- **Production-Grade React**: Clean state management

## Technology Stack

[![React](https://img.shields.io/badge/React-20232A?logo=react&logoColor=61DAFB)](https://reactjs.org/)
[![TensorFlow.js](https://img.shields.io/badge/TensorFlow.js-FF6F00?logo=tensorflow&logoColor=white)](https://www.tensorflow.org/js)
[![Three.js](https://img.shields.io/badge/Three.js-000000?logo=three.js&logoColor=white)](https://threejs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
  
## Installation

1. ### Clone the repo:
    ```bash
    git clone https://github.com/Eduardo-J-Morales/NeuroFlow-AI.git
    cd NeuroFlow-AI
    ```

2. ### Install dependencies:
    ```bash
    npm install
    ```

3. ### Run the app:
    ```bash
    npm run dev
    ```
