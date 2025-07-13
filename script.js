document.addEventListener('DOMContentLoaded', function() {
    const slider = document.getElementById('slider');
    const image2 = document.querySelector('.image-2');
    const sliderLine = document.querySelector('.slider-line');
    const imageContainer = document.querySelector('.image-container');

    function updateComparison(percentage) {
        // Constrain percentage to 0-100 range
        const clampedPercentage = Math.max(0, Math.min(100, percentage));
        
        // Calculate the clip-path percentage based on the grabber center position
        const grabberWidth = 20; // Width of the grabber
        const containerWidth = imageContainer.offsetWidth;
        const availableWidth = containerWidth - grabberWidth;
        
        let clipPercentage;
        if (clampedPercentage <= 0) {
            clipPercentage = 0;
        } else if (clampedPercentage >= 100) {
            clipPercentage = 100;
        } else {
            // Calculate clip percentage based on grabber center position
            const grabberCenter = grabberWidth / 2;
            const linePosition = grabberCenter + (availableWidth * clampedPercentage / 100);
            clipPercentage = (linePosition / containerWidth) * 100;
        }
        
        image2.style.clipPath = `polygon(${clipPercentage}% 0, 100% 0, 100% 100%, ${clipPercentage}% 100%)`;
        
        // Position the line at the center of the grabber (which is 20px wide)
        // When at 0%, the line should be at 10px from left edge
        // When at 100%, the line should be at (container width - 10px) from left edge
        let linePosition;
        if (clampedPercentage <= 0) {
            linePosition = grabberWidth / 2;
        } else if (clampedPercentage >= 100) {
            linePosition = containerWidth - (grabberWidth / 2);
        } else {
            // Calculate position based on percentage, accounting for grabber width
            linePosition = (grabberWidth / 2) + (availableWidth * clampedPercentage / 100);
        }
        
        sliderLine.style.left = `${linePosition}px`;
        slider.value = clampedPercentage;
    }

    slider.addEventListener('input', function() {
        updateComparison(parseFloat(this.value));
    });

    let isDragging = false;

    function handleDrag(e) {
        if (!isDragging) return;
        e.preventDefault();
        const rect = imageContainer.getBoundingClientRect();
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        
        // Constrain x position to image boundaries
        const constrainedX = Math.max(rect.left, Math.min(rect.right, x));
        const percentage = ((constrainedX - rect.left) / rect.width) * 100;
        
        updateComparison(percentage);
    }

    function startDrag(e) {
        const rect = imageContainer.getBoundingClientRect();
        const x = e.type.includes('touch') ? e.touches[0].clientX : e.clientX;
        const y = e.type.includes('touch') ? e.touches[0].clientY : e.clientY;
        
        // Only start dragging if click is within the image bounds
        if (x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom) {
            isDragging = true;
            e.preventDefault();
        }
    }

    function stopDrag() {
        isDragging = false;
    }

    imageContainer.addEventListener('mousedown', startDrag);
    document.addEventListener('mousemove', handleDrag);
    document.addEventListener('mouseup', stopDrag);
    imageContainer.addEventListener('touchstart', startDrag);
    document.addEventListener('touchmove', handleDrag);
    document.addEventListener('touchend', stopDrag);

    // Initialize
    updateComparison(50);
    
    // Force a recalculation after a short delay to ensure proper alignment
    setTimeout(() => {
        updateComparison(parseFloat(slider.value));
    }, 100);
}); 