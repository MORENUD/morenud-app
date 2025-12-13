export const loginTexts = {
  title: "เข้าสู่ระบบ",
  titleEn: "Login",
  subtitle: "กรุณาเข้าสู่ระบบเพื่อจองนัดหมาย",
  subtitleEn: "Please login to book an appointment",
  username: "ชื่อผู้ใช้",
  usernameEn: "Username",
  password: "รหัสผ่าน",
  passwordEn: "Password",
  usernamePlaceholder: "กรอกชื่อผู้ใช้",
  usernamePlaceholderEn: "Enter username",
  passwordPlaceholder: "กรอกรหัสผ่าน",
  passwordPlaceholderEn: "Enter password",
  loginButton: "เข้าสู่ระบบ",
  loginButtonEn: "Login",
  forgotPassword: "ลืมรหัสผ่าน?",
  forgotPasswordEn: "Forgot Password?",
  noAccount: "ยังไม่มีบัญชี?",
  noAccountEn: "Don't have an account?",
  signup: "สมัครสมาชิก",
  signupEn: "Sign Up",
  invalidCredentials: "ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง",
  invalidCredentialsEn: "Invalid username or password",
  loginSuccess: "เข้าสู่ระบบสำเร็จ",
  loginSuccessEn: "Login successful",
  userTypeRegular: "ผู้ใช้ทั่วไป",
  userTypeCaregiver: "ผู้ดูแล",
  welcomeBack: "ยินดีต้อนรับกลับ",
  welcomeBackEn: "Welcome back"
};

// Mock users data
export const mockUsers = [
  // Regular users
  {
    id: 1,
    username: "peter123",
    password: "password123",
    type: "regular",
    name: "สมชาย ใจดี",
    nameEn: "Somchai Jaidee",
    email: "somchai@email.com",
    phone: "081-234-5678"
  },
  {
    id: 2,
    username: "malee456",
    password: "password456",
    type: "regular",
    name: "มาลี สวยงาม",
    nameEn: "Malee Swayngam",
    email: "malee@email.com",
    phone: "082-345-6789"
  },
  {
    id: 3,
    username: "niran789",
    password: "password789",
    type: "regular",
    name: "นิรัน มั่นคง",
    nameEn: "Niran Mankong",
    email: "niran@email.com",
    phone: "083-456-7890"
  },
  // Caregivers
  {
    id: 4,
    username: "caregiver1",
    password: "care123",
    type: "caregiver",
    name: "พยาบาลศิริ",
    nameEn: "Nurse Siri",
    email: "siri.nurse@hospital.com",
    phone: "084-567-8901",
    department: "Internal Medicine",
    license: "RN-12345"
  },
  {
    id: 5,
    username: "caregiver2",
    password: "care456",
    type: "caregiver",
    name: "พยาบาลอุมา",
    nameEn: "Nurse Uma",
    email: "uma.nurse@hospital.com",
    phone: "085-678-9012",
    department: "Emergency Room",
    license: "RN-67890"
  },
  {
    id: 6,
    username: "doctor1",
    password: "doc123",
    type: "caregiver",
    name: "หมอวิชัย",
    nameEn: "Dr. Wichai",
    email: "wichai.doctor@hospital.com",
    phone: "086-789-0123",
    department: "Cardiology",
    license: "MD-11111"
  }
];
