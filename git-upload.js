// GitHub API configuration
const GITHUB_TOKEN = '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'; // Replace with your token
const REPO_OWNER = 'asikurbd';
const REPO_NAME = 'Image-Upload';
const BRANCH = 'main';

// Global variables
let imageFiles = [];
let currentIndex = 0;

// Progress bar functions
function updateProgress(percentage, message = '') {
  const progress = document.getElementById('progress');
  const progressText = document.getElementById('progressText');
  const progressContainer = document.getElementById('progressContainer');
  
  progress.style.width = `${percentage}%`;
  progressText.textContent = message || `${percentage}%`;
  
  if (percentage > 0 && progressContainer.style.display === 'none') {
    progressContainer.style.display = 'block';
  }
  
  if (percentage === 100) {
    setTimeout(() => {
      progressContainer.style.display = 'none';
    }, 2000);
  }
}

// Upload file to GitHub
async function uploadFileToGitHub(file, filename, totalFiles, currentIndex) {
  const statusElement = document.getElementById('uploadStatus');
  
  try {
    updateProgress(0, `Processing ${currentIndex + 1}/${totalFiles}: ${filename}`);
    
    // Read file content
    const reader = new FileReader();
    const fileContent = await new Promise((resolve) => {
      reader.onload = (e) => {
        updateProgress(30, `Uploading ${currentIndex + 1}/${totalFiles}: ${filename}`);
        resolve(e.target.result.split(',')[1]);
      };
      reader.readAsDataURL(file);
    });

    // API request
    const apiUrl = `https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/${filename}`;
    const requestBody = {
      message: `Upload ${filename}`,
      content: fileContent,
      branch: BRANCH
    };

    const response = await fetch(apiUrl, {
      method: 'PUT',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Content-Type': 'application/json',
        'Accept': 'application/vnd.github.v3+json'
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Upload failed');
    }

    updateProgress(100, `Uploaded ${currentIndex + 1}/${totalFiles}: ${filename}`);
    return data;
  } catch (error) {
    statusElement.innerHTML += `<br>Error uploading ${filename}: ${error.message}`;
    throw error;
  }
}

// Handle file uploads
async function handleFileUpload(event) {
  const files = event.target.files;
  if (files.length === 0) return;
  
  const statusElement = document.getElementById('uploadStatus');
  statusElement.innerHTML = `Starting upload of ${files.length} image(s)...`;
  updateProgress(0);
  
  try {
    const totalFiles = files.length;
    let uploadSuccess = true;
    
    for (let i = 0; i < totalFiles; i++) {
      const file = files[i];
      if (!file.type.match('image.*')) continue;
      
      const timestamp = new Date().getTime();
      const filename = `image_${timestamp}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
      
      updateProgress((i / totalFiles) * 100, `Preparing ${i + 1}/${totalFiles}`);
      try {
        await uploadFileToGitHub(file, filename, totalFiles, i);
        await new Promise(resolve => setTimeout(resolve, 500)); // Rate limit delay
      } catch (error) {
        uploadSuccess = false;
        console.error(`Error uploading ${filename}:`, error);
      }
    }
    
    if (uploadSuccess) {
      statusElement.innerHTML = 'Upload complete! Refreshing page...';
      updateProgress(100, 'All uploads completed!');
      
      // Force a hard refresh to ensure latest images are loaded
      setTimeout(() => {
        window.location.href = window.location.href;
      }, 1500);
    } else {
      statusElement.innerHTML = 'Some uploads failed. Page will not refresh automatically.';
      updateProgress(0);
    }
  } catch (error) {
    statusElement.innerHTML = 'Upload failed: ' + error.message;
    updateProgress(0);
  }
}

// Load gallery from GitHub
async function loadGallery() {
  const gallery = document.getElementById('gallery');
  gallery.innerHTML = '<p>Loading images...</p>';
  
  try {
    const response = await fetch(`https://api.github.com/repos/${REPO_OWNER}/${REPO_NAME}/contents/`);
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.message || 'Failed to load images');
    }
    
    // Filter and sort images by date (newest first)
    imageFiles = data
      .filter(file => file.name.match(/\.(jpg|jpeg|png|gif|webp)$/i))
      .sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));
    
    if (imageFiles.length === 0) {
      gallery.innerHTML = '<p>No images found in the repository.</p>';
      return;
    }
    
    // Clear and rebuild gallery
    gallery.innerHTML = '';
    
    imageFiles.forEach((file, index) => {
      const item = document.createElement('div');
      item.className = 'gallery-item';
      
      const img = document.createElement('img');
      img.src = file.download_url;
      img.alt = file.name;
      img.loading = "lazy";
      
      img.onclick = function() {
        currentIndex = index;
        openModal();
      }
      
      item.appendChild(img);
      gallery.appendChild(item);
    });
    
    document.getElementById('uploadStatus').innerHTML = '';
  } catch (error) {
    gallery.innerHTML = `<p>Error loading images: ${error.message}</p>`;
  }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('fileInput').addEventListener('change', handleFileUpload);
  loadGallery();
});

// Modal functions
function openModal() {
  const modal = document.getElementById('modal');
  const modalImg = document.getElementById('modal-image');
  const caption = document.getElementById('caption');
  
  modal.style.display = "block";
  modalImg.src = imageFiles[currentIndex].download_url;
  caption.textContent = imageFiles[currentIndex].name;
  document.body.style.overflow = "hidden";
}

function navigate(direction) {
  currentIndex += direction;
  if (currentIndex >= imageFiles.length) {
    currentIndex = 0;
  } else if (currentIndex < 0) {
    currentIndex = imageFiles.length - 1;
  }
  
  const modalImg = document.getElementById('modal-image');
  const caption = document.getElementById('caption');
  modalImg.src = imageFiles[currentIndex].download_url;
  caption.textContent = imageFiles[currentIndex].name;
}

// Event listeners for modal
document.getElementsByClassName('close')[0].onclick = function() {
  document.getElementById('modal').style.display = "none";
  document.body.style.overflow = "auto";
};

document.getElementById('modal').onclick = function(event) {
  if (event.target === this) {
    this.style.display = "none";
    document.body.style.overflow = "auto";
  }
};

document.getElementsByClassName('prev')[0].onclick = function(e) {
  e.stopPropagation();
  navigate(-1);
};

document.getElementsByClassName('next')[0].onclick = function(e) {
  e.stopPropagation();
  navigate(1);
};

// Touch events for mobile swipe navigation
let touchStartX = 0;
let touchEndX = 0;

document.getElementById('modal').addEventListener('touchstart', function(e) {
  touchStartX = e.changedTouches[0].screenX;
}, false);

document.getElementById('modal').addEventListener('touchend', function(e) {
  touchEndX = e.changedTouches[0].screenX;
  if (touchEndX < touchStartX - 50) navigate(1);
  if (touchEndX > touchStartX + 50) navigate(-1);
}, false);

// Keyboard navigation
document.addEventListener('keydown', function(e) {
  if (document.getElementById('modal').style.display === "block") {
    if (e.key === 'ArrowLeft') navigate(-1);
    else if (e.key === 'ArrowRight') navigate(1);
    else if (e.key === 'Escape') {
      document.getElementById('modal').style.display = "none";
      document.body.style.overflow = "auto";
    }
  }
});

// Path input functionality
function goToUrl() {
  const userPath = document.getElementById('pathInput').value.trim();
  const fullUrl = `https://github.com/Asikurbd/Image-Upload/delete/main/${userPath}`;
  
  if (userPath) {
    window.open(fullUrl, '_blank');
  } else {
    alert('Please enter a file path');
  }
}

document.getElementById('pathInput').addEventListener('keypress', function(e) {
  if (e.key === 'Enter') goToUrl();
});
