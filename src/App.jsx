import { useImageSlider } from './hooks/useImageSlider';
import './App.css';

const images = [
  'https://picsum.photos/id/1015/600/800',
  'https://picsum.photos/id/1016/300/400',
  'https://picsum.photos/id/1016/1000/500',
  'https://picsum.photos/id/1016/500/10000', // intentionally wrong URL to test error handling
  '0.jpg',
  '1.jpg',
  '2.jpg',
  '3.jpg',
];
function App() {
  const { canvasRef } = useImageSlider(images, 640, 400);
  return (
    <>
      <canvas ref={canvasRef} height={400} width={640}>
        Image slider
      </canvas>
    </>
  );
}

export default App;
