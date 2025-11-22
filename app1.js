
// পাখির এলিমেন্ট তৈরি করা
const bird = document.createElement('div');
bird.innerHTML = '🐦';
bird.style.position = 'fixed';
bird.style.fontSize = '40px';
bird.style.zIndex = '1000';
bird.style.userSelect = 'none';
document.body.appendChild(bird);

// পাখির অবস্থান এবং গতি
let posX = 100;
let posY = 100;
let speedX = 2;
let speedY = 1;
let rotation = 0;

// পাখি উড়ানোর ফাংশন
function flyBird() {
    // স্ক্রিনের সীমানা
    const maxX = window.innerWidth - 50;
    const maxY = window.innerHeight - 50;
    
    // অবস্থান আপডেট
    posX += speedX;
    posY += speedY;
    
    // সীমানা চেক
    if (posX >= maxX || posX <= 0) {
        speedX = -speedX;
        rotation = speedX > 0 ? 0 : 180;
    }
    
    if (posY >= maxY || posY <= 0) {
        speedY = -speedY;
    }
    
    // এলিমেন্ট আপডেট
    bird.style.left = posX + 'px';
    bird.style.top = posY + 'px';
    bird.style.transform = `rotateY(${rotation}deg)`;
    
    // পরবর্তী ফ্রেমের জন্য রিকোয়েস্ট
    requestAnimationFrame(flyBird);
}

// উড়া শুরু করা
flyBird();

// এলোমেলো দিক পরিবর্তনের জন্য
setInterval(() => {
    speedX = (Math.random() - 0.5) * 4;
    speedY = (Math.random() - 0.5) * 4;
}, 2000);

// উইন্ডো রিসাইজ হ্যান্ডলিং
window.addEventListener('resize', () => {
    if (posX > window.innerWidth - 50) posX = window.innerWidth - 50;
    if (posY > window.innerHeight - 50) posY = window.innerHeight - 50;
});
