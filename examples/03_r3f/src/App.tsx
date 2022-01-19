import React, { useState, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { atom, useAtom } from 'jotai';
import { useUpdateAtom } from 'jotai/utils';
import { useTransientAtom } from 'jotai-game';

type Box = {
  id: number;
  position: [number, number];
};

const mainBoxes: Box[] = Array.from(Array(900).keys()).map((i) => ({
  id: i,
  position: [6 * Math.random() - 3, 6 * Math.random() - 3],
}));

const offsetAtom = atom([0, 0]);

const NormalBox = ({ box }: { box: Box }) => {
  const { position } = box;
  const [offset] = useAtom(offsetAtom);
  const mesh = useRef<any>();
  useFrame(() => {
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });
  return (
    <mesh
      position={[position[0] + offset[0], position[1] + offset[1], 0]}
      ref={mesh}
    >
      <boxBufferGeometry attach="geometry" args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial attach="material" color="darkblue" />
    </mesh>
  );
};

const TransientBox = ({ box }: { box: Box }) => {
  const { position } = box;
  const [getOffset] = useTransientAtom(offsetAtom);
  const mesh = useRef<any>();
  useFrame(() => {
    const offset = getOffset();
    mesh.current.position.x = position[0] + offset[0];
    mesh.current.position.y = position[1] + offset[1];
    mesh.current.rotation.x += 0.01;
    mesh.current.rotation.y += 0.01;
  });
  return (
    <mesh position={[position[0], position[1], 0]} ref={mesh}>
      <boxBufferGeometry attach="geometry" args={[0.2, 0.2, 0.2]} />
      <meshStandardMaterial attach="material" color="darkblue" />
    </mesh>
  );
};

const Main = ({
  mode,
  boxes,
}: {
  mode: 'normal' | 'transient';
  boxes: Box[];
}) => {
  const setOffset = useUpdateAtom(offsetAtom);
  useFrame(({ mouse }) => {
    setOffset([mouse.x * 6, mouse.y * 2]);
  });
  return (
    <>
      <ambientLight intensity={0.8} />
      <pointLight position={[100, 100, 100]} intensity={0.7} />
      {boxes.map((box) =>
        mode === 'normal' ? (
          <NormalBox key={box.id} box={box} />
        ) : (
          <TransientBox key={box.id} box={box} />
        ),
      )}
    </>
  );
};

const App = () => {
  const [mode, setMode] = useState<'normal' | 'transient'>('normal');
  return (
    <div>
      <div style={{ marginLeft: 90 }}>
        <button
          type="button"
          onClick={() => setMode(mode === 'normal' ? 'transient' : 'normal')}
        >
          {mode}
        </button>
      </div>
      <Canvas>
        <Main mode={mode} boxes={mainBoxes} />
      </Canvas>
    </div>
  );
};

export default App;
