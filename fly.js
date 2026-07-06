// fly.js - JavaScript module for fly behavior

// Set movement speed
let speed = 5;

// Create the fly and add behavior
export function initFly() {
  // Some Dynamic CSS
  const style = document.createElement('style');
  style.textContent = `
    #fly {
      position: absolute;
      transform: rotate(90deg);
      transition: left 0.01s linear, top 0.01s linear;
      background-color: rgba(0, 0, 0, 0);
    }
  `;
  document.head.appendChild(style);

  // Create the fly element
  const fly = document.createElement('div');
  fly.innerHTML = '\u{1FAB0}'; // 🪰 fly emoji
  fly.id = 'fly';
  document.body.appendChild(fly);

  // Helper functions
  function getX() {
    return parseFloat(window.getComputedStyle(fly).left || 0);
  }
  function getY() {
    return parseFloat(window.getComputedStyle(fly).top || 0);
  }
  function changeX(amount) {
    fly.style.left = (getX() + amount) + 'px';
  }
  function changeY(amount) {
    fly.style.top = (getY() + amount) + 'px';
  }

  // Movement functions
  function goLeft() {
    fly.style.rotate = '180deg';
    changeX(-speed);
  }
  function goRight() {
    fly.style.rotate = '0deg';
    changeX(speed);
  }
  function goUp() {
    fly.style.rotate = '270deg';
    changeY(-speed);
  }
  function goDown() {
    fly.style.rotate = '90deg';
    changeY(speed);
  }

  // Element bounds
  function getElementBounds(el) {
    const rect = el.getBoundingClientRect();
    const flyWidth = fly.offsetWidth;
    const flyHeight = fly.offsetHeight;

    return {
      left: rect.left + window.scrollX - flyWidth / 2,
      top: rect.top + window.scrollY - flyHeight / 2,
      right: rect.left + window.scrollX + rect.width - flyWidth / 2,
      bottom: rect.top + window.scrollY + rect.height - flyHeight / 2
    };
  }

  // Perimeter walking
  function walkPerimeter(bounds) {
    const buffer = Math.abs(speed) * 2;
    let x = getX();
    let y = getY();

    if (x <= bounds.left + buffer && y < bounds.bottom - buffer) {
      goDown();
    } else if (y >= bounds.bottom - buffer && x < bounds.right - buffer) {
      goRight();
    } else if (x >= bounds.right - buffer && y > bounds.top + buffer) {
      goUp();
    } else if (y <= bounds.top + buffer && x > bounds.left + buffer) {
      goLeft();
    }
  }

  // Target movement
  function walkToTarget(xTarget, yTarget) {
    const x = getX();
    const y = getY();
    const dx = xTarget - x;
    const dy = yTarget - y;

    if (Math.abs(dx) > Math.abs(speed)) {
      dx > 0 ? goRight() : goLeft();
    } else if (Math.abs(dy) > Math.abs(speed)) {
      dy > 0 ? goDown() : goUp();
    }

    return Math.abs(dx) <= speed && Math.abs(dy) <= speed;
  }

  // Movement intervals
  let walkingInterval;
  let perimeterInterval;

  // Add click listener to move fly
  document.addEventListener('click', function (event) {
    clearInterval(walkingInterval);
    clearInterval(perimeterInterval);

    const targetBounds = getElementBounds(event.target);
    const startX = targetBounds.left;
    const startY = targetBounds.top;

    walkingInterval = setInterval(() => {
      const arrived = walkToTarget(startX, startY);
      if (arrived) {
        clearInterval(walkingInterval);
        perimeterInterval = setInterval(() => {
          walkPerimeter(targetBounds);
        }, 8);
      }
    }, 8);
  });
}
