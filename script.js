// Cloudinary config
const CLOUDINARY_URL = 'https://api.cloudinary.com/v1_1/dbdd85bp4/video/upload';
const CLOUDINARY_UPLOAD_PRESET = 'uploadVideo';

// Video data array to simulate database
let videoData = [];

// Handle video upload
document.getElementById('uploadForm').addEventListener('submit', function (event) {
    event.preventDefault();
    
    const fileInput = document.getElementById('videoInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        // Upload to Cloudinary
        axios.post(CLOUDINARY_URL, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        }).then(function (response) {
            const videoUrl = response.data.secure_url;
            const videoId = response.data.public_id;

            // Add video to list
            videoData.push({
                id: videoId,
                url: videoUrl,
                name: file.name
            });

            // Reset form and update video list
            fileInput.value = '';
            updateVideoList();
        }).catch(function (error) {
            console.error('Upload failed:', error);
        });
    }
});

// Update video list UI
function updateVideoList() {
    const videoList = document.getElementById('videoList');
    videoList.innerHTML = '';

    videoData.forEach((video, index) => {
        const videoItem = document.createElement('li');
        videoItem.classList.add('list-group-item', 'video-item');

        const videoElement = document.createElement('video');
        videoElement.src = video.url;
        videoElement.controls = true;

        const videoName = document.createElement('span');
        videoName.textContent = video.name;

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn', 'btn-danger');
        deleteButton.textContent = 'Delete';
        deleteButton.onclick = () => deleteVideo(index);

        videoItem.appendChild(videoElement);
        videoItem.appendChild(videoName);
        videoItem.appendChild(deleteButton);

        videoList.appendChild(videoItem);
    });
}

// Delete video
function deleteVideo(index) {
    const videoId = videoData[index].id;

    axios.delete(`https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/video/destroy/${videoId}`)
        .then(() => {
            videoData.splice(index, 1);
            updateVideoList();
        })
        .catch((error) => {
            console.error('Delete failed:', error);
        });
}
