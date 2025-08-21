# Image Resizer & Background Remover

A modern, user-friendly web application for resizing images and removing backgrounds with a beautiful purple theme.

## Features

- **Image Upload**: Drag and drop or click to browse for images
- **Image Resizing**: Resize images with custom width and height
- **Background Removal**: Remove backgrounds using color similarity detection
- **Quality Control**: Adjust output image quality
- **Real-time Preview**: See changes instantly
- **Download**: Save processed images in PNG format
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

### 1. Upload an Image
- Drag and drop an image onto the upload area, or
- Click the upload area to browse and select an image

### 2. Resize Image
- Use the width and height inputs to set new dimensions
- Click "Maintain Ratio" to keep the original aspect ratio
- Changes are applied in real-time

### 3. Remove Background
- Adjust the tolerance slider to control background removal sensitivity
- Click "Remove Background" to process the image
- Use "Restore Background" to undo the removal

### 4. Download
- Click "Download Image" to save the processed image
- Images are saved in PNG format with the specified quality

### 5. Reset
- Click "Reset" to restore the original image and settings

## Keyboard Shortcuts

- `Ctrl/Cmd + S`: Download the processed image
- `Ctrl/Cmd + Z`: Undo (placeholder for future implementation)

## Technical Details

- Built with vanilla HTML, CSS, and JavaScript
- Uses HTML5 Canvas API for image processing
- No external dependencies required
- Works offline after initial load
- Responsive design with CSS Grid and Flexbox

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## File Structure

```
image_resizer/
├── index.html          # Main HTML file
├── styles.css          # CSS styling with purple theme
├── script.js           # JavaScript functionality
└── README.md           # This file
```

## Getting Started

1. **Live Demo**: Visit [https://saharabenz94.github.io/image_resizer/](https://saharabenz94.github.io/image_resizer/)
2. **Local Development**: Download or clone the repository
3. **Local Testing**: Open `index.html` in a modern web browser
4. Start processing your images!

## Background Removal Algorithm

The background removal uses a simple but effective color similarity approach:
- Analyzes the top-left pixel color as the background color
- Compares each pixel's color to the background color
- Uses a tolerance value to determine which pixels to make transparent
- Adjustable tolerance allows fine-tuning of the removal process

## Tips for Best Results

- Use images with clear contrast between subject and background
- Adjust tolerance settings for optimal background removal
- Higher quality settings produce better results but larger file sizes
- For best background removal, use images with solid color backgrounds

## License

This project is open source and available under the MIT License.

## Contributing

Feel free to submit issues, feature requests, or pull requests to improve the application.
