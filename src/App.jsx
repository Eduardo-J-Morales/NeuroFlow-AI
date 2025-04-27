import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Canvas } from '@react-three/fiber'
import { Sphere, Text, Line } from '@react-three/drei'

const createModel = () => {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({
        units: 8,
        activation: 'relu',
        inputShape: [3]
      }),
      tf.layers.dense({
        units: 1,
        activation: 'sigmoid'
      })
    ]
  })

  model.compile({
    optimizer: 'adam',
    loss: 'binaryCrossentropy',
    metrics: ['accuracy']
  })

  return model
}

const trainModel = async (model) => {
  const xs = tf.tensor2d([
    [15.2, 4.1, 2.8],  // Focused state
    [5.3, 6.7, 1.2],   // Distracted
    [18.9, 3.2, 2.5],  // Focused
    [4.8, 7.1, 0.9]    // Distracted
  ])

  const ys = tf.tensor2d([
    [1],  // Focused
    [0],  // Distracted
    [1],
    [0]
  ])

  await model.fit(xs, ys, {
    epochs: 100,
    batchSize: 2,
    validationSplit: 0.2
  })
}

function App() {
  const [focused, setFocused] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const [modelInsights, setModelInsights] = useState({
    architecture: [],
    weights: [],
    lastPrediction: null,
    featureImportance: { alpha: 0.65, beta: 0.25, gamma: 0.10 }
  })
  const modelRef = useRef(null)
  const animationRef = useRef()

  const generateFakeEEG = () => {

    return {
      alpha: Math.random() * 10 + (focused ? 15 : 5),
      beta: Math.random() * 5,
      gamma: Math.random() * 3
    }
  }

  useEffect(() => {
    const initializeModel = async () => {
      const model = createModel()
      await trainModel(model)

      const layers = model.layers.map(layer => ({
        name: layer.name,
        units: layer.units,
        activation: layer.activation,
        inputShape: layer.batchInputShape,
        outputShape: layer.outputShape
      }))

      const weights = model.getWeights().map(w => w.shape)

      setModelInsights(prev => ({
        ...prev,
        architecture: layers,
        weights: weights
      }))

      modelRef.current = model
    }

    initializeModel()
  }, [])

  useEffect(() => {
    const predictionInterval = setInterval(async () => {
      const eegData = generateFakeEEG()
      const input = tf.tensor2d([[eegData.alpha, eegData.beta, eegData.gamma]])

      if (modelRef.current) {
        const prediction = modelRef.current.predict(input)
        const confidence = prediction.dataSync()[0]
        const isFocused = confidence > 0.7

        setModelInsights(prev => ({
          ...prev,
          lastPrediction: {
            input: eegData,
            confidence: confidence,
            threshold: 0.7,
            decisionBoundary: confidence.toFixed(3)
          }
        }))

        setFocused(isFocused)
      }
    }, 1000)

    return () => clearInterval(predictionInterval)
  }, [])

  return (
    <div className="neuro-container">

<div className="status-header">
      <h1>NeuroFlow AI</h1>
      <div className={`focus-state ${focused ? 'active' : 'inactive'}`}>
        <h2>
          {focused ? (
            <>
              <span className="pulse">🧠</span> In Focus Zone
            </>
          ) : (
            <>
              <span>😴</span> Attention Drifting
            </>
          )}
        </h2>
        <p className="state-subtitle">
          {focused 
            ? "Optimal cognitive engagement detected"
            : "Increased mind-wandering patterns observed"}
        </p>
      </div>
    </div>
      <div className="dashboard">

        <div className="model-card">
          <h3>Neural Network Architecture</h3>
          <div className="layers-grid">
            {modelInsights.architecture.map((layer, idx) => (
              <div key={idx} className="layer-card">
                <h4>Layer Type: {layer.name}</h4>
                <p>Units: {layer.units}</p>
                <p>Activation: {`${layer.activation.constructor.name}`}</p>
              </div>
            ))}
          </div>
        </div>

        {modelInsights.lastPrediction && (
          <div className="prediction-card">
            <h3>Decision Analysis</h3>
            <div className="prediction-grid">
              <div>
                <h4>Input Features</h4>
                <ul>
                  <li>Alpha: {modelInsights.lastPrediction.input.alpha.toFixed(2)}Hz</li>
                  <li>Beta: {modelInsights.lastPrediction.input.beta.toFixed(2)}Hz</li>
                  <li>Gamma: {modelInsights.lastPrediction.input.gamma.toFixed(2)}Hz</li>
                </ul>
              </div>

              <div>
                <h4>Model Confidence</h4>
                <div className="confidence-meter">
                  <div
                    className="confidence-fill"
                    style={{ width: `${modelInsights.lastPrediction.confidence * 100}%` }}
                  />
                  <span>{modelInsights.lastPrediction.confidence.toFixed(3)}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default App
