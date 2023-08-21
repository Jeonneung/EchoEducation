const uploadForm = document.getElementById('uploadForm');
const photoInput = document.getElementById('photoInput');
const uploadedImageContainer = document.getElementById('uploadedImageContainer');
const uploadedImage = document.getElementById('uploadedImage');

uploadForm.addEventListener('submit', async (event) => {
event.preventDefault();

const formData = new FormData();
formData.append('photo', photoInput.files[0]);

try {
    const response = await fetch('/upload', {
    method: 'POST',
    body: formData
    });

    if (response.ok) {
    const imagePath = await response.text();
    uploadedImage.src = imagePath;
    uploadedImageContainer.style.display = 'block';
    } else {
    console.error('Upload failed');
    }
} catch (error) {
    console.error('Error uploading image:', error);
}
});
