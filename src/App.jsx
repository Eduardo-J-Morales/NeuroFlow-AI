import { useState, useEffect, useRef } from 'react'
import * as tf from '@tensorflow/tfjs'
import { Canvas } from '@react-three/fiber'
import { Sphere, OrbitControls } from '@react-three/drei'
import { positionGeometry } from 'three/tsl'

const generateFakeEGG = () => ({
  alpha: Math.random() * 10 + (focused ? 15 : 5),
  beta: Math.random() * 5,
  gamma: Math.random() * 3
})

async function loadModel() {
  const model = await tf.loadLayersModel('/focus_model/model.json')
  return model
}

function App() {
  const [focused, setFocused] = useState(false)
  const [sessionTime, setSessionTime] = useState(0)
  const modelRef = useRef(null)
  const animationRef = useRef()

  useEffect(() => {
    console.log('happening')
    loadModel().then(model => {
      modelRef.current = model
    })
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
