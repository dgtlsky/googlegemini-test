# Gemini 2.0 Flash Image Editor

A web application that allows users to edit images using Google's Gemini 2.0 Flash AI model. Upload an image, describe the changes you want, and let Gemini transform it!

## Features

- Upload an image through drag-and-drop or file selection
- Describe the changes you want to make to the image
- Use Google's Gemini 2.0 Flash model to perform the edits
- View side-by-side comparison of original and modified images
- Download the modified image

## Getting Started

### Prerequisites

- Node.js (v14 or later)
- Google API Key with access to Gemini API

### Installation

1. Clone this repository:
   ```
   git clone https://github.com/yourusername/gemini-image-editor.git
   cd gemini-image-editor
   ```

2. Install dependencies:
   ```
   npm install
   ```

3. Start the server:
   ```
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Getting a Google API Key

1. Go to the [Google AI Studio](https://makersuite.google.com/)
2. Create an account or sign in
3. Navigate to "API Keys" in the left sidebar
4. Create a new API key
5. Copy the API key and paste it into the application when prompted

## How to Use

1. Enter your Google API Key
2. Upload an image by dragging and dropping or using the file selector
3. Describe the changes you want to make to the image
4. Click "Generate Modified Image"
5. View the result and download the modified image if desired

## Examples of Image Edits You Can Try

- "Add a sunset in the background"
- "Make this a winter scene with snow"
- "Change the color of the shirt to blue"
- "Make this image look like a painting"
- "Remove the background and replace with a beach scene"
- "Add a hat to the person in the image"

## Technical Details

This application uses:
- Google's Gemini 2.0 Flash API for image generation
- HTML5, CSS3, and JavaScript for the frontend
- Express.js for the backend server

## Limitations

- The Gemini 2.0 Flash model has its own limitations in terms of what kinds of edits it can perform
- Large images may be downsized during processing
- The application requires an internet connection to communicate with Google's API

## License

This project is licensed under the MIT License - see the LICENSE file for details. 