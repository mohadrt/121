// ======== إدارة المهام ========

// تحديد المهام المحفوظة
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// تحديد الفرق المحفوظة
let teams = JSON.parse(localStorage.getItem('teams')) || [
    { id: 'team1', name: 'الفريق 1', members: ['أحمد محمد', 'علي أحمد'], leader: 'أحمد محمد' },
    { id: 'team2', name: 'الفريق 2', members: ['فاطمة علي', 'سارة خالد'], leader: 'فاطمة علي' },
    { id: 'team3', name: 'الفريق 3', members: ['محمد سعيد', 'نورا حسن'], leader: 'محمد سعيد' }
];

// تحديد المستخدمين المحفوظين
let users = JSON.parse(localStorage.getItem('users')) || [
    { id: 'user1', name: 'أحمد محمد', role: 'admin', team: 'team1' },
    { id: 'user2', name: 'علي أحمد', role: 'technician', team: 'team1' },
    { id: 'user3', name: 'فاطمة علي', role: 'admin', team: 'team2' },
    { id: 'user4', name: 'سارة خالد', role: 'technician', team: 'team2' },
    { id: 'user5', name: 'محمد سعيد', role: 'admin', team: 'team3' },
    { id: 'user6', name: 'نورا حسن', role: 'technician', team: 'team3' }
];

// دالة لإنشاء معرف فريد
function generateId() {
    return 'id_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

// دالة لتحديث إحصائيات المهام
function updateTaskStats() {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;
    const receivedTasks = tasks.filter(task => task.status === 'received').length;

    document.getElementById('totalTasksCount').textContent = totalTasks;
    document.getElementById('completedTasksCount').textContent = completedTasks;
    document.getElementById('inProgressTasksCount').textContent = inProgressTasks;
    document.getElementById('receivedTasksCount').textContent = receivedTasks;
}

// دالة لعرض المهام في الجدول
function displayTasks(filteredTasks = null) {
    const tasksToDisplay = filteredTasks || tasks;
    const tasksTableBody = document.getElementById('tasksTableBody');
    tasksTableBody.innerHTML = '';

    tasksToDisplay.forEach(task => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${task.title}</td>
            <td><span class="task-type ${task.type}">${getTaskTypeText(task.type)}</span></td>
            <td>${getTeamName(task.team)}</td>
            <td>${task.date}</td>
            <td><span class="task-status ${task.status}">${getTaskStatusText(task.status)}</span></td>
            <td>
                <button class="btn-icon" onclick="viewTaskDetails('${task.id}')"><i class="fas fa-eye"></i></button>
                <button class="btn-icon" onclick="editTask('${task.id}')"><i class="fas fa-edit"></i></button>
                <button class="btn-icon" onclick="deleteTask('${task.id}')"><i class="fas fa-trash"></i></button>
            </td>
        `;
        tasksTableBody.appendChild(row);
    });
}

// دالة لعرض المهام حسب الفريق
function displayTasksByTeam() {
    const teamsContainer = document.querySelector('.teams-container');
    teamsContainer.innerHTML = '';

    teams.forEach(team => {
        const teamTasks = tasks.filter(task => task.team === team.id);
        const teamDiv = document.createElement('div');
        teamDiv.className = 'team-card';
        teamDiv.innerHTML = `
            <div class="team-header">
                <h4>${team.name}</h4>
                <p>الأعضاء: ${team.members.join(', ')}</p>
            </div>
            <div class="team-tasks">
                ${teamTasks.length > 0 ? teamTasks.map(task => `
                    <div class="team-task">
                        <div class="task-info">
                            <h5>${task.title}</h5>
                            <p>${task.description}</p>
                        </div>
                        <div class="task-status">
                            <span class="task-status ${task.status}">${getTaskStatusText(task.status)}</span>
                        </div>
                    </div>
                `).join('') : '<p>لا توجد مهام مسندة لهذا الفريق</p>'}
            </div>
        `;
        teamsContainer.appendChild(teamDiv);
    });
}

// دالة للحصول على نص نوع المهمة
function getTaskTypeText(type) {
    switch(type) {
        case 'critical': return 'ضروري جداً';
        case 'important': return 'ضروري';
        case 'normal': return 'عادي';
        default: return type;
    }
}

// دالة للحصول على نص حالة المهمة
function getTaskStatusText(status) {
    switch(status) {
        case 'received': return 'تم الاستلام';
        case 'in-progress': return 'قيد التنفيذ';
        case 'completed': return 'منجز';
        default: return status;
    }
}

// دالة للحصول على اسم الفريق
function getTeamName(teamId) {
    const team = teams.find(t => t.id === teamId);
    return team ? team.name : 'غير محدد';
}

// دالة لفلترة المهام
function filterTasks() {
    const typeFilter = document.getElementById('taskTypeFilter').value;
    const statusFilter = document.getElementById('taskStatusFilter').value;
    const teamFilter = document.getElementById('teamFilter').value;

    let filteredTasks = tasks;

    if (typeFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.type === typeFilter);
    }

    if (statusFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.status === statusFilter);
    }

    if (teamFilter !== 'all') {
        filteredTasks = filteredTasks.filter(task => task.team === teamFilter);
    }

    displayTasks(filteredTasks);
}

// دالة لإنشاء مهمة جديدة
function createTask(taskData) {
    const newTask = {
        id: generateId(),
        title: taskData.title,
        description: taskData.description,
        type: taskData.type,
        team: taskData.team,
        date: new Date().toISOString().split('T')[0],
        status: 'received',
        notes: taskData.notes || '',
        assignedTo: taskData.assignedTo || '',
        priority: taskData.priority || 'medium'
    };

    tasks.push(newTask);
    saveTasks();
    updateTaskStats();
    displayTasks();
    displayTasksByTeam();

    // إشعار بإنشاء المهمة
    showNotification('تم إنشاء المهمة بنجاح', 'success');
}

// دالة لتحديث حالة المهمة
function updateTaskStatus(taskId, newStatus) {
    const taskIndex = tasks.findIndex(task => task.id === taskId);
    if (taskIndex !== -1) {
        tasks[taskIndex].status = newStatus;
        saveTasks();
        updateTaskStats();
        displayTasks();
        displayTasksByTeam();

        // إذا كانت المهمة منجزة، نضيف ملاحظة
        if (newStatus === 'completed') {
            const notes = prompt('أضف ملاحظات عن المهمة المنجزة:');
            if (notes) {
                tasks[taskIndex].notes = notes;
                saveTasks();
            }
        }

        showNotification('تم تحديث حالة المهمة بنجاح', 'success');
    }
}

// دالة لحذف مهمة
function deleteTask(taskId) {
    if (confirm('هل أنت متأكد من حذف هذه المهمة؟')) {
        tasks = tasks.filter(task => task.id !== taskId);
        saveTasks();
        updateTaskStats();
        displayTasks();
        displayTasksByTeam();
        showNotification('تم حذف المهمة بنجاح', 'success');
    }
}

// دالة لعرض تفاصيل المهمة
function viewTaskDetails(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        alert(`عنوان المهمة: ${task.title}\nالوصف: ${task.description}\nالنوع: ${getTaskTypeText(task.type)}\nالفريق: ${getTeamName(task.team)}\nالتاريخ: ${task.date}\nالحالة: ${getTaskStatusText(task.status)}\nالملاحظات: ${task.notes || 'لا توجد ملاحظات'}`);
    }
}

// دالة لتحرير مهمة
function editTask(taskId) {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
        // هنا يمكنك فتح نافذة تحرير المهمة
        const newTitle = prompt('عنوان المهمة:', task.title);
        if (newTitle) {
            task.title = newTitle;
            saveTasks();
            displayTasks();
            displayTasksByTeam();
            showNotification('تم تحديث المهمة بنجاح', 'success');
        }
    }
}

// دالة لحفظ المهام في التخزين المحلي
function saveTasks() {
    localStorage.setItem('tasks', JSON.stringify(tasks));
}

// دالة لعرض إشعار
function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 3000);
}

// دالة لتصدير المهام إلى Google Sheets
function exportToGoogleSheets() {
    // محاكاة تصدير إلى Google Sheets
    const exportData = {
        tasks: tasks,
        teams: teams,
        exportDate: new Date().toISOString(),
        retentionPeriod: 'يومان'
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    const exportFileDefaultName = `tasks_export_${new Date().toISOString().split('T')[0]}.json`;

    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();

    showNotification('تم تصدير البيانات بنجاح', 'success');
}

// تهيء الواجهة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    // تحديث الإحصائيات
    updateTaskStats();

    // عرض المهام
    displayTasks();
    displayTasksByTeam();

    // إضافة أحداث للفلتر
    document.getElementById('taskTypeFilter').addEventListener('change', filterTasks);
    document.getElementById('taskStatusFilter').addEventListener('change', filterTasks);
    document.getElementById('teamFilter').addEventListener('change', filterTasks);

    // إضافة حدث لزر إنشاء المهمة
    document.getElementById('createTaskBtn').addEventListener('click', function() {
        // فتح نافذة إنشاء المهمة
        document.getElementById('createTaskModal').classList.remove('hidden');
    });

    // إضافة حدث لإغلاق نافذة إنشاء المهمة
    document.getElementById('closeCreateTaskModal').addEventListener('click', function() {
        document.getElementById('createTaskModal').classList.add('hidden');
    });

    // إضافة حدث لنموذج إنشاء المهمة
    document.getElementById('createTaskForm').addEventListener('submit', function(e) {
        e.preventDefault();

        const taskData = {
            title: document.getElementById('taskTitle').value,
            description: document.getElementById('taskDescription').value,
            type: document.getElementById('taskType').value,
            team: document.getElementById('taskTeam').value,
            assignedTo: document.getElementById('taskAssignedTo').value,
            priority: document.getElementById('taskPriority').value,
            notes: document.getElementById('taskNotes').value
        };

        createTask(taskData);
        document.getElementById('createTaskModal').classList.add('hidden');
        document.getElementById('createTaskForm').reset();
    });

    // إضافة حدث لزر تصدير المهام
    document.getElementById('exportTasksBtn').addEventListener('click', exportToGoogleSheets);

    // إضافة حدث لخروج المستخدم
    const logoutBtn = document.querySelector('.logout a');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // مسح بيانات المستخدم
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');

            // الانت إلى شاشة تسجيل الدخول
            document.getElementById('appScreen').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
        }
    });
});
