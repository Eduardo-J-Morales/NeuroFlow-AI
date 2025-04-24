import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Canvas } from '@react-three/fiber'
import { Sphere, OrbitControls } from '@react-three/drei'
import { positionGeometry } from 'three/tsl'


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
  const modelRef = useRef(null)
  const animationRef = useRef()

  const generateFakeEGG = () => ({
    alpha: Math.random() * 10 + (focused ? 15 : 5),
    beta: Math.random() * 5,
    gamma: Math.random() * 3
  })
  
  useEffect(() => {
    const initializeModel = async () => {
      const model = createModel();
      await trainModel(model);
      modelRef.current = model;
    }

    initializeModel()

    const interval = setInterval(() => {
      const eggData = generateFakeEGG()
      const input = tf.tensor2d([[eggData.alpha, eggData.beta, eggData.gamma]])
      const prediction = modelRef.current.predict(input)
      setFocused(prediction.dataSync()[0] > 0.7)
    }, 1000)

    return () => clearInterval(interval)
  }, [])
  return (
    <div className="neuro-container">
      <div className="dashboard">
        <h2>Focus Level: {focused ? 'Deep Focus' : 'Distracted 😴'} </h2>
        <p>Session Time: {Math.floor(sessionTime)}</p>
      </div>
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Sphere args={[1, 32, 32]} position={[0, 0, 0]}>
          <meshPhongMaterial
            color={focused ? '#00ff88' : '#ff0000'}
            emissive={focused ? '#00ff88' : '#ff0000'}
            emissiveIntensity={0.5}
          />
        </Sphere>
      </Canvas>
    </div>
  )
}

export default App
