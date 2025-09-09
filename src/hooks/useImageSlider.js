import { useRef, useEffect } from 'react';

export const useImageSlider = (images, width, height) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');
    const imageCache = new Array(images.length).fill(null);
    const loading = new Set();
    const failed = new Set();

    let scrollOffset = 0;
    let isDragging = false;
    let dragStartX = 0;
    let dragStartOffset = 0;
    let animationFrameId = null;

    function getPreparedImage(img) {
      const canvasRatio = width / height;
      const imageRatio = img.width / img.height;
      let newWidth, newHeight;

      if (imageRatio > canvasRatio) {
        newWidth = width;
        newHeight = width / imageRatio;
      } else {
        newHeight = height;
        newWidth = height * imageRatio;
      }

      const x = (width - newWidth) / 2;
      const y = (height - newHeight) / 2;

      return { img, x, y, newWidth, newHeight };
    }

    function loadImage(index) {
      if (index < 0 || index >= images.length || imageCache[index] || loading.has(index) || failed.has(index)) return;
      const img = new Image();

      if (/^https?:\/\//.test(images[index])) {
        img.crossOrigin = 'anonymous';
      }

      loading.add(index);
      img.onload = () => {
        console.log('Image loaded:', images[index]);
        imageCache[index] = getPreparedImage(img);
        loading.delete(index);
        draw();
      };
      img.onerror = () => {
        console.error('Failed to load image:', images[index]);
        failed.add(index);
        loading.delete(index);
      };
      img.src = images[index];
    }

    function draw() {
      context.clearRect(0, 0, width, height);
      const currentIndex = Math.floor(scrollOffset / width);

      // preload one step ahead if user has started dragging past 10%
      const progress = (scrollOffset % width) / width;
      if (progress > 0.1) loadImage(currentIndex + 2);

      [currentIndex, currentIndex + 1].forEach((i) => {
        if (i < 0 || i >= images.length) return;
        const slideX = i * width - scrollOffset;
        const p = imageCache[i];
        context.save();
        context.translate(slideX, 0);
        if (p) {
          context.drawImage(p.img, p.x, p.y, p.newWidth, p.newHeight);
        } else if (failed.has(i)) {
          context.fillStyle = '#f00';
          context.fillRect(0, 0, width, height);
          context.fillStyle = '#fff';
          context.fillText('Failed to load', width / 2, height / 2);
        } else {
          context.fillStyle = '#888';
          context.fillRect(0, 0, width, height);
          context.fillStyle = '#fff';
          context.fillText('Loading...', width / 2, height / 2);
        }
        context.restore();
      });
    }

    function onPointerDown(e) {
      isDragging = true;
      canvas.style.cursor = 'grabbing';
      dragStartX = e.clientX;
      dragStartOffset = scrollOffset;
    }

    function onPointerMove(e) {
      if (!isDragging) return;
      const deltaX = e.clientX - dragStartX;
      scrollOffset = dragStartOffset - deltaX;

      // ensure we r within bounds
      const maxScroll = (images.length - 1) * width;
      if (scrollOffset < 0) scrollOffset = 0;
      if (scrollOffset > maxScroll) scrollOffset = maxScroll;

      if (!animationFrameId) {
        animationFrameId = window.requestAnimationFrame(() => {
          draw();
          animationFrameId = null;
        });
      }
    }

    function onPointerUp() {
      isDragging = false;
      canvas.style.cursor = 'grab';
    }

    loadImage(0);
    loadImage(1);

    canvas.addEventListener('pointerdown', onPointerDown);
    window.addEventListener('pointermove', onPointerMove);
    window.addEventListener('pointerup', onPointerUp);

    return () => {
      canvas.removeEventListener('pointerdown', onPointerDown);
      window.removeEventListener('pointermove', onPointerMove);
      window.removeEventListener('pointerup', onPointerUp);
    };
  }, [images, width, height]);

  return { canvasRef };
};
