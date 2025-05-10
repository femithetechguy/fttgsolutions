document.addEventListener('DOMContentLoaded', function() {
  // Project card expansion functionality
  setupProjectPreview('#project-one', 'https://glamorbybee.com/');
  setupProjectPreview('#project-two', 'https://redemeptionvoices.com');
  setupProjectPreview('#project-three', 'https://jongleurzone.com/');
  
  function setupProjectPreview(projectSelector, websiteUrl) {
    const projectCard = document.querySelector(projectSelector);
    
    if (projectCard) {
      projectCard.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Create modal with iframe
        const modal = document.createElement('div');
        modal.className = 'project-modal';
        
        // Create iframe container with loading indicator
        const iframeContainer = document.createElement('div');
        iframeContainer.className = 'iframe-container';
        
        const loadingIndicator = document.createElement('div');
        loadingIndicator.className = 'loading-indicator';
        loadingIndicator.innerHTML = '<ion-spinner name="crescent"></ion-spinner><p>Loading preview...</p>';
        iframeContainer.appendChild(loadingIndicator);
        
        // Create iframe
        const iframe = document.createElement('iframe');
        iframe.src = websiteUrl;
        iframe.className = 'project-iframe';
        iframe.onload = function() {
          loadingIndicator.style.display = 'none';
        };
        iframeContainer.appendChild(iframe);
        
        // Create close button
        const closeBtn = document.createElement('button');
        closeBtn.className = 'close-modal';
        closeBtn.innerHTML = '<ion-icon name="close-circle"></ion-icon>';
        closeBtn.addEventListener('click', function(e) {
          e.stopPropagation();
          document.body.removeChild(modal);
          document.body.classList.remove('modal-open');
        });
        
        // Add elements to modal
        modal.appendChild(iframeContainer);
        modal.appendChild(closeBtn);
        
        // Add modal to body
        document.body.appendChild(modal);
        document.body.classList.add('modal-open');
      });
    }
  }
});