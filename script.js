const buttonsContainer = document.getElementById('buttons');
const display = document.getElementById('display');
const calcBox = document.getElementById('calculator');
const infoButton = document.getElementById('infoButton');
const infoPopup = document.getElementById('infoPopup');
const closeInfo = document.getElementById('closeInfo');

const values = ['7', '8', '9', '/', '4', '5', '6', '*', '1', '2', '3', '-', '0', '=', '+', 'C'];
const boxWidth = calcBox.clientWidth - 60;
const boxHeight = buttonsContainer.clientHeight - 60;

let buttonClicks = {};
let globalSpeedMultiplier = 1.2;  // Even faster initial movement

// CHAOS: Every 5 seconds, increase global speed
setInterval(() => {
    globalSpeedMultiplier *= 1.1;
    if (globalSpeedMultiplier > 4) globalSpeedMultiplier = 4;  // Limit speed to avoid breaking physics
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

        let speedX = (Math.random() * 3 + 2) * globalSpeedMultiplier; // Increased base speed
        let speedY = (Math.random() * 3 + 2) * globalSpeedMultiplier;

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

        // CHAOS: Hover causes violent deflection and speed boost
        btn.addEventListener('mouseenter', (event) => {
            globalSpeedMultiplier *= 1.2; // Global speed boost

            let rect = btn.getBoundingClientRect();
            let centerX = rect.left + rect.width / 2;
            let centerY = rect.top + rect.height / 2;
            let mouseX = event.clientX;
            let mouseY = event.clientY;

            let angle = Math.atan2(centerY - mouseY, centerX - mouseX);

            btn.style.transform = `rotate(${angle * (180 / Math.PI)}deg) scale(1.5)`;

            speedX += Math.cos(angle) * 4; // Stronger deflection
            speedY += Math.sin(angle) * 4;

            if (Math.random() > 0.5) speedX *= -1; // Random chance to flip direction
            if (Math.random() > 0.5) speedY *= -1;
        });

        // Button click logic
        btn.addEventListener('click', () => {
            buttonClicks[val]++;

            if (buttonClicks[val] === 1) {
                btn.style.background = 'orange';
            } else if (buttonClicks[val] === 2) {
                btn.style.background = 'yellow';
            } else if (buttonClicks[val] === 3) {
                btn.style.background = 'lime';
                speedX *= 0.2;
                speedY *= 0.2;
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

// Info button logic
infoButton.addEventListener('click', () => {
    infoPopup.style.display = infoPopup.style.display === 'block' ? 'none' : 'block';
});

closeInfo.addEventListener('click', () => {
    infoPopup.style.display = 'none';
});

createButtons();
