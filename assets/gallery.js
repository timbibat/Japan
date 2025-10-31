// Categories for tabs
const categories = [
    { id: 'all', name: 'All' },
    { id: 'nature', name: 'Nature' },
    { id: 'cities', name: 'Cities' },
    { id: 'temples', name: 'Temples' }
];

// Generate Gallery Tabs
function generateTabs() {
    const tabsContainer = document.getElementById('galleryTabs');

    categories.forEach((category, index) => {
        const li = document.createElement('li');
        li.className = 'nav-item';
        li.setAttribute('role', 'presentation');

        const button = document.createElement('button');
        button.className = index === 0 ? 'nav-link active' : 'nav-link';
        button.textContent = category.name;
        button.setAttribute('data-category', category.id);
        button.addEventListener('click', () => filterGallery(category.id, button));

        li.appendChild(button);
        tabsContainer.appendChild(li);
    });
}

// Generate Gallery Items
function generateGallery(filter = 'all') {
    const galleryGrid = document.getElementById('galleryGrid');
    galleryGrid.innerHTML = '';

    const filteredData = filter === 'all'
        ? galleryData.all
        : galleryData.all.filter(item => item.category === filter);

    filteredData.forEach((item, index) => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-4';

        col.innerHTML = `
            <div class="gallery-item" onclick="openLightbox(${index}, '${filter}')">
                <img src="${item.src}" alt="${item.alt}" class="w-100">
                <div class="position-absolute bottom-0 start-0 w-100 p-3 bg-dark bg-opacity-75 text-white">
                    <h6 class="mb-0">${item.title}</h6>
                </div>
            </div>
        `;

        galleryGrid.appendChild(col);
    });
}

// Filter Gallery
function filterGallery(category, clickedButton) {
    document.querySelectorAll('#galleryTabs .nav-link').forEach(btn => {
        btn.classList.remove('active');
    });
    clickedButton.classList.add('active');
    generateGallery(category);
}

// Lightbox functionality
let currentImageIndex = 0;
let currentFilter = 'all';
let lightboxModal;

function openLightbox(index, filter) {
    currentImageIndex = index;
    currentFilter = filter;
    
    const filteredData = filter === 'all'
        ? galleryData.all
        : galleryData.all.filter(item => item.category === filter);
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    lightboxImg.src = filteredData[index].src;
    lightboxImg.alt = filteredData[index].alt;
    lightboxTitle.textContent = filteredData[index].title;
    
    lightboxModal.show();
}

function changeImage(direction) {
    const filteredData = currentFilter === 'all'
        ? galleryData.all
        : galleryData.all.filter(item => item.category === currentFilter);
    
    currentImageIndex += direction;
    
    if (currentImageIndex < 0) {
        currentImageIndex = filteredData.length - 1;
    } else if (currentImageIndex >= filteredData.length) {
        currentImageIndex = 0;
    }
    
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxTitle = document.getElementById('lightbox-title');
    
    lightboxImg.src = filteredData[currentImageIndex].src;
    lightboxImg.alt = filteredData[currentImageIndex].alt;
    lightboxTitle.textContent = filteredData[currentImageIndex].title;
}

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    const modalElement = document.getElementById('lightboxModal');
    if (modalElement && modalElement.classList.contains('show')) {
        if (e.key === 'ArrowLeft') {
            changeImage(-1);
        } else if (e.key === 'ArrowRight') {
            changeImage(1);
        }
    }
});

// Initialize Gallery on Page Load
document.addEventListener('DOMContentLoaded', () => {
    const lightboxHTML = `
        <div class="modal fade" id="lightboxModal" tabindex="-1" aria-labelledby="lightboxModalLabel" aria-hidden="true" data-bs-backdrop="true" data-bs-keyboard="true">
            <div class="modal-dialog modal-dialog-centered modal-xl">
                <div class="modal-content bg-dark border-0">
                    <div class="modal-header border-0 position-absolute top-0 end-0 z-3">
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body p-0 position-relative">
                        <button class="btn btn-light position-absolute top-50 start-0 translate-middle-y ms-3 rounded-circle" 
                                style="width: 50px; height: 50px; z-index: 2;" 
                                onclick="changeImage(-1)">
                            <i class="bi bi-chevron-left"></i>
                        </button>
                        <button class="btn btn-light position-absolute top-50 end-0 translate-middle-y me-3 rounded-circle" 
                                style="width: 50px; height: 50px; z-index: 2;" 
                                onclick="changeImage(1)">
                            <i class="bi bi-chevron-right"></i>
                        </button>
                        <img id="lightbox-img" src="" alt="" class="w-100 img-fluid" style="max-height: 80vh; object-fit: contain;">
                        <div class="text-center py-3">
                            <h5 id="lightbox-title" class="text-white mb-0"></h5>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML('beforeend', lightboxHTML);
    
    // Initialize Bootstrap Modal
    const modalElement = document.getElementById('lightboxModal');
    lightboxModal = new bootstrap.Modal(modalElement);
    
    generateTabs();
    generateGallery('all');
});