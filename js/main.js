// 탭 전환 기능
document.addEventListener('DOMContentLoaded', function() {
    // 탭 버튼 이벤트
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.getAttribute('data-tab');

            // 모든 탭 비활성화
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));

            // 선택된 탭 활성화
            button.classList.add('active');
            document.getElementById(`${targetTab}-tab`).classList.add('active');
        });
    });

    // 스키마 탭 로드
    loadSchemas();

    // 데이터 탭 로드
    loadData();
});

// 테이블 스키마 로드
async function loadSchemas() {
    const container = document.getElementById('schema-container');
    
    const schemas = {
        students: {
            icon: 'fa-user-graduate',
            title: '학생 (students)',
            description: '학생 정보를 관리하는 테이블',
            fields: [
                { name: 'id', type: 'text', key: 'PK', description: '학생 고유 ID' },
                { name: 'student_number', type: 'text', key: '', description: '학번' },
                { name: 'name', type: 'text', key: '', description: '학생 이름' },
                { name: 'major', type: 'text', key: '', description: '전공' },
                { name: 'grade', type: 'number', key: '', description: '학년 (1-4)' },
                { name: 'email', type: 'text', key: '', description: '이메일 주소' }
            ]
        },
        professors: {
            icon: 'fa-chalkboard-teacher',
            title: '교수 (professors)',
            description: '교수 정보를 관리하는 테이블',
            fields: [
                { name: 'id', type: 'text', key: 'PK', description: '교수 고유 ID' },
                { name: 'professor_number', type: 'text', key: '', description: '교번' },
                { name: 'name', type: 'text', key: '', description: '교수 이름' },
                { name: 'department', type: 'text', key: '', description: '소속 학과' },
                { name: 'position', type: 'text', key: '', description: '직급 (조교수/부교수/정교수)' },
                { name: 'email', type: 'text', key: '', description: '이메일 주소' }
            ]
        },
        courses: {
            icon: 'fa-book',
            title: '과목 (courses)',
            description: '개설 과목 정보를 관리하는 테이블',
            fields: [
                { name: 'id', type: 'text', key: 'PK', description: '과목 고유 ID' },
                { name: 'course_code', type: 'text', key: '', description: '과목 코드 (예: CS101)' },
                { name: 'course_name', type: 'text', key: '', description: '과목명' },
                { name: 'professor_id', type: 'text', key: 'FK', description: '담당 교수 ID (professors.id 참조)' },
                { name: 'credits', type: 'number', key: '', description: '학점' },
                { name: 'semester', type: 'text', key: '', description: '개설 학기' },
                { name: 'max_students', type: 'number', key: '', description: '최대 수강 인원' }
            ]
        },
        enrollments: {
            icon: 'fa-clipboard-list',
            title: '수강신청내역 (enrollments)',
            description: '학생의 수강신청 정보를 관리하는 중간 테이블',
            fields: [
                { name: 'id', type: 'text', key: 'PK', description: '수강신청 고유 ID' },
                { name: 'student_id', type: 'text', key: 'FK', description: '학생 ID (students.id 참조)' },
                { name: 'course_id', type: 'text', key: 'FK', description: '과목 ID (courses.id 참조)' },
                { name: 'enrollment_date', type: 'datetime', key: '', description: '수강신청 날짜' },
                { name: 'status', type: 'text', key: '', description: '수강 상태 (신청완료/수강중/완료/취소)' },
                { name: 'grade', type: 'text', key: '', description: '성적 (A+, A, B+, ...)' }
            ]
        }
    };

    Object.entries(schemas).forEach(([key, schema]) => {
        const card = document.createElement('div');
        card.className = 'schema-card';
        
        let fieldsHTML = schema.fields.map(field => `
            <tr>
                <td>
                    ${field.key ? `<span class="badge badge-${field.key.toLowerCase()}">${field.key}</span>` : ''}
                    <strong>${field.name}</strong>
                </td>
                <td><span class="badge badge-type">${field.type}</span></td>
                <td>${field.description}</td>
            </tr>
        `).join('');

        card.innerHTML = `
            <h3><i class="fas ${schema.icon}"></i> ${schema.title}</h3>
            <p style="color: var(--text-secondary); margin-bottom: 1rem;">${schema.description}</p>
            <table class="schema-table">
                <thead>
                    <tr>
                        <th>컬럼명</th>
                        <th>타입</th>
                        <th>설명</th>
                    </tr>
                </thead>
                <tbody>
                    ${fieldsHTML}
                </tbody>
            </table>
        `;
        
        container.appendChild(card);
    });
}

// 테이블 데이터 로드
async function loadData() {
    const container = document.getElementById('data-container');
    
    const tables = [
        { name: 'students', title: '학생 (students)', icon: 'fa-user-graduate' },
        { name: 'professors', title: '교수 (professors)', icon: 'fa-chalkboard-teacher' },
        { name: 'courses', title: '과목 (courses)', icon: 'fa-book' },
        { name: 'enrollments', title: '수강신청내역 (enrollments)', icon: 'fa-clipboard-list' }
    ];

    for (const table of tables) {
        try {
            const response = await fetch(`tables/${table.name}?limit=100`);
            const result = await response.json();
            
            if (result.data && result.data.length > 0) {
                const wrapper = document.createElement('div');
                wrapper.className = 'data-table-wrapper';
                
                // 테이블 헤더
                const caption = document.createElement('div');
                caption.className = 'table-caption';
                caption.innerHTML = `<i class="fas ${table.icon}"></i> ${table.title} <span style="color: var(--text-secondary); font-size: 0.9rem; font-weight: normal;">(${result.data.length}건)</span>`;
                wrapper.appendChild(caption);
                
                // 테이블 생성
                const dataTable = document.createElement('table');
                dataTable.className = 'data-table';
                
                // 컬럼명 추출 (시스템 필드 제외)
                const systemFields = ['gs_project_id', 'gs_table_name', 'created_at', 'updated_at'];
                const columns = Object.keys(result.data[0]).filter(col => !systemFields.includes(col));
                
                // 헤더 생성
                const thead = document.createElement('thead');
                const headerRow = document.createElement('tr');
                columns.forEach(col => {
                    const th = document.createElement('th');
                    th.textContent = col;
                    headerRow.appendChild(th);
                });
                thead.appendChild(headerRow);
                dataTable.appendChild(thead);
                
                // 바디 생성
                const tbody = document.createElement('tbody');
                result.data.forEach(row => {
                    const tr = document.createElement('tr');
                    columns.forEach(col => {
                        const td = document.createElement('td');
                        let value = row[col];
                        
                        // 날짜 포맷팅
                        if (col.includes('date') && value) {
                            value = new Date(value).toLocaleString('ko-KR');
                        }
                        
                        td.textContent = value || '-';
                        tr.appendChild(td);
                    });
                    tbody.appendChild(tr);
                });
                dataTable.appendChild(tbody);
                
                wrapper.appendChild(dataTable);
                container.appendChild(wrapper);
            }
        } catch (error) {
            console.error(`Error loading ${table.name}:`, error);
        }
    }
}

// 테이블 새로고침 함수
async function refreshData() {
    const container = document.getElementById('data-container');
    container.innerHTML = '<p style="text-align: center; padding: 2rem;">데이터를 불러오는 중...</p>';
    await loadData();
}
