document.addEventListener('DOMContentLoaded', () => {
    // Video Modal Functionality
    const videoBtn = document.getElementById('video-tutorial-btn');
    const videoModal = document.getElementById('video-modal');
    const closeModal = document.querySelector('.close-modal');
    const loomEmbedWrapper = document.getElementById('loom-embed-wrapper');
    const videoEmbedUrl = "LOOM_VIDEO_URL_HERE"; // Replace with your Loom video URL
    
    // Open modal
    videoBtn.addEventListener('click', () => {
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Create the iframe only when the modal is opened (better performance)
        if (!loomEmbedWrapper.innerHTML) {
            const iframe = document.createElement('iframe');
            iframe.src = videoEmbedUrl;
            iframe.frameBorder = "0";
            iframe.allowFullscreen = true;
            loomEmbedWrapper.appendChild(iframe);
        }
    });
    
    // Close modal
    closeModal.addEventListener('click', closeVideoModal);
    
    // Close modal when clicking outside content
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeVideoModal();
        }
    });
    
    // Close modal on ESC key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });
    
    function closeVideoModal() {
        videoModal.classList.remove('active');
        document.body.style.overflow = 'auto'; // Re-enable scrolling
    }

    // Typing animation for placeholder
    const typingPlaceholder = document.getElementById('typing-placeholder');
    const examples = [
        "Make the dog blue",
        "The car is on a cliffside in Malibu during sunset",
        "Make the car into a diecast car in a display case",
        "Change the man's hair to long blonde hair"
    ];
    let exampleIndex = 0;
    let charIndex = 0;
    let isTyping = true;
    let typingTimer;

    function typeText() {
        const currentExample = examples[exampleIndex];
        
        if (isTyping) {
            // Typing in
            typingPlaceholder.textContent = currentExample.substring(0, charIndex) + '|';
            charIndex++;
            
            if (charIndex > currentExample.length) {
                isTyping = false;
                charIndex = currentExample.length;
                // Pause at the end of typing in
                clearTimeout(typingTimer);
                typingTimer = setTimeout(typeText, 1500);
                return;
            }
        } else {
            // Typing out
            typingPlaceholder.textContent = currentExample.substring(0, charIndex) + '|';
            charIndex--;
            
            if (charIndex === 0) {
                isTyping = true;
                // Move to next example
                exampleIndex = (exampleIndex + 1) % examples.length;
                // Pause before starting new example
                clearTimeout(typingTimer);
                typingTimer = setTimeout(typeText, 500);
                return;
            }
        }
        
        // Speed of typing (adjust for faster/slower)
        const typingSpeed = isTyping ? 100 : 50;
        clearTimeout(typingTimer);
        typingTimer = setTimeout(typeText, typingSpeed);
    }

    // Start typing animation
    typingPlaceholder.textContent = 'Describe your vision... |';
    setTimeout(() => {
        typingPlaceholder.textContent = '|';
        setTimeout(typeText, 500);
    }, 1500);

    // DOM Elements
    const apiKeyInput = document.getElementById('api-key');
    const uploadArea = document.getElementById('upload-area');
    const imageInput = document.getElementById('image-input');
    const imagePreview = document.getElementById('image-preview');
    const previewImg = document.getElementById('preview-img');
    const removeImageBtn = document.getElementById('remove-image');
    const editDescription = document.getElementById('edit-description');
    const generateBtn = document.getElementById('generate-btn');
    const resultSection = document.getElementById('result-section');
    const originalImg = document.getElementById('original-img');
    const modifiedImg = document.getElementById('modified-img');
    const loadingIndicator = document.getElementById('loading-indicator');
    const downloadBtn = document.getElementById('download-btn');
    const newEditBtn = document.getElementById('new-edit-btn');
    const continueEditBtn = document.getElementById('continue-edit-btn');
    const usageCountElement = document.getElementById('usage-count-number');
    const toggleApiVisibilityBtn = document.getElementById('toggle-api-visibility');
    const showIcon = document.querySelector('.show-icon');
    const hideIcon = document.querySelector('.hide-icon');
    const clearApiKeyBtn = document.getElementById('clear-api-key');
    const rememberKeyCheckbox = document.getElementById('remember-key-checkbox');

    // State
    let uploadedImage = null;
    let modifiedImageUrl = null;
    let generationCount = 0;

    // API Key Security Functions
    function saveApiKey(apiKey) {
        if (rememberKeyCheckbox.checked) {
            localStorage.setItem('geminiApiKey', apiKey);
        } else {
            sessionStorage.setItem('geminiApiKey', apiKey);
            // Clear from localStorage if it was previously saved there
            if (localStorage.getItem('geminiApiKey')) {
                localStorage.removeItem('geminiApiKey');
            }
        }
    }

    function loadApiKey() {
        // First check sessionStorage (current session)
        let apiKey = sessionStorage.getItem('geminiApiKey');
        
        // If not found and we have one in localStorage, use that and set the remember checkbox
        if (!apiKey && localStorage.getItem('geminiApiKey')) {
            apiKey = localStorage.getItem('geminiApiKey');
            rememberKeyCheckbox.checked = true;
        }
        
        return apiKey;
    }

    function clearApiKey() {
        apiKeyInput.value = '';
        sessionStorage.removeItem('geminiApiKey');
        localStorage.removeItem('geminiApiKey');
        rememberKeyCheckbox.checked = false;
        validateForm();
    }

    // Toggle password visibility
    toggleApiVisibilityBtn.addEventListener('click', () => {
        if (apiKeyInput.type === 'password') {
            apiKeyInput.type = 'text';
            showIcon.classList.add('hidden');
            hideIcon.classList.remove('hidden');
        } else {
            apiKeyInput.type = 'password';
            hideIcon.classList.add('hidden');
            showIcon.classList.remove('hidden');
        }
        apiKeyInput.focus();
    });

    // Clear API key
    clearApiKeyBtn.addEventListener('click', clearApiKey);

    // Load saved API key and usage count from storage
    const savedApiKey = loadApiKey();
    if (savedApiKey) {
        apiKeyInput.value = savedApiKey;
        validateForm();
    }
    
    // Load generation count from localStorage
    if (localStorage.getItem('generationCount')) {
        generationCount = parseInt(localStorage.getItem('generationCount'));
        updateUsageCount();
    }

    // Event Listeners
    apiKeyInput.addEventListener('input', () => {
        saveApiKey(apiKeyInput.value);
        validateForm();
    });

    // When remember checkbox changes
    rememberKeyCheckbox.addEventListener('change', () => {
        // If the API key exists, save it based on the new checkbox state
        if (apiKeyInput.value) {
            saveApiKey(apiKeyInput.value);
        }
    });

    uploadArea.addEventListener('click', () => {
        imageInput.click();
    });

    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.classList.add('active');
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.classList.remove('active');
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.classList.remove('active');
        
        const file = e.dataTransfer.files[0];
        if (file && file.type.startsWith('image/')) {
            handleImageUpload(file);
        }
    });

    imageInput.addEventListener('change', () => {
        if (imageInput.files.length > 0) {
            handleImageUpload(imageInput.files[0]);
        }
    });

    removeImageBtn.addEventListener('click', clearImage);

    editDescription.addEventListener('input', validateForm);

    generateBtn.addEventListener('click', generateModifiedImage);

    downloadBtn.addEventListener('click', downloadModifiedImage);

    newEditBtn.addEventListener('click', startNewEdit);
    
    continueEditBtn.addEventListener('click', continueEditingImage);

    // Functions
    function handleImageUpload(file) {
        uploadedImage = file;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            previewImg.src = e.target.result;
            uploadArea.classList.add('hidden');
            imagePreview.classList.remove('hidden');
            validateForm();
        };
        reader.readAsDataURL(file);
    }

    function clearImage() {
        uploadedImage = null;
        previewImg.src = '';
        imageInput.value = '';
        uploadArea.classList.remove('hidden');
        imagePreview.classList.add('hidden');
        validateForm();
    }

    function validateForm() {
        const isApiKeyValid = apiKeyInput.value.trim() !== '';
        const isImageUploaded = uploadedImage !== null;
        const isDescriptionValid = editDescription.value.trim() !== '';
        
        generateBtn.disabled = !(isApiKeyValid && isImageUploaded && isDescriptionValid);
    }

    async function generateModifiedImage() {
        try {
            // Show loading indicator
            resultSection.classList.remove('hidden');
            modifiedImg.classList.add('hidden');
            loadingIndicator.classList.remove('hidden');
            generateBtn.disabled = true;
            
            // Set original image in results
            originalImg.src = previewImg.src;
            
            // Get API key
            const apiKey = apiKeyInput.value.trim();
            
            // Convert image to base64
            const base64Image = await fileToBase64(uploadedImage);
            
            // Get user's description for edits
            const userPrompt = editDescription.value.trim();
            
            // Prepare request payload
            const requestData = {
                contents: [
                    {
                        parts: [
                            { 
                                text: `Edit this image: ${userPrompt}` 
                            },
                            {
                                inline_data: {
                                    mime_type: uploadedImage.type,
                                    data: base64Image.split(',')[1]
                                }
                            }
                        ]
                    }
                ],
                generationConfig: {
                    responseModalities: ["TEXT", "IMAGE"]
                }
            };
            
            // Call Gemini 2.0 Flash Experimental API for image generation
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp-image-generation:generateContent?key=${apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(requestData)
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                console.error("API Error Details:", errorData);
                throw new Error(`API error: ${response.status} - ${errorData.error?.message || response.statusText}`);
            }
            
            const responseData = await response.json();
            console.log("API Response:", responseData);
            
            // Extract the modified image from the response
            if (responseData.candidates && 
                responseData.candidates[0].content && 
                responseData.candidates[0].content.parts) {
                
                const parts = responseData.candidates[0].content.parts;
                console.log("Response parts:", parts);
                let imageData = null;
                
                for (const part of parts) {
                    console.log("Checking part:", part);
                    // Check for both camelCase and snake_case formats
                    if (part.inlineData || part.inline_data) {
                        imageData = part.inlineData || part.inline_data;
                        break;
                    }
                }
                
                if (imageData) {
                    // Display the modified image
                    const mimeType = imageData.mimeType || imageData.mime_type;
                    const data = imageData.data;
                    modifiedImageUrl = `data:${mimeType};base64,${data}`;
                    modifiedImg.src = modifiedImageUrl;
                    modifiedImg.classList.remove('hidden');
                    
                    // Increment usage count and update display
                    generationCount++;
                    localStorage.setItem('generationCount', generationCount);
                    updateUsageCount();
                } else {
                    // If no image was found, display any text response instead
                    let textResponse = "";
                    for (const part of parts) {
                        if (part.text) {
                            textResponse += part.text;
                        }
                    }
                    
                    if (textResponse) {
                        // Create a text display instead of an image
                        const textDiv = document.createElement('div');
                        textDiv.className = 'text-response';
                        textDiv.textContent = "The model responded with text instead of an image: " + textResponse;
                        textDiv.style.padding = '1rem';
                        textDiv.style.border = '1px solid #ccc';
                        textDiv.style.borderRadius = '8px';
                        textDiv.style.backgroundColor = '#f8f9fa';
                        textDiv.style.marginTop = '1rem';
                        
                        // Replace the image with the text response
                        const container = modifiedImg.parentElement;
                        container.insertBefore(textDiv, modifiedImg);
                        modifiedImg.classList.add('hidden');
                        
                        alert("The model didn't generate an image. It provided a text response instead.");
                    } else {
                        throw new Error('No image or text found in the response');
                    }
                }
            } else {
                throw new Error('Invalid response format from Gemini API');
            }
        } catch (error) {
            console.error('Error generating image:', error);
            alert(`Error: ${error.message}`);
        } finally {
            // Hide loading indicator
            loadingIndicator.classList.add('hidden');
            generateBtn.disabled = false;
        }
    }

    function fileToBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    }

    function downloadModifiedImage() {
        if (modifiedImageUrl) {
            const a = document.createElement('a');
            a.href = modifiedImageUrl;
            a.download = 'gemini-modified-image.png';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
        }
    }

    function startNewEdit() {
        // Reset image editing form
        editDescription.value = '';
        
        // Hide result section
        resultSection.classList.add('hidden');
        modifiedImg.src = '';
        modifiedImageUrl = null;
        
        // Reset button state
        validateForm();
    }
    
    // Function to use the modified image as input for further edits
    async function continueEditingImage() {
        if (modifiedImageUrl) {
            try {
                // Convert data URL to a file
                const response = await fetch(modifiedImageUrl);
                const blob = await response.blob();
                const file = new File([blob], "modified-image.png", { type: blob.type });
                
                // Use the file as the new uploaded image
                uploadedImage = file;
                
                // Update the preview
                previewImg.src = modifiedImageUrl;
                uploadArea.classList.add('hidden');
                imagePreview.classList.remove('hidden');
                
                // Clear the description field
                editDescription.value = '';
                
                // Hide the result section
                resultSection.classList.add('hidden');
                
                // Validate the form
                validateForm();
            } catch (error) {
                console.error('Error using modified image as input:', error);
                alert('Error: Could not use the modified image as input.');
            }
        }
    }

    // Function to update the usage count display
    function updateUsageCount() {
        usageCountElement.textContent = generationCount;
    }
}); 