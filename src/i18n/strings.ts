export type Locale = 'ar' | 'en';

export const strings = {
  ar: {
    // App
    appName: 'حضور',
    appTagline: 'نظام تسجيل الحضور بالـ RFID',

    // Nav
    navHome: 'البث المباشر',
    navAllData: 'جميع الطلاب',
    navLogin: 'دخول المسؤول',
    navLogout: 'تسجيل الخروج',
    adminBadge: 'مسؤول',

    // Lecture
    noActiveLecture: 'لا توجد محاضرة نشطة',
    noActiveLectureDesc: 'ابدأ محاضرة جديدة لتسجيل الحضور',
    startLecture: 'بدء محاضرة',
    finishLecture: 'إنهاء المحاضرة',
    activeLecture: 'محاضرة نشطة',
    lectureStarted: 'بدأت',
    elapsed: 'مضى',
    attendeeCount: 'طالب حاضر',
    confirmFinish: 'هل تريد إنهاء المحاضرة؟',
    confirmFinishDesc: 'لن تتمكن من إضافة حضور جديد بعد الإنهاء.',

    // Start Lecture Modal
    startLectureTitle: 'بدء محاضرة جديدة',
    lectureNameEN: 'اسم المحاضرة (إنجليزي)',
    lectureNameAR: 'اسم المحاضرة (عربي)',
    lectureNameENPlaceholder: 'e.g. Computer Networks',
    lectureNameARPlaceholder: 'مثال: شبكات الحاسب',
    startBtn: 'ابدأ الآن',

    // Students
    addEntry: 'إضافة طالب',
    editEntry: 'تعديل',
    deleteEntry: 'حذف',
    showQR: 'رمز QR',
    studentUID: 'رقم الشريحة',
    studentID: 'رقم الطالب',
    studentNameAR: 'الاسم (عربي)',
    studentNameEN: 'الاسم (إنجليزي)',
    attendance: 'نسبة الحضور',
    lastScan: 'آخر مسح',
    status: 'الحالة',
    present: 'حاضر',
    absent: 'غائب',
    noStudents: 'لا يوجد طلاب في هذه المحاضرة',
    noStudentsDesc: 'في انتظار مسح الشرائح...',

    // Add/Edit Modal
    addStudentTitle: 'إضافة طالب',
    editStudentTitle: 'تعديل بيانات الطالب',
    uidPlaceholder: 'A1B2C3D4',
    idPlaceholder: '20210001',
    namearPlaceholder: 'أحمد محمد علي',
    nameen_placeholder: 'Ahmed Mohamed Ali',
    allowSelfEdit: 'السماح بالتعديل الذاتي',
    save: 'حفظ',
    cancel: 'إلغاء',

    // Delete Modal
    deleteTitle: 'حذف الطالب',
    deleteDesc: 'هذا الإجراء لا يمكن التراجع عنه. سيتم حذف الطالب نهائياً.',
    confirmDelete: 'نعم، احذف',

    // QR Modal
    qrTitle: 'رمز الدخول الشخصي',
    qrDesc: 'امسح الرمز للوصول إلى صفحتك الشخصية',
    qrClose: 'إغلاق',

    // Login
    loginTitle: 'مرحباً بعودتك',
    loginSubtitle: 'سجّل الدخول لإدارة المحاضرات',
    username: 'اسم المستخدم',
    password: 'كلمة المرور',
    loginBtn: 'تسجيل الدخول',
    loginError: 'بيانات الدخول غير صحيحة',

    // Search / Filter
    search: 'بحث...',
    sortBy: 'ترتيب حسب',
    filterStatus: 'تصفية',
    all: 'الكل',

    // Student self-edit page
    myProfile: 'ملفي الشخصي',
    selfEditTitle: 'تعديل بياناتك',
    selfEditDesc: 'يمكنك تعديل اسمك ورقمك الجامعي فقط. تواصل مع المسؤول لتعديل باقي البيانات.',
    blockEdit: 'منع التعديل',
    allowEdit: 'السماح بالتعديل',
    restrictedTitle: 'الوصول مقيّد',
    restrictedDesc: 'هذه الصفحة غير متاحة. تواصل مع المسؤول.',
    updateProfile: 'تحديث البيانات',
    lectureHistory: 'سجل المحاضرات',
    noHistory: 'لا يوجد سجل محاضرات',

    // Toasts
    toastLectureStarted: 'تم بدء المحاضرة',
    toastLectureFinished: 'تم إنهاء المحاضرة',
    toastStudentAdded: 'تمت إضافة الطالب',
    toastStudentUpdated: 'تم تحديث البيانات',
    toastStudentDeleted: 'تم حذف الطالب',
    toastNewScan: 'تم مسح شريحة جديدة',
    toastError: 'حدث خطأ',

    // Simulation
    simulationEnabled: 'وضع المحاكاة نشط',
    simulationEnabledDesc: 'أنت الآن تشاهد بيانات تجريبية واقعية تم إنشاؤها بواسطة النظام. لا يوجد جهاز فعلي متصل.',
    simulationActive: 'المحاكاة نشطة',
    startSimulation: 'تشغيل المحاكاة',
    stopSimulation: 'إيقاف المحاكاة',
    restartSimulation: 'إعادة تشغيل المحاكاة',
    simulationBannerTitle: 'وضع المحاكاة مفعّل',

    // Misc
    by: 'بواسطة',
    devora: 'ديفورا',
    secured: 'محمي بنظام JWT',
  },

  en: {
    // App
    appName: 'Hodor',
    appTagline: 'RFID Attendance System',

    // Nav
    navHome: 'Live Feed',
    navAllData: 'All Students',
    navLogin: 'Admin Login',
    navLogout: 'Logout',
    adminBadge: 'Admin',

    // Lecture
    noActiveLecture: 'No Active Lecture',
    noActiveLectureDesc: 'Start a new lecture to begin tracking attendance',
    startLecture: 'Start Lecture',
    finishLecture: 'Finish Lecture',
    activeLecture: 'Active Lecture',
    lectureStarted: 'Started',
    elapsed: 'Elapsed',
    attendeeCount: 'student(s) present',
    confirmFinish: 'Finish this lecture?',
    confirmFinishDesc: 'No new attendance entries can be added after finishing.',

    // Start Lecture Modal
    startLectureTitle: 'Start a New Lecture',
    lectureNameEN: 'Lecture Name (English)',
    lectureNameAR: 'Lecture Name (Arabic)',
    lectureNameENPlaceholder: 'e.g. Computer Networks',
    lectureNameARPlaceholder: 'e.g. شبكات الحاسب',
    startBtn: 'Start Now',

    // Students
    addEntry: 'Add Student',
    editEntry: 'Edit',
    deleteEntry: 'Delete',
    showQR: 'QR Code',
    studentUID: 'RFID UID',
    studentID: 'University ID',
    studentNameAR: 'Name (Arabic)',
    studentNameEN: 'Name (English)',
    attendance: 'Attendance %',
    lastScan: 'Last Scan',
    status: 'Status',
    present: 'Present',
    absent: 'Absent',
    noStudents: 'No students scanned yet',
    noStudentsDesc: 'Waiting for RFID scans...',

    // Add/Edit Modal
    addStudentTitle: 'Add Student',
    editStudentTitle: 'Edit Student',
    uidPlaceholder: 'A1B2C3D4',
    idPlaceholder: '20210001',
    namearPlaceholder: 'أحمد محمد علي',
    nameen_placeholder: 'Ahmed Mohamed Ali',
    allowSelfEdit: 'Allow self-editing',
    save: 'Save',
    cancel: 'Cancel',

    // Delete Modal
    deleteTitle: 'Delete Student',
    deleteDesc: 'This action cannot be undone. The student will be permanently removed.',
    confirmDelete: 'Yes, Delete',

    // QR Modal
    qrTitle: 'Personal Access QR',
    qrDesc: 'Scan to access the student\'s personal page',
    qrClose: 'Close',

    // Login
    loginTitle: 'Welcome Back',
    loginSubtitle: 'Sign in to manage lectures',
    username: 'Username',
    password: 'Password',
    loginBtn: 'Sign In',
    loginError: 'Invalid username or password',

    // Search / Filter
    search: 'Search...',
    sortBy: 'Sort by',
    filterStatus: 'Filter',
    all: 'All',

    // Student self-edit page
    myProfile: 'My Profile',
    selfEditTitle: 'Edit Your Info',
    selfEditDesc: 'You can only edit your name and university ID. Contact the admin to update other fields.',
    blockEdit: 'Block Edit',
    allowEdit: 'Allow Edit',
    restrictedTitle: 'Access Restricted',
    restrictedDesc: 'This page is not available. Please contact the admin.',
    updateProfile: 'Update Profile',
    lectureHistory: 'Lecture History',
    noHistory: 'No lecture history yet',

    // Toasts
    toastLectureStarted: 'Lecture started',
    toastLectureFinished: 'Lecture finished',
    toastStudentAdded: 'Student added',
    toastStudentUpdated: 'Student updated',
    toastStudentDeleted: 'Student deleted',
    toastNewScan: 'New RFID scan detected',
    toastError: 'An error occurred',

    // Simulation
    simulationEnabled: 'Simulation Mode Enabled',
    simulationEnabledDesc: 'You are currently viewing realistic demo data generated by the system. No physical hardware is connected.',
    simulationActive: 'Simulation Active',
    startSimulation: 'Run Simulation',
    stopSimulation: 'Stop Simulation',
    restartSimulation: 'Restart Simulation',
    simulationBannerTitle: 'Simulation Mode Enabled',

    // Misc
    by: 'by',
    devora: 'Devora',
    secured: 'Secured by JWT',
  },
};

export type StringKey = keyof typeof strings.en;
