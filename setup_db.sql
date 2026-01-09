USE ERD;

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(50) PRIMARY KEY,
    student_number VARCHAR(50),
    name VARCHAR(100),
    major VARCHAR(100),
    grade INT,
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS professors (
    id VARCHAR(50) PRIMARY KEY,
    professor_number VARCHAR(50),
    name VARCHAR(100),
    department VARCHAR(100),
    position VARCHAR(100),
    email VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS courses (
    id VARCHAR(50) PRIMARY KEY,
    course_code VARCHAR(50),
    course_name VARCHAR(100),
    professor_id VARCHAR(50),
    credits INT,
    semester VARCHAR(50),
    max_students INT,
    FOREIGN KEY (professor_id) REFERENCES professors(id)
);

CREATE TABLE IF NOT EXISTS enrollments (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50),
    course_id VARCHAR(50),
    enrollment_date DATETIME,
    status VARCHAR(50),
    grade VARCHAR(10),
    FOREIGN KEY (student_id) REFERENCES students(id),
    FOREIGN KEY (course_id) REFERENCES courses(id)
);

-- Insert sample data
INSERT IGNORE INTO professors (id, professor_number, name, department, position, email) VALUES
('P001', 'PROF001', '김철수', '컴퓨터공학과', '정교수', 'chulsoo@jvibeschool.org'),
('P002', 'PROF002', '이영희', '컴퓨터공학과', '부교수', 'younghee@jvibeschool.org'),
('P003', 'PROF003', '박민수', '소프트웨어학과', '조교수', 'minsoo@jvibeschool.org');

INSERT IGNORE INTO students (id, student_number, name, major, grade, email) VALUES
('S001', '2021001', '홍길동', '컴퓨터공학과', 3, 'gildong@jvibeschool.org'),
('S002', '2021002', '김민지', '컴퓨터공학과', 3, 'minji@jvibeschool.org'),
('S003', '2022001', '이준호', '소프트웨어학과', 2, 'junho@jvibeschool.org'),
('S004', '2022002', '최수진', '소프트웨어학과', 2, 'sujin@jvibeschool.org'),
('S005', '2023001', '정다은', '컴퓨터공학과', 1, 'daeun@jvibeschool.org');

INSERT IGNORE INTO courses (id, course_code, course_name, professor_id, credits, semester, max_students) VALUES
('C001', 'CS101', '데이터베이스 설계', 'P001', 3, '2026-1', 40),
('C002', 'CS201', '알고리즘', 'P001', 3, '2026-1', 30),
('C003', 'CS102', '웹 프로그래밍', 'P002', 3, '2026-1', 50),
('C004', 'SW301', '소프트웨어 공학', 'P003', 3, '2026-1', 35),
('C005', 'CS301', '인공지능 기초', 'P001', 3, '2026-1', 25);

INSERT IGNORE INTO enrollments (id, student_id, course_id, enrollment_date, status, grade) VALUES
('E001', 'S001', 'C001', '2026-01-09 09:00:00', '신청완료', 'A+'),
('E002', 'S001', 'C002', '2026-01-09 09:05:00', '신청완료', 'A'),
('E003', 'S002', 'C001', '2026-01-09 09:10:00', '신청완료', 'B+'),
('E004', 'S002', 'C003', '2026-01-09 09:15:00', '신청완료', 'A'),
('E005', 'S003', 'C004', '2026-01-09 09:20:00', '신청완료', 'A-'),
('E006', 'S003', 'C005', '2026-01-09 09:25:00', '신청완료', 'B'),
('E007', 'S004', 'C004', '2026-01-09 09:30:00', '신청완료', 'A+'),
('E008', 'S005', 'C001', '2026-01-09 09:35:00', '신청완료', 'C+'),
('E009', 'S005', 'C003', '2026-01-09 09:40:00', '신청완료', 'B-'),
('E010', 'S001', 'C003', '2026-01-09 09:45:00', '신청완료', 'A+');
