// Mobile Navbar Toggle
let menuIcon = document.querySelector('#menu-icon');
let navbar = document.querySelector('.navbar');

menuIcon.onclick = () => {
    menuIcon.classList.toggle('bx-x');
    navbar.classList.toggle('active');
};

// Dropdown Details Toggle
const detailHeaders = document.querySelectorAll('.project-header');

detailHeaders.forEach(header => {
    header.addEventListener('click', () => {
        const projectItem = header.closest('.project-item');
        const details = projectItem.querySelector('.project-details');
        const button = projectItem.querySelector('.details-btn');
        
        details.classList.toggle('show');

        // Change button text
        if (details.classList.contains('show')) {
            button.textContent = 'Hide Details';
        } else {
            button.textContent = 'Show Details';
        }
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const interactiveLabels = document.querySelectorAll('#interactive-labels a');

    interactiveLabels.forEach(label => {
        label.addEventListener('click', (event) => {
            // 1. Prevent the default instant jump
            event.preventDefault(); 

            // 2. Get the ID of the target section (e.g., '#rect-annotation')
            const targetId = label.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // 3. Smoothly scroll the target container into the middle of the view
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center' 
                });

                // 4. Add the .glow-effect class to trigger the animation
                targetElement.classList.add('glow-effect');

                // 5. Remove the class after 3 seconds so it can be triggered again
                setTimeout(() => {
                    targetElement.classList.remove('glow-effect');
                }, 3000); // 3000 milliseconds = 3 seconds
            }
        });
    });
});