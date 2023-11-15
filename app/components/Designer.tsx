import React, { useRef, useState } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useGLTF, useTexture, Decal } from '@react-three/drei';
import { Layout, Select, Button } from '@shopify/polaris';
import { easing } from 'maath';
import { useSnapshot } from 'valtio';
import { state } from '~/store';

interface DesignerProps {
  position?: number[];
  fov?: number;
}

export const Designer: React.FC<DesignerProps> = ({ position = [0, 0, 2.5], fov = 20 }) => {
  const [selectedColor, setSelectedColor] = useState<string>('white'); // Initial color
  const [selectedLogo, setSelectedLogo] = useState<string>('react'); // Initial Logo

  const handleColorChange = (value: string) => {
    setSelectedColor(value);
  };

  const handleLogoChange = (value: string) => {
    setSelectedLogo(value);
  };

  const handleDownload = () => {
    const link = document.createElement('a');
    link.setAttribute('download', 'canvas.png');
    link.setAttribute('href', document.querySelector('canvas')!.toDataURL('image/png').replace('image/png', 'image/octet-stream'));
    link.click();
  };

  return (
    <Layout>
      <Layout.Section>
        <Select
          label="T-shirt Color"
          options={[
            { label: 'White', value: 'white' },
            { label: 'Black', value: 'black' },
            { label: 'Pink', value: 'red' },
            { label: 'Green', value: 'green' },
            { label: 'Brand', value: 'blue' },
          ]}
          value={selectedColor}
          onChange={handleColorChange}
        />
      </Layout.Section>
      <Layout.Section>
        <Select
          label="T-shirt Logo"
          options={[
            { label: 'React JS', value: 'react' },
            { label: 'Google', value: 'google' },
            { label: 'Facebook', value: 'facebook' },
          ]}
          value={selectedLogo}
          onChange={handleLogoChange}
        />
      </Layout.Section>
      <Layout.Section>
        {/*@ts-ignore*/}
        <Canvas shadows camera={{ position, fov }} gl={{ preserveDrawingBuffer: true }} style={{ background: 'white', height: '600px' }}>
          <CameraRig>
            <Shirt color={selectedColor} logo={selectedLogo} />
          </CameraRig>
        </Canvas>
      </Layout.Section>
      <Layout.Section>
        <Button onClick={handleDownload}>Download Image</Button>
      </Layout.Section>
    </Layout>
  );
};

interface CameraRigProps {
  children: React.ReactNode;
}

function CameraRig({ children }: CameraRigProps) {
  const group = useRef<any>();
  const snap = useSnapshot(state);
  useFrame((state, delta) => {
    easing.damp3(state.camera.position, [snap.intro ? -state.viewport.width / 50 : 0, 0, 3], 0.25, delta);
    easing.dampE(group.current.rotation, [state.pointer.y / 10, -state.pointer.x / 5, 0], 0.25, delta);
  });
  return <group ref={group}>{children}</group>;
}

interface ShirtProps {
  color?: string;
  logo?: string;
}

function Shirt({ color = 'red', logo = 'react', ...props }: ShirtProps) {
  const { nodes, materials } = useGLTF('./shirt_baked_collapsed.glb');
  const texture = useTexture('./' + logo + '.png');
  const colorPicker = {
    white: { r: 1, g: 1, b: 1, isColor: true },
    black: { r: 0, g: 0, b: 0, isColor: true },
    red: { r: 1, g: 0, b: 0.5, isColor: true },
    green: { r: 0, g: 1, b: 0, isColor: true },
    blue: { r: 0, g: 1, b: 1, isColor: true },
  };

  // @ts-ignore
  materials.lambert1.emissive.set(colorPicker[color]);
  return (
    <mesh
      castShadow
      geometry={nodes.T_Shirt_male.geometry}
      material={materials.lambert1}
      material-roughness={1}
      {...props}
      dispose={null}
    >
      <Decal position={[0, 0.04, 0.15]} rotation={[0, 0, 0]} scale={0.15} map={texture} />
    </mesh>
  );
}
