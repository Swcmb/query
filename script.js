class StudentQuerySystem {
    constructor() {
        this.studentData = [];
        this.init();
    }

    async init() {
        await this.loadData();
        this.bindEvents();
    }

    async loadData() {
        try {
            const response = await fetch('students.csv');
            const csvText = await response.text();
            this.parseCSV(csvText);
        } catch (error) {
            console.error('加载数据失败:', error);
            this.showError('数据加载失败，请刷新页面重试');
        }
    }

    parseCSV(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        this.studentData = [];
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            if (values.length >= 2) {
                this.studentData.push({
                    studentId: values[0],
                    rank: parseInt(values[1]),
                    name: values[2] || '',
                    score: values[3] || '',
                    passed: values[4] || '未知'
                });
            }
        }
        
        // 按排名排序
        this.studentData.sort((a, b) => a.rank - b.rank);
    }

    bindEvents() {
        const searchBtn = document.getElementById('searchBtn');
        const studentIdInput = document.getElementById('studentId');
        
        searchBtn.addEventListener('click', () => this.search());
        studentIdInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.search();
            }
        });
        
        // 输入框焦点效果
        studentIdInput.addEventListener('focus', () => {
            studentIdInput.parentElement.classList.add('focused');
        });
        
        studentIdInput.addEventListener('blur', () => {
            studentIdInput.parentElement.classList.remove('focused');
        });
    }

    async search() {
        const studentId = document.getElementById('studentId').value.trim();
        
        if (!studentId) {
            this.showError('请输入学号');
            return;
        }

        this.showLoading();
        
        // 模拟查询延迟
        await new Promise(resolve => setTimeout(resolve, 800));
        
        const student = this.findStudent(studentId);
        
        if (student) {
            this.showSuccess(student);
        } else {
            this.showNotFound();
        }
    }

    findStudent(studentId) {
        return this.studentData.find(student => 
            student.studentId.toLowerCase() === studentId.toLowerCase()
        );
    }

    showLoading() {
        document.getElementById('loading').classList.remove('hidden');
        document.getElementById('result').classList.add('hidden');
    }

    showSuccess(student) {
        document.getElementById('loading').classList.add('hidden');
        
        const resultBox = document.getElementById('result');
        const resultText = document.getElementById('resultText');
        
        // 根据是否通过设置不同的样式
        const isPassed = student.passed === '通过';
        resultBox.className = isPassed ? 'result-box success' : 'result-box warning';
        resultBox.classList.remove('hidden');
        
        let message = '';
        if (isPassed) {
            message = `🎉 恭喜！您已通过！<br>`;
        } else {
            message = `📋 很遗憾，您未通过<br>`;
        }
        
        message += `<div class="rank-highlight">成绩排名：第 ${student.rank} 名/共 ${this.studentData.length} 名</div>`;
        
        // 显示通过状态
        const statusIcon = isPassed ? '✅' : '❌';
        const statusText = isPassed ? '已通过' : '未通过';
        message += `<div class="status-highlight">${statusIcon} ${statusText}</div>`;
        
        if (student.name) {
            message += `姓名：${student.name}<br>`;
        }
        
        if (student.score) {
            message += `成绩：${student.score}`;
        }
        
        resultText.innerHTML = message;
    }

    showNotFound() {
        document.getElementById('loading').classList.add('hidden');
        
        const resultBox = document.getElementById('result');
        const resultText = document.getElementById('resultText');
        
        resultBox.className = 'result-box not-found';
        resultBox.classList.remove('hidden');
        
        resultText.innerHTML = '😔 抱歉，未找到该学号的成绩信息<br>请检查学号是否正确或联系管理员';
    }

    showError(message) {
        document.getElementById('loading').classList.add('hidden');
        
        const resultBox = document.getElementById('result');
        const resultText = document.getElementById('resultText');
        
        resultBox.className = 'result-box error';
        resultBox.classList.remove('hidden');
        
        resultText.innerHTML = `❌ ${message}`;
    }
}

// 页面加载完成后初始化系统
document.addEventListener('DOMContentLoaded', () => {
    new StudentQuerySystem();
});