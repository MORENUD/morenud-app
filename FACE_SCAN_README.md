# Face Scan Implementation

This face scan page includes the following features:

## Text Internationalization:
- All text has been extracted into separate files
- English text in `texts.ts`
- Thai text in `texts-thai.ts` 
- Language utility in `language-utils.ts`
- Easy to switch languages or add more languages

## Features Implemented:

### 1. Camera Access
- Requests user permission for camera access
- Handles camera errors gracefully
- Shows mirror effect for user-friendly experience

### 2. Face Scanning Interface
- Circular overlay guide for face positioning
- Real-time scanning progress indicator
- Visual feedback during scanning process
- Success/error states with appropriate messages

### 3. Base64 Image Capture & File Upload
- Captures video frame as image from camera
- Upload image files from device storage
- Converts both camera and file images to base64 format
- Maintains proper aspect ratio and mirror correction
- File validation (image type, max 5MB size)
- Automatically processes image when scan completes or file uploaded

### 4. API Integration
- Sends captured image to `/api/face-scan` endpoint
- Includes timestamp and image data
- Handles API responses and errors
- Console logging for debugging

### 5. Multiple Input Methods
- Camera scanning with automatic capture
- Manual file upload from device
- Preview of captured/uploaded image
- Shows truncated base64 string for verification
- File validation and error handling

## How to Test:

1. Navigate to `/face-scan` route
2. Allow camera permissions when prompted
3. Position your face within the circular guide for camera scan
4. Click "Start Face Scan" for automatic camera scanning
5. Or click "เพิ่มรูปถ่าย" to upload an image file from your device
6. Check browser console for base64 output
7. Check server logs for received image data

## API Endpoint:

**POST** `/api/face-scan`
```json
{
  "image": "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEAAAAA...",
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Face scan image received successfully",
  "imageSize": 45230,
  "timestamp": "2024-12-06T10:30:00.000Z"
}
```

## Base64 Usage:

The captured image is converted to base64 format which can be:
- Stored in database
- Sent to AI/ML services for face recognition
- Uploaded to cloud storage
- Processed for face detection/analysis
- Used for user authentication

The base64 string includes the data URL prefix (`data:image/jpeg;base64,`) making it ready for direct use in HTML img tags or API calls.

## Text Management:

### Files Structure:
- `texts.ts` - English text constants
- `texts-thai.ts` - Thai text constants  
- `language-utils.ts` - Language switching utility

### Usage:
```typescript
import { faceScanTexts } from './texts'; // English
import { faceScanTextsThai } from './texts-thai'; // Thai
import { getTexts } from './language-utils'; // Dynamic

// Direct usage
const title = faceScanTexts.mainTitle;

// Dynamic usage
const texts = getTexts('en'); // or 'th'
const title = texts.mainTitle;
```

### Adding New Languages:
1. Create new text file (e.g., `texts-spanish.ts`)
2. Update language utility types and function
3. Import and use in components
