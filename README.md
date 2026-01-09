# 📊 MySQL Viewer & ERD Learning Tool

<div align="center">

[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react&logoColor=white)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3.5-38B2AC?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Framer Motion](https://img.shields.io/badge/Framer_Motion-10.16.5-ff69b4?logo=framer&logoColor=white)](https://www.framer.com/motion/)
[![License](https://img.shields.io/badge/License-Educational-green.svg)](LICENSE)

**데이터베이스 설계와 ERD를 쉽고 아름답게 배워보세요!**  
본 프로젝트는 학생과 입문자를 위한 시맨틱 데이터베이스 구조 시각화 및 학습 도구입니다.

[시작하기](#-시작하기) • [주요 기능](#-주요-기능) • [기술 스택](#-사용-기술) • [교육용 자료](#-교육적-활용)

</div>

---

## ✨ 주요 기능

이 도구는 단순한 데이터 뷰어를 넘어, 관계형 데이터베이스의 핵심 개념을 시각적으로 전달합니다.

- **🎨 3가지 테마 지원**: Dark, Light, Gray 테마를 지원하여 사용자 취향에 맞는 매끄러운 UI를 제공합니다.
- **🗺️ 인터랙티브 ERD 다이어그램**: SVG 기반으로 구현된 다이어그램을 통해 테이블 간의 관계(PK, FK)를 한눈에 파악할 수 있습니다.
- **🔍 스키마 익스플로러**: 각 테이블의 상세 컬럼 타입, 제약 조건(Null 여부, Key 등)을 아름다운 표 형식으로 확인합니다.
- **📊 데이터 실시간 미리보기**: PHP API와 연동하여 실제 DB에 담긴 데이터를 즉시 확인하고, **CSV 파일로 내보낼 수 있습니다.**
- **🔐 관리자 모드**: 보안 비밀번호를 통해 모든 데이터베이스에 접근할 수 있는 관리 기능을 제공합니다.

---

## 🚀 시작하기

### 사전 준비
- Node.js (v16 이상 권장)
- PHP 서버 (API 구동용)
- MySQL 데이터베이스

### 실행 방법
1. **레포지토리 클론**
   ```bash
   git clone https://github.com/jvisualschool/erd-tool.git
   cd erd-tool/app
   ```

2. **의존성 설치**
   ```bash
   npm install
   ```

3. **개발 서버 실행**
   ```bash
   npm run dev
   ```

4. **빌드 (배포용)**
   ```bash
   npm run build
   ```

---

## 🛠️ 사용 기술

현대적인 웹 기술을 사용하여 빠르고 유연한 사용자 경험을 제공합니다.

- **Frontend**: `React 18`, `Vite`, `Tailwind CSS`, `Framer Motion`
- **Icons**: `Lucide React`, `Font Awesome`
- **Backend (API)**: `PHP`, `MySQL`
- **Visualization**: `SVG` (Custom ERD Engine)

---

## 📂 프로젝트 구조

```text
/
├── app/                  # React + Vite 프론트엔드 소스
│   ├── src/              # 주요 로직 및 UI 컴포넌트
│   ├── public/           # 정적 에셋
│   └── tailwind.config.js # 디자인 시스템 설정
├── api/                  # PHP API 엔드포인트
├── setup_db.sql          # 데이터베이스 초기화 스크립트
└── README.md             # 프로젝트 가이드
```

---

## 📖 교육적 활용

대학교 수강신청 시스템 예제를 통해 다음과 같은 개념을 학습할 수 있습니다.

### 1. 관계의 이해
- **교수 → 과목 (1:N)**: 한 명의 교수가 여러 과목을 가르치는 구조
- **학생 ↔ 과목 (N:M)**: 수강신청(`enrollments`) 테이블을 통한 다대다 관계 해결

### 2. 키(Key) 개념
- **Primary Key (PK)**: 데이터의 유일성을 보장하는 핵심 키
- **Foreign Key (FK)**: 테이블 간의 연결 고리가 되는 외래 키

---

## 👨‍🏫 제작자 정보

**Jinho Jung (정작가)**
- *교수, 디자이너, 일러스트레이터, 작가*
- 📧 [jvisualschool@gmail.com](mailto:jvisualschool@gmail.com)
- 🌐 [jvisualschool.com](https://www.jvisualschool.com/)

---

<div align="center">
    <p>본 프로젝트는 교육 목적으로 자유롭게 사용 가능합니다.</p>
    <p><b>© 2026 MySQL Viewer. All rights reserved.</b></p>
</div>
