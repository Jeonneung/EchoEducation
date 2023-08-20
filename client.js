const video = document.getElementById('video');
const captureButton = document.getElementById('captureButton');
const canvas = document.getElementById('canvas');
const uploadForm = document.getElementById('uploadForm');
const chooseButton = document.getElementById('chooseButton');

// Access user's webcam
navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
    video.srcObject = stream;
    })
    .catch((error) => {
    console.error('Error accessing webcam:', error);
});

// Capture photo from webcam
captureButton.addEventListener('click', () => {
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0, canvas.width, canvas.height);

    canvas.toBlob((blob) => {
    // Show the captured photo on the form
    const img = document.createElement('img');
    img.src = URL.createObjectURL(blob);
    uploadForm.appendChild(img);

    // Append the blob to the form's FormData
    const formData = new FormData(uploadForm);
    formData.append('photo', blob, 'photo.jpg');

    // Submit the form to upload the photo
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then((response) => response.text())
    .then((result) => {
        console.log(result);
    })
    .catch((error) => {
        console.error('Error uploading photo:', error);
    });
    }, 'image/jpeg');
});

// Choose photo from file input
chooseButton.addEventListener('click', () => {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    fileInput.addEventListener('change', (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
        // Show the selected photo on the form
        const img = document.createElement('img');
        img.src = URL.createObjectURL(selectedFile);
        uploadForm.appendChild(img);

        // Append the file to the form's FormData
        const formData = new FormData(uploadForm);
        formData.append('photo', selectedFile);

        // Submit the form to upload the photo
        fetch('/upload', {
        method: 'POST',
        body: formData
        })
        .then((response) => response.text())
        .then((result) => {
        console.log(result);
        })
        .catch((error) => {
        console.error('Error uploading photo:', error);
        });
    }
    });

    fileInput.click();
});