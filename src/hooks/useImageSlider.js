import { useEffect, useRef } from 'react';

export function useImageSlider(imageUrls, width, height) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const imageCache = new Array(imageUrls.length).fill(null);
    const loading = new Set();

    let scrollOffset = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartScroll = 0;

    function prepImg(img) {
      const scale = Math.min(width / img.width, height / img.height);
      const drawWidth = img.width * scale;
      const drawHeight = img.height * scale;
      const x = (width - drawWidth) / 2;
      const y = (height - drawHeight) / 2;
      return { img, drawWidth, drawHeight, x, y };
    }

    function loadImage(index) {
      if (index < 0 || index >= imageUrls.length || imageCache[index] || loading.has(index)) {
        return;
      }
      loading.add(index);
      const img = new Image();
      img.onload = () => {
        imageCache[index] = prepImg(img);
        loading.delete(index);
        draw();
      };
      img.src = imageUrls[index];
    }

    function draw() {
      ctx.clearRect(0, 0, width, height);
      const currentIndex = Math.floor(scrollOffset / width);

      // preload one step ahead if user has started dragging past 10%
      const progress = (scrollOffset % width) / width;
      if (progress > 0.1) loadImage(currentIndex + 2);

      [currentIndex, currentIndex + 1].forEach((i) => {
        if (i < 0 || i >= imageUrls.length) return;
        const slideX = i * width - scrollOffset;
        const p = imageCache[i];
        ctx.save();
        ctx.translate(slideX, 0);
        if (p) {
          ctx.drawImage(p.img, p.x, p.y, p.drawWidth, p.drawHeight);
        } else {
          ctx.fillStyle = '#888';
          ctx.fillRect(0, 0, width, height);
          ctx.fillStyle = '#fff';
          ctx.fillText('Loading...', width / 2, height / 2);
        }
        ctx.restore();
      });
    }

    function onPointerDown(e) {
      isDragging = true;
      canvas.style.cursor = 'grabbing';
      dragStartX = e.clientX;
      dragStartScroll = scrollOffset;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const dx = e.clientX - dragStartX;
      scrollOffset = dragStartScroll - dx;
      const maxScroll = (imageUrls.length - 1) * width;
      scrollOffset = Math.max(0, Math.min(scrollOffset, maxScroll));
      draw();
    }

    function onPointerUp() {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    // load first two
    loadImage(0);
    loadImage(1);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [canvasRef, imageUrls, width, height]);

  return canvasRef;
}
