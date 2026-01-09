// ERD 다이어그램 생성
function createERD() {
    const svg = document.getElementById('erd-diagram');
    const ns = 'http://www.w3.org/2000/svg';

    // 테이블 정의
    const tables = {
        students: {
            x: 50,
            y: 50,
            width: 280,
            title: '학생 (students)',
            fields: [
                { name: 'id', type: 'text', key: 'PK' },
                { name: 'student_number', type: 'text' },
                { name: 'name', type: 'text' },
                { name: 'major', type: 'text' },
                { name: 'grade', type: 'number' },
                { name: 'email', type: 'text' }
            ]
        },
        professors: {
            x: 850,
            y: 50,
            width: 300,
            title: '교수 (professors)',
            fields: [
                { name: 'id', type: 'text', key: 'PK' },
                { name: 'professor_number', type: 'text' },
                { name: 'name', type: 'text' },
                { name: 'department', type: 'text' },
                { name: 'position', type: 'text' },
                { name: 'email', type: 'text' }
            ]
        },
        courses: {
            x: 850,
            y: 400,
            width: 300,
            title: '과목 (courses)',
            fields: [
                { name: 'id', type: 'text', key: 'PK' },
                { name: 'course_code', type: 'text' },
                { name: 'course_name', type: 'text' },
                { name: 'professor_id', type: 'text', key: 'FK' },
                { name: 'credits', type: 'number' },
                { name: 'semester', type: 'text' },
                { name: 'max_students', type: 'number' }
            ]
        },
        enrollments: {
            x: 420,
            y: 400,
            width: 320,
            title: '수강신청내역 (enrollments)',
            fields: [
                { name: 'id', type: 'text', key: 'PK' },
                { name: 'student_id', type: 'text', key: 'FK' },
                { name: 'course_id', type: 'text', key: 'FK' },
                { name: 'enrollment_date', type: 'datetime' },
                { name: 'status', type: 'text' },
                { name: 'grade', type: 'text' }
            ]
        }
    };

    // 테이블 그리기
    Object.entries(tables).forEach(([key, table]) => {
        const headerHeight = 40;
        const fieldHeight = 30;
        const totalHeight = headerHeight + (table.fields.length * fieldHeight);

        // 테이블 배경
        const rect = document.createElementNS(ns, 'rect');
        rect.setAttribute('x', table.x);
        rect.setAttribute('y', table.y);
        rect.setAttribute('width', table.width);
        rect.setAttribute('height', totalHeight);
        rect.setAttribute('class', 'table-box');
        rect.setAttribute('rx', '8');
        svg.appendChild(rect);

        // 헤더
        const headerRect = document.createElementNS(ns, 'rect');
        headerRect.setAttribute('x', table.x);
        headerRect.setAttribute('y', table.y);
        headerRect.setAttribute('width', table.width);
        headerRect.setAttribute('height', headerHeight);
        headerRect.setAttribute('class', 'table-header');
        headerRect.setAttribute('rx', '8');
        svg.appendChild(headerRect);

        // 헤더 아래쪽 직사각형 (둥근 모서리 제거)
        const headerBottom = document.createElementNS(ns, 'rect');
        headerBottom.setAttribute('x', table.x);
        headerBottom.setAttribute('y', table.y + headerHeight - 8);
        headerBottom.setAttribute('width', table.width);
        headerBottom.setAttribute('height', 8);
        headerBottom.setAttribute('class', 'table-header');
        svg.appendChild(headerBottom);

        // 테이블 제목
        const title = document.createElementNS(ns, 'text');
        title.setAttribute('x', table.x + table.width / 2);
        title.setAttribute('y', table.y + 26);
        title.setAttribute('text-anchor', 'middle');
        title.setAttribute('class', 'table-title');
        title.textContent = table.title;
        svg.appendChild(title);

        // 필드 그리기
        table.fields.forEach((field, index) => {
            const fieldY = table.y + headerHeight + (index * fieldHeight);

            // 필드 배지 (PK, FK)
            if (field.key) {
                const badgeWidth = 35;
                const badgeHeight = 20;
                const badgeX = table.x + 10;
                const badgeY = fieldY + 5;

                const badge = document.createElementNS(ns, 'rect');
                badge.setAttribute('x', badgeX);
                badge.setAttribute('y', badgeY);
                badge.setAttribute('width', badgeWidth);
                badge.setAttribute('height', badgeHeight);
                badge.setAttribute('class', field.key === 'PK' ? 'pk-rect' : 'fk-rect');
                badge.setAttribute('rx', '3');
                svg.appendChild(badge);

                const badgeText = document.createElementNS(ns, 'text');
                badgeText.setAttribute('x', badgeX + badgeWidth / 2);
                badgeText.setAttribute('y', badgeY + 14);
                badgeText.setAttribute('text-anchor', 'middle');
                badgeText.setAttribute('class', field.key === 'PK' ? 'pk-badge' : 'fk-badge');
                badgeText.textContent = field.key;
                svg.appendChild(badgeText);
            }

            // 필드 이름
            const fieldText = document.createElementNS(ns, 'text');
            fieldText.setAttribute('x', table.x + (field.key ? 55 : 15));
            fieldText.setAttribute('y', fieldY + 20);
            fieldText.setAttribute('class', 'field-text');
            fieldText.textContent = `${field.name}: ${field.type}`;
            svg.appendChild(fieldText);
        });
    });

    // 관계선 그리기
    // 1. professors -> courses (1:N)
    drawRelationLine(
        1000, // professors 중간 x
        tables.professors.y + 40 + (tables.professors.fields.length * 30), // professors 하단 y
        1000, // courses 중간 x
        tables.courses.y, // courses 상단 y
        '1',
        'N'
    );

    // 2. students -> enrollments (1:N)
    drawRelationLine(
        tables.students.x + tables.students.width / 2, // students 중간 x
        tables.students.y + 40 + (tables.students.fields.length * 30), // students 하단 y
        tables.enrollments.x + tables.enrollments.width / 2, // enrollments 중간 x
        tables.enrollments.y, // enrollments 상단 y
        '1',
        'N'
    );

    // 3. enrollments -> courses (N:1)
    drawRelationLine(
        tables.enrollments.x + tables.enrollments.width, // enrollments 오른쪽 x
        tables.enrollments.y + 100, // enrollments 중간 y
        tables.courses.x, // courses 왼쪽 x
        tables.courses.y + 100, // courses 중간 y
        'N',
        '1'
    );

    function drawRelationLine(x1, y1, x2, y2, card1, card2) {
        // 선 그리기
        const line = document.createElementNS(ns, 'path');
        const midY = (y1 + y2) / 2;
        
        let pathData;
        if (x1 === x2) {
            // 수직선
            pathData = `M ${x1} ${y1} L ${x2} ${y2}`;
        } else {
            // 수평선 포함
            pathData = `M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`;
        }
        
        line.setAttribute('d', pathData);
        line.setAttribute('class', 'relation-line');
        svg.appendChild(line);

        // 카디널리티 표시
        const card1Text = document.createElementNS(ns, 'text');
        card1Text.setAttribute('x', x1 + 10);
        card1Text.setAttribute('y', y1 + 20);
        card1Text.setAttribute('class', 'cardinality-text');
        card1Text.textContent = card1;
        svg.appendChild(card1Text);

        const card2Text = document.createElementNS(ns, 'text');
        card2Text.setAttribute('x', x2 + 10);
        card2Text.setAttribute('y', y2 - 5);
        card2Text.setAttribute('class', 'cardinality-text');
        card2Text.textContent = card2;
        svg.appendChild(card2Text);
    }
}

// ERD 초기화
document.addEventListener('DOMContentLoaded', createERD);
