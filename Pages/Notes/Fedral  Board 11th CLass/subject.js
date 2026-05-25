document.addEventListener('DOMContentLoaded', () => {
    const textElement = document.getElementById('typed-text');

    const words = [
        "Choose Subject & Get Class", 
    ];

    let wordIndex = 0;
    let letterIndex = 0;
    let currentWord = '';
    let isDeleting = false;
    let speed = 100;

    function type() {
        currentWord = words[wordIndex];

        if (isDeleting) {
            textElement.textContent = currentWord.substring(0, letterIndex - 1);
            letterIndex--;
        } else {
            textElement.textContent = currentWord.substring(0, letterIndex + 1);
            letterIndex++;
        }

        if (!isDeleting && letterIndex === currentWord.length) {
            isDeleting = true;
            setTimeout(type, 1000); // pause before deleting
            return;
        } else if (isDeleting && letterIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
        }

        setTimeout(type, isDeleting ? 50 : 100);
    }

    type();
});
