# 🛡️ Hodor (The Gatekeeper)

[![Next.js](https://img.shields.io/badge/Next.js-16-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-Latest-purple?style=for-the-badge&logo=framer)](https://www.framer.com/motion/)

**Hodor** is a premium, ultra-responsive attendance management system designed as the frontend part of **Devora's Embedded System University Project** at **OTU**. It provides a modern interface for tracking student attendance via RFID/QR, managing records, and empowering students with self-editing capabilities.

---

## ✨ Key Features

- 📱 **QR-Based Self-Editing**: Students can scan their unique QR codes to update their profiles instantly.
- 📊 **Dynamic Admin Dashboard**: Comprehensive overview of attendance data with real-time updates and lecture management.
- 🌍 **Bilingual Support**: Fully localized interface supporting both **Arabic** and **English** with RTL/LTR transitions.
- 🌓 **Premium UI/UX**: A state-of-the-art design featuring:
  - **Glassmorphism** and high-end aesthetics.
  - **Smooth Transitions** powered by Framer Motion.
  - **Dynamic Dark/Light Mode** tailored for readability and style.
- 🎫 **RFID Integration**: Seamlessly ready to pair with the backend port and RFID hardware module.
- 🎓 **Lecture Lifecycle Management**: Start, pause, and stop lectures with automated status tracking.

---

## 🛠️ Tech Stack

- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/)
- **UI Library**: [React 19](https://reactjs.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Notifications**: [Sonner](https://sonner.emilkowal.ski/)
- **QR Generation**: [qrcode.react](https://www.npmjs.com/package/qrcode.react)
- **Language**: TypeScript

---

## 🚀 Getting Started

### Prerequisites

- Node.js 20+ 
- npm / yarn / pnpm

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-repo/hodor.git
   cd hodor
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📂 Project Structure

```bash
src/
├── app/               # Next.js App Router (Pages & Layouts)
│   ├── [uid]/         # Student self-editing portal
│   ├── all-data/      # Admin data visualization
│   └── login/         # Secure entry point
├── components/        # Reusable UI components (Modals, Navbar, etc.)
├── hooks/             # Custom React hooks for logic
└── context/           # State management providers
```

---

## 🤝 The Devora Team

This project is developed with ❤️ by the **Devora Team** at **OTU** as part of the Embedded Systems curriculum.

- **Frontend**: Next.js & React 19
- **Backend**: PHP (Porting soon)
- **Hardware**: RFID Module & Embedded Controllers (Details coming soon)

---

## 📄 License

Internal University Project - OTU.

---

> [!NOTE]
> This is the **Frontend** repository. Integration with the hardware and backend services is currently in progress.
