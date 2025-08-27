// ======== الانت بين الشاشات ========
document.addEventListener('DOMContentLoaded', function() {
    // الانت بين شاشة تسجيل الدخول والتسجيل
    document.getElementById('showRegister').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('registerScreen').classList.remove('hidden');
    });

    document.getElementById('showLogin').addEventListener('click', function(e) {
        e.preventDefault();
        document.getElementById('registerScreen').classList.add('hidden');
        document.getElementById('loginScreen').classList.remove('hidden');
    });

    // تسجيل الدخول
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        // هنا يمكنك إضافة منطق التحقق من البيانات
        if (username && password) {
            // عرض شاشة التطبيق الرئيسية
            document.getElementById('loginScreen').classList.add('hidden');
            document.getElementById('appScreen').classList.remove('hidden');

            // تحديث اسم المستخدم في شريط التنقل
            document.getElementById('userName').textContent = username;

            // تحديث اسم المستخدم في ملفات تعريف الارتباط أو التخزين المحلي
            localStorage.setItem('username', username);
            localStorage.setItem('userRole', 'user'); // يمكنك تغيير هذا حسب نوع المستخدم
        }
    });

    // التسجيل
    document.getElementById('registerForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const username = document.getElementById('regUsername').value;
        const email = document.getElementById('regEmail').value;
        const password = document.getElementById('regPassword').value;
        const confirmPassword = document.getElementById('regConfirmPassword').value;
        const userRole = document.getElementById('userRole').value;

        // التحقق من تطابق كلمتي المرور
        if (password !== confirmPassword) {
            alert('كلمتا المرور غير متطابقتين');
            return;
        }

        // هنا يمكنك إضافة منطق حفظ بيانات المستخدم
        if (username && email && password) {
            // الانت إلى شاشة تسجيل الدخول بعد التسجيل الناجح
            document.getElementById('registerScreen').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');

            // عرض رسالة نجاح
            const successMessage = document.createElement('div');
            successMessage.className = 'success-message';
            successMessage.textContent = 'تم إنشاء الحساب بنجاح! يرجى تسجيل الدخول.';
            document.querySelector('.login-container').insertBefore(successMessage, document.querySelector('.login-box'));

            // إخفاء الرسالة بعد 3 ثوانٍ
            setTimeout(() => {
                successMessage.remove();
            }, 3000);
        }
    });

    // التحقق من وجود مستخدم مسجل دخوله مسبقًا
    const savedUsername = localStorage.getItem('username');
    if (savedUsername) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('appScreen').classList.remove('hidden');
        document.getElementById('userName').textContent = savedUsername;
    }

    // ======== التنقل داخل التطبيق ========
    const menuItems = document.querySelectorAll('.sidebar-menu a[data-page]');
    const pages = document.querySelectorAll('.page');

    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetPage = this.getAttribute('data-page');

            // تحديث القائمة النشطة
            menuItems.forEach(i => i.parentElement.classList.remove('active'));
            this.parentElement.classList.add('active');

            // الانت إلى الصفحة المستهدفة
            pages.forEach(page => {
                if (page.id === targetPage + 'Page') {
                    page.classList.add('active');
                } else {
                    page.classList.remove('active');
                }
            });
        });
    });

    // ======== Toggle القائمة الجانبية على الأجهزة المحمولة ========
    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.querySelector('.main-content');

    menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        mainContent.classList.toggle('active');
    });

    // ======== إنشاء المهام ========
    const createTaskBtn = document.querySelector('.btn.primary');
    if (createTaskBtn) {
        createTaskBtn.addEventListener('click', function() {
            // هنا يمكنك إضافة منطق فتح نافذة إنشاء المهمة
            alert('سيتم فتح نافذة إنشاء المهمة');
        });
    }

    // ======== التأثيرات التفاعلية ========
    // إضافة تأثير hover على البطاقات
    const cards = document.querySelectorAll('.stat-card, .task-card, .chart-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
    });

    // ======== إضافة رسائل الإشعارات ========
    const notificationIcon = document.querySelector('.notification-icon');
    notificationIcon.addEventListener('click', function() {
        // هنا يمكنك إضافة منطق عرض قائمة الإشعارات
        alert('سيتم عرض قائمة الإشعارات');
    });

    // ======== خروج المستخدم ========
    const logoutBtn = document.querySelector('.logout a');
    logoutBtn.addEventListener('click', function(e) {
        e.preventDefault();
        if (confirm('هل أنت متأكد من تسجيل الخروج؟')) {
            // مسح بيانات المستخدم
            localStorage.removeItem('username');
            localStorage.removeItem('userRole');

            // العودة إلى شاشة تسجيل الدخول
            document.getElementById('appScreen').classList.add('hidden');
            document.getElementById('loginScreen').classList.remove('hidden');
        }
    });

    // ======== عرض رسائل النجاح والخطأ ========
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;

        document.body.appendChild(messageDiv);

        setTimeout(() => {
            messageDiv.style.opacity = '0';
            setTimeout(() => {
                messageDiv.remove();
            }, 500);
        }, 3000);
    }

    // ======== تهيئة الرسوم البيانية ========
    if (typeof Chart !== 'undefined') {
        // رسم توزيع المهام حسب الحالة
        const ctxStatus = document.getElementById('taskStatusChart');
        if (ctxStatus) {
            new Chart(ctxStatus, {
                type: 'doughnut',
                data: {
                    labels: ['مكتملة', 'قيد التنفيذ', 'متأخرة'],
                    datasets: [{
                        data: [18, 4, 2],
                        backgroundColor: [
                            'rgba(76, 201, 240, 0.7)',
                            'rgba(247, 127, 0, 0.7)',
                            'rgba(214, 40, 40, 0.7)'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    family: 'Tajawal'
                                }
                            }
                        }
                    }
                }
            });
        }

        // رسم المهام الشهرية
        const ctxMonthly = document.getElementById('monthlyTasksChart');
        if (ctxMonthly) {
            new Chart(ctxMonthly, {
                type: 'bar',
                data: {
                    labels: ['يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو'],
                    datasets: [{
                        label: 'عدد المهام',
                        data: [12, 15, 8, 14, 10, 16],
                        backgroundColor: 'rgba(67, 97, 238, 0.7)',
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        y: {
                            beginAtZero: true,
                            ticks: {
                                font: {
                                    family: 'Tajawal'
                                }
                            }
                        },
                        x: {
                            ticks: {
                                font: {
                                    family: 'Tajawal'
                                }
                            }
                        }
                    },
                    plugins: {
                        legend: {
                            display: false
                        }
                    }
                }
            });
        }
    }
});
