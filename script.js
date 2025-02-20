let globalSpeedMultiplier = 1.05;  // Reduced initial speed boost

// CHAOS: Every 5 seconds, increase global speed (slower growth)
setInterval(() => {
    globalSpeedMultiplier *= 1.05; // Slower increase over time
    if (globalSpeedMultiplier > 3) globalSpeedMultiplier = 3;  // Lower max speed cap
}, 5000);

// Function to create buttons
function createButtons() {
    buttonsContainer.innerHTML = '';

    values.forEach(val => {
        let btn = document.createElement('button');
        btn.innerText = val;
        let position = { x: Math.random() * boxWidth, y: Math.random() * boxHeight };
        btn.style.top = `${position.y}px`;
        btn.style.left = `${position.x}px`;

        let speedX = (Math.random() * 2 + 1.5) * globalSpeedMultiplier; // Slower base speed
        let speedY = (Math.random() * 2 + 1.5) * globalSpeedMultiplier;

        buttonClicks[val] = 0;

        function moveButton() {
            let x = parseFloat(btn.style.left);
            let y = parseFloat(btn.style.top);

            if (x + 50 > boxWidth || x < 0) speedX = -speedX;
            if (y + 50 > boxHeight || y < 0) speedY = -speedY;

            btn.style.left = `${x + speedX}px`;
            btn.style.top = `${y + speedY}px`;

            requestAnimationFrame(moveButton);
        }
        moveButton();

        // Adjust hover effect to be less aggressive
        btn.addEventListener('mouseenter', (event) => {
            globalSpeedMultiplier *= 1.1; // Slower boost

            let rect = btn.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;
            let mouseX = event.clientX;
            let mouseY = event.clientY;

            let angle = Math.atan2(centerY - mouseY, centerX - mouseX);

            btn.style.transform = `rotate(${angle * (180 / Math.PI)}deg) scale(1.3)`;

            speedX += Math.cos(angle) * 2.5; // Weaker deflection
            speedY += Math.sin(angle) * 2.5;

            if (Math.random() > 0.5) speedX *= -1;
            if (Math.random() > 0.5) speedY *= -1;
        });

        // Adjust button slowdown on click
        btn.addEventListener('click', () => {
            buttonClicks[val]++;

            if (buttonClicks[val] === 1) {
                btn.style.background = 'orange';
            } else if (buttonClicks[val] === 2) {
                btn.style.background = 'yellow';
            } else if (buttonClicks[val] === 3) {
                btn.style.background = 'lime';
                speedX *= 0.3; // Slower speed drop
                speedY *= 0.3;
            }

            if (buttonClicks[val] >= 3) {
                if (val === 'C') {
                    display.value = '';
                } else if (val === '=') {
                    try {
                        display.value = eval(display.value);
                    } catch {
                        display.value = 'Error';
                    }
                } else {
                    display.value += val;
                }
            }
        });

        buttonsContainer.appendChild(btn);
    });
}

createButtons();
