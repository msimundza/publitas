import { useImageSlider } from './hooks/useImageSlider';
import './App.css';

const images = ['0.jpg', '1.jpg', '2.jpg', '3.jpg', '4.jpg'];

function App() {
  const canvasRef = useImageSlider(images, 640, 400);

  return (
    <figure>
      <canvas ref={canvasRef} width={640} height={400} style={{ cursor: 'grab' }} aria-label="Image slider" />
      <figcaption className="caption">Drag and voilà!</figcaption>
    </figure>
  );
}

export default App;
