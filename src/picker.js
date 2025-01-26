export function picker(element) {
  if (document.getElementById(`${element.id}-helper`) != null) {
    return;
  }
  const container = document.createElement('div');
  element.parentNode.insertBefore(container, element.nextSibling);
  container.id = `${element.id}-helper`;
  container.setAttribute('_chroma', 'picker');

  container.innerHTML = `
    <div>
      <canvas _chroma="picker:spectrum" width="200" height="200"></canvas>
      <canvas _chroma="picker:hue" width="30" height="200"></canvas>
    </div>
  `;

  const spectrumCanvas = container.querySelector('[_chroma="picker:spectrum"]');
  const hueCanvas = container.querySelector('[_chroma="picker:hue"]');

  let isSpectrumDragging = false;
  let isHueDragging = false;
  let currentHue = { r: 255, g: 0, b: 0 };
  let currentHuePosition = 0;
  let currentX = 0;
  let currentY = 0;

  // Animation variables
  let animationFrame;
  let targetHuePosition = 0;
  let targetX = 0;
  let targetY = 0;
  let lastTimestamp = 0;
  const SPECTRUM_ANIMATION_DURATION = 300; // ms
  const HUE_ANIMATION_DURATION = 600; // ms
  let initialMouseX = 0;
  let initialMouseY = 0;
  let hasMoved = false;

  // Set initial picker position based on input value
  const initialHex = element.value;
  if (initialHex.match(/^#[0-9A-Fa-f]{6}$/)) {
    const r = parseInt(initialHex.substring(1, 3), 16);
    const g = parseInt(initialHex.substring(3, 5), 16);
    const b = parseInt(initialHex.substring(5, 7), 16);

    const { h, s, v } = rgbToHsv(r, g, b);

    // Set positions without animation
    currentHuePosition = h;
    currentX = s;
    currentY = 1 - v;
    targetHuePosition = h;
    targetX = s;
    targetY = 1 - v;

    // Set current hue color
    currentHue = getHueColor(currentHuePosition);
  }
  element.style.setProperty(
    '--chroma-data-computedwidth',
    container.offsetWidth + 'px',
  );

  initializeHueSlider();
  updateSpectrum();

  function initializeHueSlider() {
    const ctx = hueCanvas.getContext('2d');
    ctx.clearRect(0, 0, hueCanvas.width, hueCanvas.height);

    for (let y = 0; y < hueCanvas.height; y++) {
      const hue = y / hueCanvas.height;
      const color = getHueColor(hue);
      ctx.fillStyle = `rgb(${color.r}, ${color.g}, ${color.b})`;
      ctx.fillRect(0, y, hueCanvas.width, 1);
    }
    drawHueStripe();
  }

  function drawHueStripe() {
    const ctx = hueCanvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(
      0,
      currentHuePosition * hueCanvas.height - 1.5,
      hueCanvas.width,
      3,
    );
  }

  function getHueColor(hue) {
    hue *= 6;
    const i = Math.floor(hue);
    const f = hue - i;

    switch (i) {
      case 0:
        return { r: 255, g: Math.round(f * 255), b: 0 };
      case 1:
        return { r: Math.round((1 - f) * 255), g: 255, b: 0 };
      case 2:
        return { r: 0, g: 255, b: Math.round(f * 255) };
      case 3:
        return { r: 0, g: Math.round((1 - f) * 255), b: 255 };
      case 4:
        return { r: Math.round(f * 255), g: 0, b: 255 };
      case 5:
        return { r: 255, g: 0, b: Math.round((1 - f) * 255) };
      default:
        return { r: 255, g: 0, b: 0 };
    }
  }

  function updateSpectrum() {
    const ctx = spectrumCanvas.getContext('2d');
    const width = spectrumCanvas.width;
    const height = spectrumCanvas.height;
    const imageData = ctx.createImageData(width, height);
    const data = imageData.data;

    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const index = (y * width + x) * 4;
        const saturation = x / width;
        const value = 1 - y / height;

        data[index] = Math.round(
          currentHue.r * saturation * value + (1 - saturation) * 255 * value,
        );
        data[index + 1] = Math.round(
          currentHue.g * saturation * value + (1 - saturation) * 255 * value,
        );
        data[index + 2] = Math.round(
          currentHue.b * saturation * value + (1 - saturation) * 255 * value,
        );
        data[index + 3] = 255;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    drawSpectrumDot();
  }

  function drawSpectrumDot() {
    const ctx = spectrumCanvas.getContext('2d');
    const dotX = currentX * spectrumCanvas.width;
    const dotY = currentY * spectrumCanvas.height;
    ctx.beginPath();
    ctx.arc(dotX, dotY, 4, 0, 2 * Math.PI);
    ctx.strokeStyle = currentY > 0.5 ? 'white' : 'black';
    ctx.lineWidth = 2;
    ctx.stroke();
  }

  function animateChange(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const elapsed = timestamp - lastTimestamp;
    const easing = (t) => (t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t); // Smooth easing function

    let spectrumComplete = true;
    let hueComplete = true;

    // Animate spectrum dot position
    if (targetX !== currentX || targetY !== currentY) {
      const progress = Math.min(elapsed / SPECTRUM_ANIMATION_DURATION, 1);
      currentX = currentX + (targetX - currentX) * easing(progress);
      currentY = currentY + (targetY - currentY) * easing(progress);
      spectrumComplete = progress === 1;
    }

    // Animate hue position and update spectrum colors
    if (targetHuePosition !== currentHuePosition) {
      const progress = Math.min(elapsed / HUE_ANIMATION_DURATION, 1);
      currentHuePosition =
        currentHuePosition +
        (targetHuePosition - currentHuePosition) * easing(progress);
      currentHue = getHueColor(currentHuePosition);
      hueComplete = progress === 1;
    }

    // Update visuals
    if (targetHuePosition !== currentHuePosition) {
      initializeHueSlider();
    }
    updateSpectrum();

    if (!spectrumComplete || !hueComplete) {
      animationFrame = requestAnimationFrame(animateChange);
    } else {
      lastTimestamp = 0;
    }
  }

  const cleanup = () => {
    if (animationFrame) {
      cancelAnimationFrame(animationFrame);
    }

    element.style.removeProperty('--chroma-data-computedwidth');

    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
    document.removeEventListener('click', onClick);
    document.removeEventListener('keydown', onKeyDown);
  };

  const onClick = (e) => {
    if (!container.contains(e.target) && e.target !== element) {
      cleanup();
      container.remove();
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      cleanup();
      container.remove();
    }
  };

  const onMouseMove = (e) => {
    // Check if mouse has moved more than 1 pixel in any direction
    if (
      (isSpectrumDragging || isHueDragging) &&
      (Math.abs(e.clientX - initialMouseX) > 1 ||
        Math.abs(e.clientY - initialMouseY) > 1)
    ) {
      hasMoved = true;
    }

    if (isSpectrumDragging) {
      updateSpectrumColor(e, false);
    }
    if (isHueDragging) {
      updateHue(e, false);
    }
  };

  const onMouseUp = (e) => {
    if (isSpectrumDragging) {
      isSpectrumDragging = false;
      updateSpectrumColor(e, !hasMoved); // Only animate if the mouse hasn't moved
    }
    if (isHueDragging) {
      isHueDragging = false;
      updateHue(e, !hasMoved); // Only animate if the mouse hasn't moved
    }
  };

  document.addEventListener('click', onClick);
  document.addEventListener('keydown', onKeyDown);
  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);

  // Convert RGB to HSV
  function rgbToHsv(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;

    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h,
      s,
      v = max;

    const d = max - min;
    s = max === 0 ? 0 : d / max;

    if (max === min) {
      h = 0;
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0);
          break;
        case g:
          h = (b - r) / d + 2;
          break;
        case b:
          h = (r - g) / d + 4;
          break;
      }
      h /= 6;
    }

    return { h, s, v };
  }

  element.addEventListener('input', (e) => {
    if (e.target.value.match(/^#[0-9A-Fa-f]{6}$/)) {
      const hex = e.target.value.substring(1);
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);

      // Update the color preview immediately
      element.previousElementSibling.style.backgroundColor = e.target.value;
      element.style.setProperty('--chroma-data-color', e.target.value);

      // Convert RGB to HSV to get picker positions
      const { h, s, v } = rgbToHsv(r, g, b);

      // Set target positions
      targetHuePosition = h;
      targetX = s;
      targetY = 1 - v;

      // Trigger animation
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      lastTimestamp = 0;
      animationFrame = requestAnimationFrame(animateChange);
    }
  });

  spectrumCanvas.addEventListener('mousedown', (e) => {
    isSpectrumDragging = true;
    hasMoved = false;
    initialMouseX = e.clientX;
    initialMouseY = e.clientY;
  });

  hueCanvas.addEventListener('mousedown', (e) => {
    isHueDragging = true;
    hasMoved = false;
    initialMouseX = e.clientX;
    initialMouseY = e.clientY;
  });

  function updateSpectrumColor(e, animate = true) {
    const rect = spectrumCanvas.getBoundingClientRect();
    const newX = (e.clientX - rect.left) / spectrumCanvas.width;
    const newY = (e.clientY - rect.top) / spectrumCanvas.height;
    targetX = Math.max(0, Math.min(1, newX));
    targetY = Math.max(0, Math.min(1, newY));

    // Update color immediately
    const r = Math.round(
      currentHue.r * targetX * (1 - targetY) +
        (1 - targetX) * 255 * (1 - targetY),
    );
    const g = Math.round(
      currentHue.g * targetX * (1 - targetY) +
        (1 - targetX) * 255 * (1 - targetY),
    );
    const b = Math.round(
      currentHue.b * targetX * (1 - targetY) +
        (1 - targetX) * 255 * (1 - targetY),
    );
    const color =
      '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    element.value = color;
    element.previousElementSibling.style.backgroundColor = color;
    element.style.setProperty('--chroma-data-color', color);

    // Only animate if explicitly requested (which only happens on mouseup without movement)
    if (animate) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      lastTimestamp = 0;
      animationFrame = requestAnimationFrame(animateChange);
    } else {
      currentX = targetX;
      currentY = targetY;
      updateSpectrum();
    }
  }

  function updateHue(e, animate = true) {
    const rect = hueCanvas.getBoundingClientRect();
    const y = (e.clientY - rect.top) / hueCanvas.height;
    targetHuePosition = Math.max(0, Math.min(1, y));

    // Update color immediately
    const tempHue = getHueColor(targetHuePosition);
    const r = Math.round(
      tempHue.r * currentX * (1 - currentY) +
        (1 - currentX) * 255 * (1 - currentY),
    );
    const g = Math.round(
      tempHue.g * currentX * (1 - currentY) +
        (1 - currentX) * 255 * (1 - currentY),
    );
    const b = Math.round(
      tempHue.b * currentX * (1 - currentY) +
        (1 - currentX) * 255 * (1 - currentY),
    );
    const color =
      '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    element.value = color;
    element.previousElementSibling.style.backgroundColor = color;
    element.style.setProperty('--chroma-data-color', color);

    // Only animate if explicitly requested (which only happens on mouseup without movement)
    if (animate) {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
      lastTimestamp = 0;
      animationFrame = requestAnimationFrame(animateChange);
    } else {
      currentHuePosition = targetHuePosition;
      currentHue = tempHue;
      initializeHueSlider();
      updateSpectrum();
    }
  }

  function updateColor() {
    const r = Math.round(
      currentHue.r * currentX * (1 - currentY) +
        (1 - currentX) * 255 * (1 - currentY),
    );
    const g = Math.round(
      currentHue.g * currentX * (1 - currentY) +
        (1 - currentX) * 255 * (1 - currentY),
    );
    const b = Math.round(
      currentHue.b * currentX * (1 - currentY) +
        (1 - currentX) * 255 * (1 - currentY),
    );

    const color =
      '#' + [r, g, b].map((x) => x.toString(16).padStart(2, '0')).join('');
    element.value = color;
    element.previousElementSibling.style.backgroundColor = color;
    element.style.setProperty('--chroma-data-color', color);
  }
}
