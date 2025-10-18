import * as pc from 'playcanvas';

export class CustomCameraControls extends pc.Script {

  // static scriptName = 'customCameraControls';

  // Movement speed
  moveSpeed = 5;

  // Rotation speed
  rotateSpeed = 0.2;

  // Current velocity
  velocity = new pc.Vec3();

  // Rotation state
  ex = 0;
  ey = 0;

  // Mouse state
  isRightMouseDown = false;
  lastMouseX = 0;
  lastMouseY = 0;

  // Touch state
  touchCount = 0;
  lastTouchX = 0;
  lastTouchY = 0;
  lastPinchDistance = 0;

  // Zoom speed
  zoomSpeed = 0.01;

  // Key states
  keys: { [key: string]: boolean } = {
    w: false,
    a: false,
    s: false,
    d: false,
    q: false,
    e: false
  };

  initialize() {
    // Get initial rotation
    const eulers = this.entity.getLocalEulerAngles();
    this.ex = eulers.x;
    this.ey = eulers.y;

    // Keyboard event listeners
    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('keyup', this.onKeyUp);

    // Mouse event listeners
    window.addEventListener('mousedown', this.onMouseDown);
    window.addEventListener('mouseup', this.onMouseUp);
    window.addEventListener('mousemove', this.onMouseMove);

    // Touch event listeners
    window.addEventListener('touchstart', this.onTouchStart, { passive: false });
    window.addEventListener('touchmove', this.onTouchMove, { passive: false });
    window.addEventListener('touchend', this.onTouchEnd);
    window.addEventListener('touchcancel', this.onTouchEnd);
  }

  onKeyDown = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key in this.keys) {
      this.keys[key] = true;
    }
  };

  onKeyUp = (event: KeyboardEvent) => {
    const key = event.key.toLowerCase();
    if (key in this.keys) {
      this.keys[key] = false;
    }
  };

  onMouseDown = (event: MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      this.isRightMouseDown = true;
      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  };

  onMouseUp = (event: MouseEvent) => {
    if (event.button === 0) { // Left mouse button
      this.isRightMouseDown = false;
    }
  };

  onMouseMove = (event: MouseEvent) => {
    if (this.isRightMouseDown) {
      const dx = event.clientX - this.lastMouseX;
      const dy = event.clientY - this.lastMouseY;

      this.ey -= dx * this.rotateSpeed;
      this.ex -= dy * this.rotateSpeed;

      // Clamp pitch rotation to prevent flipping
      this.ex = Math.max(-90, Math.min(90, this.ex));

      this.lastMouseX = event.clientX;
      this.lastMouseY = event.clientY;
    }
  };

  onTouchStart = (event: TouchEvent) => {
    event.preventDefault();
    this.touchCount = event.touches.length;

    if (this.touchCount === 1) {
      // Single finger - rotation
      this.lastTouchX = event.touches[0].clientX;
      this.lastTouchY = event.touches[0].clientY;
    } else if (this.touchCount === 2) {
      // Two fingers - pinch zoom
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      this.lastPinchDistance = Math.sqrt(dx * dx + dy * dy);
    }
  };

  onTouchMove = (event: TouchEvent) => {
    event.preventDefault();

    if (event.touches.length === 1 && this.touchCount === 1) {
      // Single finger - rotation
      const touchX = event.touches[0].clientX;
      const touchY = event.touches[0].clientY;

      const dx = touchX - this.lastTouchX;
      const dy = touchY - this.lastTouchY;

      this.ey -= dx * this.rotateSpeed;
      this.ex -= dy * this.rotateSpeed;

      // Clamp pitch rotation to prevent flipping
      this.ex = Math.max(-90, Math.min(90, this.ex));

      this.lastTouchX = touchX;
      this.lastTouchY = touchY;
    } else if (event.touches.length === 2) {
      // Two fingers - pinch to move forward/backward
      const dx = event.touches[0].clientX - event.touches[1].clientX;
      const dy = event.touches[0].clientY - event.touches[1].clientY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (this.lastPinchDistance > 0) {
        const delta = distance - this.lastPinchDistance;
        const forward = this.entity.forward.clone();
        forward.mulScalar(delta * this.zoomSpeed);
        this.entity.translate(forward);
      }

      this.lastPinchDistance = distance;
    }
  };

  onTouchEnd = (event: TouchEvent) => {
    this.touchCount = event.touches.length;

    if (this.touchCount === 0) {
      this.lastPinchDistance = 0;
    } else if (this.touchCount === 1) {
      // Update position for remaining finger
      this.lastTouchX = event.touches[0].clientX;
      this.lastTouchY = event.touches[0].clientY;
      this.lastPinchDistance = 0;
    }
  };

  update(dt: number) {
    // Calculate movement direction based on key states
    const forward = this.entity.forward.clone();
    const right = this.entity.right.clone();
    const up = new pc.Vec3(0, 1, 0);

    // Reset velocity
    this.velocity.set(0, 0, 0);

    // Forward/Backward (W/S)
    if (this.keys.w) {
      this.velocity.add(forward);
    }
    if (this.keys.s) {
      this.velocity.sub(forward);
    }

    // Left/Right (A/D)
    if (this.keys.a) {
      this.velocity.sub(right);
    }
    if (this.keys.d) {
      this.velocity.add(right);
    }

    // Up/Down (E/Q)
    if (this.keys.e) {
      this.velocity.add(up);
    }
    if (this.keys.q) {
      this.velocity.sub(up);
    }

    // Normalize and apply speed
    if (this.velocity.length() > 0) {
      this.velocity.normalize().mulScalar(this.moveSpeed * dt);
      this.entity.translate(this.velocity);
    }

    // Apply rotation
    this.entity.setLocalEulerAngles(this.ex, this.ey, 0);
  }

  destroy() {
    // Clean up event listeners
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('keyup', this.onKeyUp);
    window.removeEventListener('mousedown', this.onMouseDown);
    window.removeEventListener('mouseup', this.onMouseUp);
    window.removeEventListener('mousemove', this.onMouseMove);
    window.removeEventListener('touchstart', this.onTouchStart);
    window.removeEventListener('touchmove', this.onTouchMove);
    window.removeEventListener('touchend', this.onTouchEnd);
    window.removeEventListener('touchcancel', this.onTouchEnd);
  }
}

