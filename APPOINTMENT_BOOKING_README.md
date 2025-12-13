# Appointment Booking System - Documentation

## Overview
This implementation provides two user flows for adding appointment data (ข้อมูลนัดหมายครั้งต่อไป):

1. **Manual Entry** - Users manually fill in appointment details
2. **OCR Scan** - Users scan their appointment card with camera and extract data automatically using LLM Vision API

## File Structure

```
app/(routes)/book-appointment/
├── page.tsx                          # Path selection page (Manual vs OCR)
├── texts.ts                          # Text constants (Thai)
├── manual/
│   └── page.tsx                      # Manual entry form
└── ocr-scan/
    ├── page.tsx                      # Camera/file scanning page
    └── confirm/
        └── page.tsx                  # OCR data confirmation page

app/api/appointments/
├── new/
│   └── route.ts                      # Updated to handle new fields
└── ocr/
    └── route.ts                      # OCR processing endpoint
```

## Features Implemented

### 1. Path Selection Page (`/book-appointment`)
- Users can choose between Manual Entry or OCR Scan
- Beautiful card-based UI with icons
- Clear descriptions for each method

### 2. Manual Entry Form (`/book-appointment/manual`)
**New Input Fields:**
- ✅ HN (หมายเลข HN): e.g., AP001235
- ✅ Confirmation Status (สถานะการยืนยัน): ยืนยันแล้ว / รอยืนยัน
- ✅ Doctor Name (ชื่อนามสกุลแพทย์)
- ✅ Department (แผนก)
- ✅ Hospital (โรงพยาบาล)
- ✅ Queue Number (หมายเลขคิว)
- ✅ Appointment Date (วันที่นัดหมาย)
- ✅ Appointment Time (เวลานัดหมาย)
- ✅ Phone (เบอร์โทรศัพท์)
- ✅ Address (ที่อยู่)

**Features:**
- All fields with proper labels and placeholders
- Validation for required fields
- Confirmation dialog before submission
- Success/error handling with SweetAlert2

### 3. OCR Scan Flow (`/book-appointment/ocr-scan`)

#### Camera Scanning Page
**Features:**
- ✅ Camera access with permission handling
- ✅ Live camera preview with mirror effect
- ✅ Visual guide overlay for positioning
- ✅ Capture button to take photo
- ✅ File upload from gallery as alternative
- ✅ Image validation (type & size)
- ✅ Processing indicator
- ✅ Retake functionality

**User Experience:**
1. User clicks "เริ่มสแกนใบนัด" to activate camera
2. Camera preview shows with positioning guide
3. User positions appointment card in frame
4. Click "ถ่ายรูป" to capture
5. Image sent to OCR API for processing
6. Automatic redirect to confirmation page

#### OCR Confirmation Page (`/book-appointment/ocr-scan/confirm`)
**Features:**
- ✅ Displays extracted data from OCR
- ✅ All fields are editable for corrections
- ✅ Confirmation status automatically set to "ยืนยันแล้ว" (Confirmed)
- ✅ Green theme to indicate OCR source
- ✅ Info banner explaining OCR results
- ✅ Note: OCR scans are auto-confirmed (since ใบนัด = hospital confirmed)

### 4. API Endpoints

#### `/api/appointments/ocr` (POST)
**Purpose:** Process scanned appointment card images using LLM Vision API

**Request:**
```json
{
  "image": "data:image/jpeg;base64,...",
  "timestamp": "2024-12-13T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "message": "OCR processing completed successfully",
  "data": {
    "hn": "AP001235",
    "doctorName": "นพ.กิตติชัย เก่งมาก",
    "department": "แผนกอายุรกรรม",
    "hospital": "โรงพยาบาลอนธรรมี",
    "queueNumber": "B-012",
    "appointmentDate": "2567-12-16",
    "appointmentTime": "10:00",
    "phone": "089-567-8901",
    "address": ""
  },
  "timestamp": "2024-12-13T10:00:05.000Z"
}
```

**Current Implementation:**
- Returns mock data for development
- Includes TODO comment for LLM Vision API integration
- Example OpenAI GPT-4 Vision integration code provided

**Production Integration:**
To integrate with OpenAI GPT-4 Vision API:
1. Set `OPENAI_API_KEY` environment variable
2. Uncomment the API call code in `/api/appointments/ocr/route.ts`
3. The prompt is optimized for Thai hospital appointment cards
4. Returns structured JSON data ready for use

#### `/api/appointments/new` (POST)
**Updates:**
- ✅ Accepts all new fields (hn, department, hospital, queueNumber, confirmationStatus)
- ✅ Handles both manual and OCR sources
- ✅ Auto-sets status based on confirmationStatus or source
- ✅ OCR scans are automatically marked as "confirmed"

## Confirmation Status Logic

### Manual Entry:
- User can select: "รอยืนยัน" (Pending) or "ยืนยันแล้ว" (Confirmed)
- Default: "รอยืนยัน" (Pending)

### OCR Scan:
- **Always "ยืนยันแล้ว" (Confirmed)**
- Rationale: ใบนัด (appointment card) from hospital = already confirmed
- User sees green badge and cannot change this
- Displayed with checkmark icon

## User Flow Diagram

```
/book-appointment (Selection)
├─→ Manual Entry (/book-appointment/manual)
│   └─→ Fill all fields manually
│       └─→ Submit → /book-appointment/card?id={id}
│
└─→ OCR Scan (/book-appointment/ocr-scan)
    ├─→ Option 1: Camera
    │   └─→ Activate camera
    │       └─→ Capture image
    │           └─→ Process with OCR API
    │               └─→ Redirect to confirm page
    │
    └─→ Option 2: Upload from gallery
        └─→ Select image file
            └─→ Process with OCR API
                └─→ Redirect to confirm page

/book-appointment/ocr-scan/confirm
└─→ Review & edit extracted data
    └─→ Submit → /book-appointment/card?id={id}
```

## Text Constants

All text is centralized in `/app/(routes)/book-appointment/texts.ts`:
- Page titles
- Field labels
- Placeholders
- Button text
- Alert messages
- Confirmation status labels

This makes it easy to:
- Update text without touching components
- Add internationalization (i18n) later
- Maintain consistency across the app

## Installation & Setup

No additional dependencies required! The implementation uses existing packages:
- `next` - Navigation and routing
- `sweetalert2` - Alerts and confirmations
- Native browser APIs - Camera access

## Testing

### Manual Entry Flow:
1. Navigate to `/book-appointment`
2. Click "กรอกข้อมูลด้วยตัวเอง"
3. Fill all required fields
4. Click "ยืนยันการนัดหมาย"
5. Confirm in dialog
6. Verify appointment created

### OCR Scan Flow:
1. Navigate to `/book-appointment`
2. Click "สแกนใบนัดหมาย"
3. Click "เริ่มสแกนใบนัด" or "เลือกรูปจากอัลบั้ม"
4. Allow camera permission (for camera option)
5. Capture/select image
6. Wait for OCR processing
7. Review extracted data on confirm page
8. Edit if needed
9. Click "ยืนยันข้อมูล"
10. Verify appointment created with confirmed status

## Future Enhancements

1. **LLM Vision API Integration:**
   - Replace mock data with real OCR processing
   - Fine-tune prompt for better extraction
   - Handle Thai language characters properly
   - Add confidence scores for extracted fields

2. **Enhanced Features:**
   - Image preprocessing (rotation, contrast, etc.)
   - Multiple image capture for better accuracy
   - Field-level confidence indicators
   - Suggested corrections based on validation

3. **User Experience:**
   - Loading progress percentage
   - Preview captured image before processing
   - Zoom functionality for small text
   - Flash/torch control for low light

4. **Error Handling:**
   - Retry mechanism for failed OCR
   - Fallback to manual entry if OCR fails
   - Save partial data for recovery

## Notes

- The OCR API currently returns mock data for development
- Camera access requires HTTPS in production
- File upload works as fallback if camera unavailable
- All appointments from OCR are marked as confirmed automatically
- The system is fully responsive and mobile-friendly
