document.addEventListener('DOMContentLoaded', function() {
    // Initialize test users if none exist
    initializeTestUsers();
    
    // Check authentication
    const currentUser = checkAuthentication();
    if (!currentUser) return;

    // Dashboard initialization
    initDashboard(currentUser);
    
    // Setup event listeners
    setupEventListeners();
});

function initializeTestUsers() {
    if (!localStorage.getItem('users')) {
        const testUsers = [
            {
                id: 1,
                name: "John Doe",
                email: "john@example.com",
                username: "johndoe",
                password: "John1234",
                role: "student",
                joined: "2023-10-01",
                status: "active",
                courses: [1, 3]
            },
            {
                id: 2,
                name: "Jane Smith",
                email: "jane@example.com",
                username: "janesmith",
                password: "Jane1234",
                role: "student",
                joined: "2023-10-05",
                status: "active",
                courses: [2]
            },
            {
                id: 3,
                name: "Admin User",
                email: "admin@example.com",
                username: "admin",
                password: "Admin1234",
                role: "admin",
                joined: "2023-09-15",
                status: "active",
                courses: []
            }
        ];
        localStorage.setItem('users', JSON.stringify(testUsers));
    }

    if (!localStorage.getItem('courses')) {
        const courses = [
            {
                id: 1,
                title: "Introduction to JavaScript",
                instructor: "Dr. Sarah Johnson",
                duration: "6 weeks",
                progress: 65,
                nextDeadline: "2023-11-15"
            },
            {
                id: 2,
                title: "Data Science Fundamentals",
                instructor: "Prof. Michael Chen",
                duration: "8 weeks",
                progress: 30,
                nextDeadline: "2023-11-20"
            },
            {
                id: 3,
                title: "Web Development Bootcamp",
                instructor: "Alex Rodriguez",
                duration: "12 weeks",
                progress: 15,
                nextDeadline: "2023-11-10"
            }
        ];
        localStorage.setItem('courses', JSON.stringify(courses));
    }
}

function checkAuthentication() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (!currentUser) {
        window.location.href = 'login.html';
        return null;
    }
    return currentUser;
}

function initDashboard(currentUser) {
    // Load user data
    loadUserProfile(currentUser);
    
    // Load dashboard stats
    loadDashboardStats(currentUser);
    
    // Load recent activity
    loadRecentActivity();
    
    // Load student list (for admin)
    if (currentUser.role === 'admin') {
        loadStudentList();
    }
    
    // Load upcoming deadlines
    loadUpcomingDeadlines(currentUser);
}

function loadUserProfile(user) {
    document.getElementById('userName').textContent = user.name;
    document.getElementById('userEmail').textContent = user.email;
    document.getElementById('welcomeName').textContent = user.name.split(' ')[0] || 'there';
    
    // Set avatar based on first letter of name
    const avatar = document.getElementById('userAvatar');
    if (avatar) {
        const initial = user.name.charAt(0).toUpperCase();
        avatar.textContent = initial;
        avatar.style.backgroundColor = getRandomColor();
    }
}

function getRandomColor() {
    const colors = ['#4361ee', '#3f37c9', '#4cc9f0', '#4895ef', '#560bad'];
    return colors[Math.floor(Math.random() * colors.length)];
}

function loadDashboardStats(user) {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    
    // For students
    if (user.role === 'student') {
        document.getElementById('enrolledCourses').textContent = user.courses?.length || 0;
        
        const completed = Math.floor(Math.random() * user.courses?.length);
        document.getElementById('completedCourses').textContent = completed;
        document.getElementById('inProgressCourses').textContent = (user.courses?.length || 0) - completed;
        
        document.getElementById('certificatesEarned').textContent = completed > 0 ? completed - 1 : 0;
    } 
    // For admin
    else {
        document.getElementById('enrolledCourses').textContent = users.filter(u => u.role === 'student').length;
        document.getElementById('completedCourses').textContent = courses.length;
        document.getElementById('inProgressCourses').textContent = users.reduce((acc, user) => acc + (user.courses?.length || 0), 0);
        document.getElementById('certificatesEarned').textContent = users.length * 2; // Mock data
    }
}

function loadRecentActivity() {
    const activities = [
        { icon: 'fas fa-book', title: 'Started new course', description: 'Advanced React', time: '2 hours ago' },
        { icon: 'fas fa-check-circle', title: 'Completed lesson', description: 'Node.js Basics', time: '1 day ago' },
        { icon: 'fas fa-comment', title: 'Posted in forum', description: 'Question about state management', time: '2 days ago' },
        { icon: 'fas fa-certificate', title: 'Earned certificate', description: 'JavaScript Fundamentals', time: '1 week ago' }
    ];
    
    const activityList = document.getElementById('activityList');
    activityList.innerHTML = '';
    
    activities.forEach(activity => {
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="activity-icon">
                <i class="${activity.icon}"></i>
            </div>
            <div class="activity-info">
                <h4>${activity.title}</h4>
                <p>${activity.description} • ${activity.time}</p>
            </div>
        `;
        activityList.appendChild(li);
    });
}

function loadStudentList() {
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const students = users.filter(user => user.role === 'student');
    const studentsTable = document.getElementById('studentsTable')?.getElementsByTagName('tbody')[0];
    
    if (!studentsTable) return;
    
    studentsTable.innerHTML = '';
    
    students.forEach(student => {
        const row = studentsTable.insertRow();
        row.innerHTML = `
            <td>${student.id}</td>
            <td>${student.name}</td>
            <td>${student.email}</td>
            <td>${student.username}</td>
            <td>${formatDate(student.joined)}</td>
            <td><span class="status ${student.status}">${student.status.charAt(0).toUpperCase() + student.status.slice(1)}</span></td>
        `;
    });
}

function loadUpcomingDeadlines(user) {
    const courses = JSON.parse(localStorage.getItem('courses')) || [];
    let userCourses = [];
    
    if (user.role === 'student') {
        userCourses = courses.filter(course => user.courses?.includes(course.id));
    } else {
        userCourses = [...courses].sort(() => 0.5 - Math.random()).slice(0, 3);
    }
    
    const deadlineList = document.getElementById('deadlineList');
    if (!deadlineList) return;
    
    deadlineList.innerHTML = '';
    
    userCourses.forEach(course => {
        const deadlineDate = new Date(course.nextDeadline);
        const li = document.createElement('li');
        li.innerHTML = `
            <div class="deadline-date">
                <span>${deadlineDate.getDate()}</span>
                <span>${deadlineDate.toLocaleString('default', { month: 'short' })}</span>
            </div>
            <div class="deadline-info">
                <h4>${course.title}</h4>
                <p>${course.instructor}</p>
            </div>
            <div class="deadline-progress">
                <div class="progress-text">${course.progress}% complete</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${course.progress}%"></div>
                </div>
            </div>
        `;
        deadlineList.appendChild(li);
    });
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

function setupEventListeners() {
    // Logout button
    document.getElementById('logoutBtn')?.addEventListener('click', function(e) {
        e.preventDefault();
        localStorage.removeItem('currentUser');
        window.location.href = 'login.html';
    });
    
    // Mobile menu toggle (if needed)
    document.querySelector('.hamburger')?.addEventListener('click', function() {
        document.querySelector('.sidebar').classList.toggle('active');
    });
}