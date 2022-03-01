import * as THREE from "three";
import React, { useRef, Suspense, useState } from "react";
import { Canvas, extend, useFrame, useLoader } from "@react-three/fiber";
import { shaderMaterial, Stars, OrbitControls, Sky } from "@react-three/drei";
import glsl from "babel-plugin-glsl/macro";

import "./App.css";
import { PointLight } from "three";

var width = 200;
var height = 200;
var size = width * height;

var data = new Uint8Array(size * 4);

for (var i = 0; i < size; i++) {
  const stride = i * 4;
  data[stride] = 255 * Math.random();
  data[stride + 1] = 255 * Math.random();
  data[stride + 2] = 255 * Math.random();
  data[stride + 3] = 255;
}
var texture = new THREE.DataTexture(data, width, height, THREE.RGBAFormat);
texture.needsUpdate = true;

const geometry = new THREE.PlaneGeometry(400, 400);
const material = new THREE.MeshPhongMaterial({
  map: texture,
  side: THREE.DoubleSide,
}); 
const Wave = (props) => {
  const ref = useRef();
  const [state, setState] = useState(data);
  useFrame(
    ({ clock }) => (
      (ref.current.uTime = clock.getElapsedTime()),
      //  console.log(ref.current.material.map),
      (texture.needsUpdate = true),
      (ref.current.rotation.y = ref.current.rotation.x += 0.0),
      (ref.current.material.map.image.data = animate())
    )
  );

  return (
    <mesh {...props} ref={ref}>
      <planeBufferGeometry args={[40, 40]} />
      <meshPhongMaterial map={texture} color={state} side={THREE.DoubleSide} />
      <ambientLight intensity={0.9}></ambientLight>
    </mesh>
  );
};

const Vehicle = (props) => {
  const mesh = useRef();
  const diffuseColor = new THREE.Color().setHSL(10.5, 11.5, 0.7 * 0.5 + 0.1);
  return (
    <mesh {...props} ref={mesh}>
      <boxBufferGeometry args={[2, 4, 0.1]} />
      <meshPhysicalMaterial
      color={'royalblue'}
       metalness={0.5} 
       roughness={0.5}
       clearcoat={1.0}
        clearcoatRoughness={0.03} sheen={0.5}
      />
      <ambientLight intensity={0.1} />
    </mesh>
  );
};
const Grid = () => {
  const mesh = useRef();
  return (
    <mesh ref={mesh}>
      <gridHelper
        rotation={[-Math.PI * 1.5, 0, 0]}
        args={[40, 12, "rgb(247,39,80)", "white"]}
      />
      <meshLambertMaterial color={"white"} side={THREE.DoubleSide} />
      <ambientLight intensity={0.01}></ambientLight>
    </mesh>
  );
};
const Scene = () => {
  return (
    <Canvas camera={{ position: [0, 0, 40] }}>
      <OrbitControls />
      <Stars />
      <pointLight position={[-10, -10, -10]} />
      <Sky />
      <Suspense fallback={null}>
        <Wave />
        <Grid />
        <Vehicle></Vehicle>
      </Suspense>
    </Canvas>
  );
};
function animate() {
  //requestAnimationFrame( animate );
  for (var i = 0; i < size; i++) {
    const stride = i * 4;
    let randnum = THREE.Math.randInt(0, 220);
    if (randnum % 14) {
      data[stride] = THREE.Math.randInt(0, 220);
      data[stride + 1] = THREE.Math.randInt(255, 220);
      data[stride + 2] = THREE.Math.randInt(0, 176);
      data[stride + 3] = 100;
    } else {
      data[stride] = THREE.Math.randInt(255, 220);
      data[stride + 1] = THREE.Math.randInt(129, 218);
      data[stride + 2] = THREE.Math.randInt(0, 176);
      data[stride + 3] = 100;
    }
  }
  return data;
}
const App = () => {
  return <Scene />;
};
export default App;

/*
const Wave = () =>{
  const ref = useRef();
  console.log(ref);
  useFrame(
    ({clock}) => (ref.current.uTime = clock.getElapsedTime()) 
    )
  return(
     <mesh>
    <planeBufferGeometry args={[10, 10]} />
    <waveShaderMaterial  ref={ref}/>
  </mesh>
  )
}*/
