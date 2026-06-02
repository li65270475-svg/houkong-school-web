/**
 * 澳门濠江中学学生获奖管理系统
 * 核心脚本 v2.0 - 增强版
 */

// ============================================
// 工具函数
// ============================================

/**
 * HTML转义 - 防止XSS攻击
 */
function escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * 防抖函数 - 防止重复提交
 */
function debounce(func, wait = 500) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

/**
 * 生成唯一ID
 */
function generateId() {
    return 'a' + Date.now() + Math.random().toString(36).substr(2, 5);
}

// ============================================
// 数据存储和管理
// ============================================

const DataStore = {
    // 初始化数据
    init() {
        if (!localStorage.getItem('haojiang_initialized')) {
            this.initSampleData();
            localStorage.setItem('haojiang_initialized', 'true');
        }
    },

    // 初始化示例数据
    initSampleData() {
        const awardCategories = [
            { id: '1', name: '学科竞赛', description: '各学科知识竞赛' },
            { id: '2', name: '科技创新', description: '科技创新类奖项' },
            { id: '3', name: '艺术体育', description: '艺术、体育类奖项' },
            { id: '4', name: '学业优秀', description: '学习成绩优秀奖' },
            { id: '5', name: '社会公益', description: '志愿服务、公益活动' },
            { id: '6', name: '其他荣誉', description: '其他类型荣誉' }
        ];

        const awardLevels = [
            { id: 'level_1', name: '班级级', sort: 1 },
            { id: 'level_2', name: '校级', sort: 2 },
            { id: 'level_3', name: '区级', sort: 3 },
            { id: 'level_4', name: '市级', sort: 4 },
            { id: 'level_5', name: '省级', sort: 5 },
            { id: 'level_6', name: '国家级', sort: 6 },
            { id: 'level_7', name: '国际级', sort: 7 }
        ];

        const classes = [
            { id: 'class1', name: '初一(1)班', grade: '初一' },
            { id: 'class2', name: '初一(2)班', grade: '初一' },
            { id: 'class3', name: '初二(1)班', grade: '初二' },
            { id: 'class4', name: '初二(2)班', grade: '初二' },
            { id: 'class5', name: '初三(1)班', grade: '初三' },
            { id: 'class6', name: '初三(2)班', grade: '初三' },
            { id: 'class7', name: '高一(1)班', grade: '高一' },
            { id: 'class8', name: '高二(1)班', grade: '高二' },
            { id: 'class9', name: '高三(1)班', grade: '高三' }
        ];

        const teachers = [
            { id: 't001', name: '王小明', username: 't001', password: '123456', classId: 'class1', subject: '数学' },
            { id: 't002', name: '李老师', username: 't002', password: '123456', classId: 'class2', subject: '语文' },
            { id: 't003', name: '张老师', username: 't003', password: '123456', classId: 'class3', subject: '英语' }
        ];

        const students = [
            { id: 's001', name: '张三', username: 's001', password: '123456', classId: 'class1', grade: '初一' },
            { id: 's002', name: '李四', username: 's002', password: '123456', classId: 'class1', grade: '初一' },
            { id: 's003', name: '王五', username: 's003', password: '123456', classId: 'class2', grade: '初一' },
            { id: 's004', name: '赵六', username: 's004', password: '123456', classId: 'class3', grade: '初二' },
            { id: 's005', name: '陈七', username: 's005', password: '123456', classId: 'class5', grade: '初三' }
        ];

        const awards = [
            {
                id: 'a001',
                studentId: 's001',
                studentName: '张三',
                username: 's001',
                classId: 'class1',
                className: '初一(1)班',
                categoryId: '1',
                categoryName: '学科竞赛',
                awardName: '数学竞赛一等奖',
                awardLevel: '校级',
                awardDate: '2025-12-15',
                organizer: '教务处',
                certificateImage: '',
                description: '在2025年度校级数学竞赛中获得一等奖',
                teacherApproved: true,
                teacherApprovedBy: 't001',
                teacherApprovedTime: '2025-12-16',
                adminApproved: true,
                adminApprovedBy: 'admin',
                adminApprovedTime: '2025-12-17',
                status: 'approved',
                createTime: '2025-12-15'
            },
            {
                id: 'a002',
                studentId: 's002',
                studentName: '李四',
                username: 's002',
                classId: 'class1',
                className: '初一(1)班',
                categoryId: '2',
                categoryName: '科技创新',
                awardName: '科技创新大赛二等奖',
                awardLevel: '市级',
                awardDate: '2025-11-20',
                organizer: '科技局',
                certificateImage: '',
                description: '在市级科技创新大赛中获得二等奖',
                teacherApproved: false,
                adminApproved: false,
                status: 'pending',
                createTime: '2025-11-20'
            }
        ];

        localStorage.setItem('haojiang_categories', JSON.stringify(awardCategories));
        localStorage.setItem('haojiang_levels', JSON.stringify(awardLevels));
        localStorage.setItem('haojiang_classes', JSON.stringify(classes));
        localStorage.setItem('haojiang_teachers', JSON.stringify(teachers));
        localStorage.setItem('haojiang_students', JSON.stringify(students));
        localStorage.setItem('haojiang_awards', JSON.stringify(awards));
    },

    // 获取数据
    get(key) {
        const data = localStorage.getItem(`haojiang_${key}`);
        return data ? JSON.parse(data) : [];
    },

    // 保存数据
    set(key, data) {
        localStorage.setItem(`haojiang_${key}`, JSON.stringify(data));
    },

    // 获取学生信息
    getStudent(username) {
        const students = this.get('students');
        return students.find(s => s.username === username);
    },

    // 获取教师信息
    getTeacher(username) {
        const teachers = this.get('teachers');
        return teachers.find(t => t.username === username);
    },

    // 获取班级信息
    getClass(classId) {
        const classes = this.get('classes');
        return classes.find(c => c.id === classId);
    },

    // 获取奖项分类
    getCategory(categoryId) {
        const categories = this.get('categories');
        return categories.find(c => c.id === categoryId);
    },

    // 获取用户信息
    getUser(username) {
        return this.getStudent(username) || this.getTeacher(username) || { id: 'admin', name: '管理员' };
    }
};

// ============================================
// 操作日志管理
// ============================================

const OperationLog = {
    // 操作类型
    types: {
        SUBMIT: 'submit',           // 学生提交申请
        TEACHER_APPROVE: 'teacher_approve',   // 教师审核通过
        TEACHER_REJECT: 'teacher_reject',     // 教师驳回
        ADMIN_APPROVE: 'admin_approve',       // 管理员终审通过
        ADMIN_REJECT: 'admin_reject',         // 管理员终审驳回
        EXPORT: 'export',           // 导出数据
        DELETE: 'delete',           // 删除记录
        ADD_CATEGORY: 'add_category',       // 添加分类
        EDIT_CATEGORY: 'edit_category',     // 编辑分类
        DELETE_CATEGORY: 'delete_category', // 删除分类
        ADD_USER: 'add_user',       // 添加用户
        EDIT_USER: 'edit_user',     // 编辑用户
        DELETE_USER: 'delete_user', // 删除用户
        RESET_PWD: 'reset_pwd'     // 重置密码
    },

    // 获取类型文本
    getTypeText(type) {
        const texts = {
            'submit': '学生提交申请',
            'teacher_approve': '教师审核通过',
            'teacher_reject': '教师驳回',
            'admin_approve': '管理员终审通过',
            'admin_reject': '管理员终审驳回',
            'export': '导出数据',
            'delete': '删除记录',
            'add_category': '添加奖项分类',
            'edit_category': '编辑奖项分类',
            'delete_category': '删除奖项分类',
            'add_user': '添加用户',
            'edit_user': '编辑用户',
            'delete_user': '删除用户',
            'reset_pwd': '重置密码'
        };
        return texts[type] || type;
    },

    // 获取类型样式
    getTypeClass(type) {
        const classes = {
            'submit': 'info',
            'teacher_approve': 'success',
            'teacher_reject': 'warning',
            'admin_approve': 'success',
            'admin_reject': 'danger',
            'export': 'primary',
            'delete': 'danger',
            'add_category': 'success',
            'edit_category': 'info',
            'delete_category': 'danger',
            'add_user': 'success',
            'edit_user': 'info',
            'delete_user': 'danger',
            'reset_pwd': 'warning'
        };
        return 'status-' + (classes[type] || 'default');
    },

    // 记录操作
    log(action, recordId, details = '') {
        const user = Auth.currentUser;
        const logs = this.getAll();

        const newLog = {
            id: 'log_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9),
            action: action,
            recordId: recordId || '',
            details: details,
            operator: user ? user.name : '系统',
            operatorId: user ? user.id : 'system',
            operatorRole: Auth.currentRole || 'system',
            timestamp: new Date().toISOString()
        };

        logs.unshift(newLog);

        // 只保留最近1000条日志
        if (logs.length > 1000) {
            logs.splice(1000);
        }

        localStorage.setItem('haojiang_operation_logs', JSON.stringify(logs));
        return newLog;
    },

    // 获取所有日志
    getAll() {
        const data = localStorage.getItem('haojiang_operation_logs');
        return data ? JSON.parse(data) : [];
    },

    // 获取分页日志
    getPage(page = 1, pageSize = 20) {
        const all = this.getAll();
        const start = (page - 1) * pageSize;
        const end = start + pageSize;
        return {
            data: all.slice(start, end),
            total: all.length,
            page: page,
            pageSize: pageSize,
            totalPages: Math.ceil(all.length / pageSize)
        };
    },

    // 清空日志
    clear() {
        localStorage.removeItem('haojiang_operation_logs');
    },

    // 导出日志
    exportLogs() {
        const logs = this.getAll();
        const headers = ['操作时间', '操作人', '角色', '操作类型', '记录ID', '详情'];
        const rows = logs.map(l => [
            l.timestamp,
            l.operator,
            l.operatorRole,
            this.getTypeText(l.action),
            l.recordId,
            l.details
        ]);

        let csv = '\uFEFF';
        csv += headers.map(h => `"${h}"`).join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });

        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `操作日志_${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
    }
};

// ============================================
// 自动提醒管理
// ============================================

const ReminderManager = {
    // 检查截止日期提醒（学生）
    checkDeadlineReminder() {
        const now = new Date();
        const month = now.getMonth() + 1; // 0-11
        const day = now.getDate();

        // 每年12月1日-31日期间提醒
        if (month === 12) {
            const lastReminder = localStorage.getItem('haojiang_deadline_reminder_date');
            const today = now.toISOString().split('T')[0];

            // 每天只提醒一次
            if (lastReminder !== today) {
                localStorage.setItem('haojiang_deadline_reminder_date', today);
                return {
                    show: true,
                    message: '申报截止日期临近，请尽快提交您的获奖申请！',
                    type: 'warning'
                };
            }
        }
        return { show: false };
    },

    // 检查未提交申请的学生（管理员）
    checkUnsubmittedStudents() {
        const students = DataStore.get('students');
        const awards = DataStore.get('awards');
        const currentYear = new Date().getFullYear();
        const notifiedKey = `haojiang_unsubmitted_${currentYear}`;

        // 每年只检查一次
        const lastCheck = localStorage.getItem('haojiang_unsubmitted_check_date');
        const today = new Date().toISOString().split('T')[0];

        if (lastCheck === today) {
            return { show: false };
        }

        localStorage.setItem('haojiang_unsubmitted_check_date', today);

        // 获取本年已有申请的学生
        const submittedStudents = new Set(
            awards
                .filter(a => a.createTime && a.createTime.startsWith(currentYear.toString()))
                .map(a => a.studentId)
        );

        // 找出未提交的学生
        const unsubmitted = students.filter(s => !submittedStudents.has(s.id));

        if (unsubmitted.length > 0) {
            localStorage.setItem(notifiedKey, JSON.stringify(unsubmitted.map(s => s.id)));
            return {
                show: true,
                message: `共有 ${unsubmitted.length} 名学生本年度尚未提交任何申请`,
                students: unsubmitted,
                type: 'info'
            };
        }
        return { show: false };
    },

    // 检查待审核超期提醒（教师）
    checkPendingOverdueReminder(teacherId) {
        const classId = DataStore.getTeacher(teacherId)?.classId;
        if (!classId) return { show: false };

        const awards = DataStore.get('awards');
        const now = new Date();
        const threeDaysMs = 3 * 24 * 60 * 60 * 1000;

        // 获取该班级的待审核记录
        const pending = awards.filter(a =>
            a.classId === classId &&
            !a.teacherApproved &&
            a.status === 'pending'
        );

        // 找出超过3天的
        const overdue = pending.filter(a => {
            const createTime = new Date(a.createTime);
            return now - createTime > threeDaysMs;
        });

        if (overdue.length > 0) {
            return {
                show: true,
                message: `您有 ${overdue.length} 条待审核申请超过3天，请及时处理！`,
                count: overdue.length,
                type: 'warning'
            };
        }
        return { show: false };
    },

    // 通用提醒弹窗
    showReminder(reminder) {
        if (!reminder.show) return;

        const modal = document.createElement('div');
        modal.id = 'reminderModal';
        modal.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(0,0,0,0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 10000;
        `;

        const colors = {
            warning: { bg: '#fff3cd', border: '#ffc107', icon: '#856404' },
            info: { bg: '#d1ecf1', border: '#17a2b8', icon: '#0c5460' },
            danger: { bg: '#f8d7da', border: '#dc3545', icon: '#721c24' }
        };
        const color = colors[reminder.type] || colors.info;

        modal.innerHTML = `
            <div style="background: white; border-radius: 12px; padding: 30px; max-width: 450px; width: 90%; box-shadow: 0 4px 20px rgba(0,0,0,0.15); border-top: 4px solid ${color.border};">
                <div style="text-align: center; margin-bottom: 20px;">
                    <div style="width: 60px; height: 60px; border-radius: 50%; background: ${color.bg}; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 15px;">
                        <i class="fa fa-bell" style="font-size: 28px; color: ${color.icon};"></i>
                    </div>
                    <h3 style="margin: 0 0 10px; color: #333;">系统提醒</h3>
                    <p style="margin: 0; color: #666; line-height: 1.6;">${reminder.message}</p>
                </div>
                <div style="text-align: center;">
                    <button onclick="document.getElementById('reminderModal').remove()" style="background: ${color.border}; color: white; border: none; padding: 12px 40px; border-radius: 8px; font-size: 16px; cursor: pointer;">
                        我知道了
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });
    }
};

// ============================================
// 草稿管理
// ============================================

const DraftManager = {
    // 保存草稿
    save(studentId, formData) {
        const drafts = this.getAll();
        const existingIndex = drafts.findIndex(d => d.studentId === studentId);

        const draft = {
            id: existingIndex >= 0 ? drafts[existingIndex].id : 'draft_' + Date.now(),
            studentId: studentId,
            formData: formData,
            createTime: existingIndex >= 0 ? drafts[existingIndex].createTime : new Date().toISOString(),
            updateTime: new Date().toISOString()
        };

        if (existingIndex >= 0) {
            drafts[existingIndex] = draft;
        } else {
            drafts.push(draft);
        }

        localStorage.setItem('haojiang_drafts', JSON.stringify(drafts));
        return { success: true, draft: draft };
    },

    // 获取学生的草稿
    get(studentId) {
        const drafts = this.getAll();
        return drafts.find(d => d.studentId === studentId) || null;
    },

    // 获取所有草稿
    getAll() {
        const data = localStorage.getItem('haojiang_drafts');
        return data ? JSON.parse(data) : [];
    },

    // 删除草稿
    delete(studentId) {
        const drafts = this.getAll();
        const filtered = drafts.filter(d => d.studentId !== studentId);
        localStorage.setItem('haojiang_drafts', JSON.stringify(filtered));
        return { success: true };
    },

    // 检查是否有草稿
    hasDraft(studentId) {
        return this.get(studentId) !== null;
    },

    // 清除所有草稿
    clearAll() {
        localStorage.removeItem('haojiang_drafts');
    }
};

// ============================================
// 快捷键管理
// ============================================

const KeyboardShortcuts = {
    handlers: {},

    init() {
        document.addEventListener('keydown', (e) => {
            // ESC 关闭弹窗
            if (e.key === 'Escape') {
                const modals = document.querySelectorAll('.modal[style*="display: flex"], .modal:not([style*="display: none"])');
                modals.forEach(modal => {
                    if (getComputedStyle(modal).display !== 'none') {
                        modal.style.display = 'none';
                    }
                });

                // 关闭草稿恢复弹窗
                const draftModal = document.getElementById('draftRestoreModal');
                if (draftModal) draftModal.remove();
            }

            // Ctrl/Cmd + S 保存草稿（学生端）
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                if (Auth.currentRole === 'student') {
                    e.preventDefault();
                    if (typeof saveDraft === 'function') {
                        saveDraft();
                    }
                }
            }
        });
    }
};

// ============================================
// 用户认证管理
// ============================================

const Auth = {
    currentUser: null,
    currentRole: null,

    // 登录
    login(username, password, role) {
        if (role === 'admin') {
            if (username === 'admin' && password === '123456') {
                this.currentUser = { id: 'admin', name: '系统管理员', username: 'admin' };
                this.currentRole = 'admin';
                this.saveSession();
                // 管理员登录检查未提交学生
                setTimeout(() => {
                    const reminder = ReminderManager.checkUnsubmittedStudents();
                    ReminderManager.showReminder(reminder);
                }, 500);
                return { success: true, message: '登录成功' };
            }
            return { success: false, message: '管理员账号或密码错误' };
        }

        if (role === 'teacher') {
            const teacher = DataStore.getTeacher(username);
            if (teacher && teacher.password === password) {
                this.currentUser = teacher;
                this.currentRole = 'teacher';
                this.saveSession();
                // 教师登录检查待审核超期
                setTimeout(() => {
                    const reminder = ReminderManager.checkPendingOverdueReminder(teacher.id);
                    ReminderManager.showReminder(reminder);
                }, 500);
                return { success: true, message: '登录成功' };
            }
            return { success: false, message: '工号或密码错误' };
        }

        if (role === 'student') {
            const student = DataStore.getStudent(username);
            if (student && student.password === password) {
                this.currentUser = student;
                this.currentRole = 'student';
                this.saveSession();
                // 学生登录检查截止日期
                setTimeout(() => {
                    const reminder = ReminderManager.checkDeadlineReminder();
                    ReminderManager.showReminder(reminder);
                }, 500);
                return { success: true, message: '登录成功' };
            }
            return { success: false, message: '学号或密码错误' };
        }

        return { success: false, message: '无效的角色' };
    },

    // 保存会话
    saveSession() {
        sessionStorage.setItem('haojiang_user', JSON.stringify(this.currentUser));
        sessionStorage.setItem('haojiang_role', this.currentRole);
    },

    // 登出
    logout() {
        this.currentUser = null;
        this.currentRole = null;
        sessionStorage.removeItem('haojiang_user');
        sessionStorage.removeItem('haojiang_role');
        window.location.href = 'index.html';
    },

    // 检查登录状态
    checkLogin() {
        const user = sessionStorage.getItem('haojiang_user');
        const role = sessionStorage.getItem('haojiang_role');
        if (user && role) {
            this.currentUser = JSON.parse(user);
            this.currentRole = role;
            return true;
        }
        return false;
    },

    // 获取当前用户
    getCurrentUser() {
        if (!this.currentUser) {
            this.checkLogin();
        }
        return this.currentUser;
    },

    // 获取当前角色
    getCurrentRole() {
        if (!this.currentRole) {
            this.checkLogin();
        }
        return this.currentRole;
    },

    // 检查角色权限
    hasRole(role) {
        return this.getCurrentRole() === role;
    },

    // 验证页面访问权限
    requireRole(allowedRoles) {
        const role = this.getCurrentRole();
        if (!allowedRoles.includes(role)) {
            Toast.show('您没有访问该页面的权限', 'error');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 1500);
            return false;
        }
        return true;
    }
};

// ============================================
// 获奖记录管理
// ============================================

const AwardManager = {
    // 提交获奖申请
    submitAward(awardData) {
        const awards = DataStore.get('awards');
        const user = Auth.getCurrentUser();
        const classInfo = DataStore.getClass(user.classId);

        // 重复检测：检查该学生是否已有"相同奖项名称 + 相同获奖年度"的记录
        const awardYear = awardData.awardDate ? awardData.awardDate.substring(0, 4) : '';
        const duplicate = awards.find(a =>
            a.studentId === user.id &&
            a.awardName === awardData.awardName &&
            a.awardDate &&
            a.awardDate.substring(0, 4) === awardYear &&
            (a.status === 'approved' || a.status === 'pending')
        );

        if (duplicate) {
            return { success: false, message: `该奖项 "${duplicate.awardName}" 已有 ${duplicate.status === 'approved' ? '已通过' : '待审核'} 的记录，请勿重复提交` };
        }

        const newAward = {
            id: generateId(),
            studentId: user.id,
            studentName: user.name,
            username: user.username,
            classId: user.classId,
            className: classInfo ? classInfo.name : '',
            categoryId: awardData.categoryId,
            categoryName: awardData.categoryName,
            awardName: awardData.awardName,
            awardLevel: awardData.awardLevel,
            awardDate: awardData.awardDate,
            organizer: awardData.organizer,
            certificateImage: awardData.certificateImage || '',
            description: awardData.description || '',
            teacherApproved: false,
            teacherApprovedBy: '',
            teacherApprovedTime: '',
            adminApproved: false,
            adminApprovedBy: '',
            adminApprovedTime: '',
            status: 'pending',
            createTime: new Date().toISOString().split('T')[0]
        };

        awards.push(newAward);
        DataStore.set('awards', awards);

        // 记录操作日志
        OperationLog.log(OperationLog.types.SUBMIT, newAward.id, `学生 ${user.name} 提交了奖项申请：${newAward.awardName}`);

        // 发送通知给教师
        const teachers = DataStore.get('teachers').filter(t => t.classId === newAward.classId);
        teachers.forEach(teacher => {
            NotificationManager.sendToUser(teacher.id, 'teacher', 'application',
                '新获奖申请',
                `学生 ${newAward.studentName} 提交了 "${newAward.awardName}" 申请，请及时审核`
            );
        });

        // 发送通知给管理员
        NotificationManager.sendToAdmin('application',
            '新获奖申请',
            `学生 ${newAward.studentName} 提交了 "${newAward.awardName}" 申请`
        );

        return { success: true, award: newAward };
    },

    // 重新提交被驳回的申请
    resubmitAward(awardId, awardData) {
        const awards = DataStore.get('awards');
        const index = awards.findIndex(a => a.id === awardId);
        if (index === -1) {
            return { success: false, message: '记录不存在' };
        }

        const award = awards[index];
        if (award.status !== 'rejected') {
            return { success: false, message: '只有被驳回的记录才能重新提交' };
        }

        // 更新记录
        awards[index] = {
            ...award,
            awardName: awardData.awardName,
            categoryId: awardData.categoryId,
            categoryName: awardData.categoryName,
            awardLevel: awardData.awardLevel,
            awardDate: awardData.awardDate,
            organizer: awardData.organizer,
            certificateImage: awardData.certificateImage || '',
            description: awardData.description || '',
            teacherApproved: false,
            teacherApprovedBy: '',
            teacherApprovedTime: '',
            adminApproved: false,
            adminApprovedBy: '',
            adminApprovedTime: '',
            status: 'pending',
            rejectReason: '',
            rejectBy: '',
            rejectTime: '',
            resubmitCount: (award.resubmitCount || 0) + 1,
            lastResubmitTime: new Date().toISOString().split('T')[0]
        };

        DataStore.set('awards', awards);

        // 发送通知给教师
        const teachers = DataStore.get('teachers').filter(t => t.classId === awards[index].classId);
        teachers.forEach(teacher => {
            NotificationManager.sendToUser(teacher.id, 'teacher', 'application',
                '学生重新提交申请',
                `学生 ${awards[index].studentName} 根据驳回原因修改后重新提交了 "${awards[index].awardName}"，请及时审核`
            );
        });

        // 发送通知给管理员
        NotificationManager.sendToAdmin('application',
            '学生重新提交申请',
            `学生 ${awards[index].studentName} 修改后重新提交了 "${awards[index].awardName}" 申请`
        );

        return { success: true, award: awards[index] };
    },

    // 获取学生自己的获奖记录
    getMyAwards(studentId) {
        const awards = DataStore.get('awards');
        return awards.filter(a => a.studentId === studentId);
    },

    // 获取班级待审核的获奖记录（教师）
    getPendingAwardsForTeacher(classId) {
        const awards = DataStore.get('awards');
        return awards.filter(a => a.classId === classId && !a.teacherApproved);
    },

    // 获取班级所有获奖记录（教师）
    getClassAwards(classId) {
        const awards = DataStore.get('awards');
        return awards.filter(a => a.classId === classId);
    },

    // 获取所有待审核记录（管理员）
    getAllPendingAwards() {
        const awards = DataStore.get('awards');
        return awards.filter(a => a.teacherApproved && !a.adminApproved);
    },

    // 获取所有获奖记录（管理员）
    getAllAwards() {
        return DataStore.get('awards');
    },

    // 教师审核
    teacherApprove(awardId, approved, rejectReason = '') {
        const awards = DataStore.get('awards');
        const index = awards.findIndex(a => a.id === awardId);
        if (index !== -1) {
            const user = Auth.getCurrentUser();
            const award = awards[index];
            awards[index].teacherApprovedBy = user.id;
            awards[index].teacherApprovedTime = new Date().toISOString().split('T')[0];
            if (approved) {
                awards[index].teacherApproved = true;
                OperationLog.log(OperationLog.types.TEACHER_APPROVE, awardId, `教师 ${user.name} 审核通过：${award.awardName}`);
            } else {
                // 驳回时也要设置 teacherApproved = true，表示教师已审核过
                awards[index].teacherApproved = true;
                awards[index].status = 'rejected';
                awards[index].rejectReason = rejectReason;
                awards[index].rejectBy = 'teacher';
                awards[index].rejectTime = new Date().toISOString().split('T')[0];
                OperationLog.log(OperationLog.types.TEACHER_REJECT, awardId, `教师 ${user.name} 驳回：${award.awardName}，原因：${rejectReason}`);
            }
            DataStore.set('awards', awards);

            // 发送通知给学生
            const statusText = approved ? '通过' : '驳回';
            NotificationManager.sendToUser(award.studentId, 'student',
                approved ? 'review' : 'rejected',
                `教师${statusText}了您的申请`,
                approved ? `您的奖项 "${award.awardName}" 已通过教师审核，等待管理员终审` : `您的奖项 "${award.awardName}" 被教师驳回，原因：${rejectReason}`
            );

            return { success: true };
        }
        return { success: false, message: '记录不存在' };
    },

    // 管理员终审
    adminApprove(awardId, approved, rejectReason = '') {
        const awards = DataStore.get('awards');
        const index = awards.findIndex(a => a.id === awardId);
        if (index !== -1) {
            const user = Auth.getCurrentUser();
            const award = awards[index];
            awards[index].adminApprovedBy = user.id;
            awards[index].adminApprovedTime = new Date().toISOString().split('T')[0];
            if (approved) {
                awards[index].adminApproved = true;
                awards[index].status = 'approved';
                OperationLog.log(OperationLog.types.ADMIN_APPROVE, awardId, `管理员 ${user.name} 终审通过：${award.awardName}`);
            } else {
                // 驳回时也要设置 adminApproved = true，表示管理员已审核过
                awards[index].adminApproved = true;
                awards[index].status = 'rejected';
                awards[index].rejectReason = rejectReason;
                awards[index].rejectBy = 'admin';
                awards[index].rejectTime = new Date().toISOString().split('T')[0];
                OperationLog.log(OperationLog.types.ADMIN_REJECT, awardId, `管理员 ${user.name} 终审驳回：${award.awardName}，原因：${rejectReason}`);
            }
            DataStore.set('awards', awards);

            // 发送通知给学生
            const statusText = approved ? '通过' : '驳回';
            NotificationManager.sendToUser(award.studentId, 'student',
                approved ? 'review' : 'rejected',
                `管理员${statusText}了您的申请`,
                approved ? `您的奖项 "${award.awardName}" 已审核通过，恭喜！` : `您的奖项 "${award.awardName}" 被管理员驳回，原因：${rejectReason}`
            );

            return { success: true };
        }
        return { success: false, message: '记录不存在' };
    },

    // 删除记录
    deleteAward(awardId) {
        const awards = DataStore.get('awards');
        const award = awards.find(a => a.id === awardId);
        const filtered = awards.filter(a => a.id !== awardId);
        if (award) {
            OperationLog.log(OperationLog.types.DELETE, awardId, `删除了奖项记录：${award.awardName}（学生：${award.studentName}）`);
        }
        DataStore.set('awards', filtered);
        return { success: true };
    },

    // 更新记录
    updateAward(awardId, updateData) {
        const awards = DataStore.get('awards');
        const index = awards.findIndex(a => a.id === awardId);
        if (index !== -1) {
            Object.assign(awards[index], updateData);
            DataStore.set('awards', awards);
            return { success: true };
        }
        return { success: false, message: '记录不存在' };
    },

    // 搜索获奖记录
    searchAwards(keyword, filters = {}) {
        let awards = DataStore.get('awards');

        // 角色权限过滤
        if (Auth.getCurrentRole() === 'student') {
            awards = awards.filter(a => a.studentId === Auth.getCurrentUser().id);
        } else if (Auth.getCurrentRole() === 'teacher') {
            awards = awards.filter(a => a.classId === Auth.getCurrentUser().classId);
        }

        // 关键字搜索
        if (keyword) {
            const kw = keyword.toLowerCase();
            awards = awards.filter(a => 
                a.studentName.toLowerCase().includes(kw) ||
                a.awardName.toLowerCase().includes(kw) ||
                a.className.toLowerCase().includes(kw)
            );
        }

        // 筛选条件
        if (filters.categoryId) {
            awards = awards.filter(a => a.categoryId === filters.categoryId);
        }

        if (filters.classId) {
            awards = awards.filter(a => a.classId === filters.classId);
        }

        if (filters.year) {
            awards = awards.filter(a => a.awardDate.startsWith(filters.year));
        }

        if (filters.status) {
            awards = awards.filter(a => a.status === filters.status);
        }

        return awards;
    },

    // 统计功能
    getStatistics(type = 'all') {
        const awards = DataStore.get('awards');
        const approved = awards.filter(a => a.status === 'approved');

        if (type === 'year') {
            const stats = {};
            approved.forEach(a => {
                const year = a.awardDate.split('-')[0];
                stats[year] = (stats[year] || 0) + 1;
            });
            return stats;
        }

        if (type === 'category') {
            const stats = {};
            approved.forEach(a => {
                stats[a.categoryName] = (stats[a.categoryName] || 0) + 1;
            });
            return stats;
        }

        if (type === 'class') {
            const stats = {};
            approved.forEach(a => {
                stats[a.className] = (stats[a.className] || 0) + 1;
            });
            return stats;
        }

        return {
            total: approved.length,
            pending: awards.filter(a => a.status === 'pending').length,
            approved: approved.length,
            rejected: awards.filter(a => a.status === 'rejected').length
        };
    }
};

// ============================================
// 用户管理（管理员）
// ============================================

const UserManager = {
    // 获取所有教师
    getAllTeachers() {
        return DataStore.get('teachers');
    },

    // 获取所有学生
    getAllStudents() {
        return DataStore.get('students');
    },

    // 获取所有班级
    getAllClasses() {
        return DataStore.get('classes');
    },

    // 添加教师
    addTeacher(teacherData) {
        const teachers = DataStore.get('teachers');

        // 检查账号是否已存在
        if (teachers.some(t => t.username === teacherData.username)) {
            return { success: false, message: '教师账号已存在' };
        }

        const newTeacher = {
            id: 't' + Date.now(),
            name: teacherData.name,
            username: teacherData.username,
            password: teacherData.password || '123456',
            classId: teacherData.classId,
            subject: teacherData.subject || ''
        };

        teachers.push(newTeacher);
        DataStore.set('teachers', teachers);
        OperationLog.log(OperationLog.types.ADD_USER, newTeacher.id, `管理员添加教师：${newTeacher.name}（${newTeacher.username}）`);

        return { success: true, teacher: newTeacher };
    },

    // 添加学生
    addStudent(studentData) {
        const students = DataStore.get('students');

        // 检查账号是否已存在
        if (students.some(s => s.username === studentData.username)) {
            return { success: false, message: '学生账号已存在' };
        }

        const newStudent = {
            id: 's' + Date.now(),
            name: studentData.name,
            username: studentData.username,
            password: studentData.password || '123456',
            classId: studentData.classId,
            grade: studentData.grade || ''
        };

        students.push(newStudent);
        DataStore.set('students', students);
        OperationLog.log(OperationLog.types.ADD_USER, newStudent.id, `管理员添加学生：${newStudent.name}（${newStudent.username}）`);

        return { success: true, student: newStudent };
    },

    // 更新教师信息
    updateTeacher(id, updateData) {
        const teachers = DataStore.get('teachers');
        const index = teachers.findIndex(t => t.id === id);
        if (index === -1) {
            return { success: false, message: '教师不存在' };
        }

        teachers[index] = { ...teachers[index], ...updateData };
        DataStore.set('teachers', teachers);
        OperationLog.log(OperationLog.types.EDIT_USER, id, `管理员修改教师信息：${teachers[index].name}`);

        return { success: true, teacher: teachers[index] };
    },

    // 更新学生信息
    updateStudent(id, updateData) {
        const students = DataStore.get('students');
        const index = students.findIndex(s => s.id === id);
        if (index === -1) {
            return { success: false, message: '学生不存在' };
        }

        students[index] = { ...students[index], ...updateData };
        DataStore.set('students', students);
        OperationLog.log(OperationLog.types.EDIT_USER, id, `管理员修改学生信息：${students[index].name}`);

        return { success: true, student: students[index] };
    },

    // 重置用户密码
    resetPassword(id, type) {
        if (type === 'teacher') {
            const teachers = DataStore.get('teachers');
            const index = teachers.findIndex(t => t.id === id);
            if (index !== -1) {
                teachers[index].password = '123456';
                DataStore.set('teachers', teachers);
                OperationLog.log(OperationLog.types.RESET_PWD, id, `管理员重置教师密码：${teachers[index].name}`);
                return { success: true, message: '密码已重置为 123456' };
            }
        } else {
            const students = DataStore.get('students');
            const index = students.findIndex(s => s.id === id);
            if (index !== -1) {
                students[index].password = '123456';
                DataStore.set('students', students);
                OperationLog.log(OperationLog.types.RESET_PWD, id, `管理员重置学生密码：${students[index].name}`);
                return { success: true, message: '密码已重置为 123456' };
            }
        }
        return { success: false, message: '用户不存在' };
    },

    // 删除教师
    deleteTeacher(id) {
        const teachers = DataStore.get('teachers');
        const teacher = teachers.find(t => t.id === id);
        if (!teacher) {
            return { success: false, message: '教师不存在' };
        }

        const filtered = teachers.filter(t => t.id !== id);
        DataStore.set('teachers', filtered);
        OperationLog.log(OperationLog.types.DELETE_USER, id, `管理员删除教师：${teacher.name}（${teacher.username}）`);

        return { success: true };
    },

    // 删除学生
    deleteStudent(id) {
        const students = DataStore.get('students');
        const student = students.find(s => s.id === id);
        if (!student) {
            return { success: false, message: '学生不存在' };
        }

        const filtered = students.filter(s => s.id !== id);
        DataStore.set('students', filtered);
        OperationLog.log(OperationLog.types.DELETE_USER, id, `管理员删除学生：${student.name}（${student.username}）`);

        return { success: true };
    },

    // 获取班级名称
    getClassName(classId) {
        const classes = DataStore.get('classes');
        const cls = classes.find(c => c.id === classId);
        return cls ? cls.name : '未知班级';
    }
};

// ============================================
// 分类管理（管理员）
// ============================================

const CategoryManager = {
    getAll() {
        return DataStore.get('categories');
    },

    add(category) {
        const categories = DataStore.get('categories');
        category.id = 'c' + Date.now();
        categories.push(category);
        DataStore.set('categories', categories);
        return { success: true, category };
    },

    update(id, updateData) {
        const categories = DataStore.get('categories');
        const index = categories.findIndex(c => c.id === id);
        if (index !== -1) {
            Object.assign(categories[index], updateData);
            DataStore.set('categories', categories);
            return { success: true };
        }
        return { success: false };
    },

    delete(id) {
        const categories = DataStore.get('categories');
        const filtered = categories.filter(c => c.id !== id);
        DataStore.set('categories', filtered);
        return { success: true };
    }
};

// ============================================
// Toast 消息提示
// ============================================

const Toast = {
    container: null,

    init() {
        if (!this.container) {
            this.container = document.createElement('div');
            this.container.className = 'toast-container';
            document.body.appendChild(this.container);
        }
    },

    show(message, type = 'info', duration = 3000) {
        this.init();
        
        const icons = {
            success: 'fa-check-circle',
            error: 'fa-times-circle',
            warning: 'fa-exclamation-triangle',
            info: 'fa-info-circle'
        };

        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <i class="fa ${icons[type]}"></i>
            <span>${message}</span>
        `;

        this.container.appendChild(toast);

        setTimeout(() => {
            toast.style.animation = 'toastSlide 0.3s reverse';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    }
};

// ============================================
// 导出功能 - 支持中文不乱码
// ============================================

const Exporter = {
    // 可用字段定义
    fields: {
        studentId: { label: '学号', key: 'studentId || a.username' },
        studentName: { label: '姓名', key: 'studentName' },
        className: { label: '班级', key: 'className' },
        categoryName: { label: '奖项分类', key: 'categoryName' },
        awardName: { label: '奖项名称', key: 'awardName' },
        awardLevel: { label: '获奖级别', key: 'awardLevel' },
        awardDate: { label: '获奖日期', key: 'awardDate' },
        organizer: { label: '主办方', key: 'organizer' },
        description: { label: '获奖说明', key: 'description' },
        status: { label: '状态', key: 'this.getStatusText(a.status)' },
        createTime: { label: '创建时间', key: 'createTime' },
        teacherApprovedBy: { label: '初审教师', key: 'teacherApprovedBy' },
        teacherApprovedTime: { label: '初审时间', key: 'teacherApprovedTime' },
        adminApprovedBy: { label: '终审管理员', key: 'adminApprovedBy' },
        adminApprovedTime: { label: '终审时间', key: 'adminApprovedTime' }
    },

    // 获取字段值
    getFieldValue(a, key) {
        try {
            return eval(`a.${key}`);
        } catch (e) {
            return '';
        }
    },

    // 导出为CSV
    exportToCSV(awards, filename = 'awards_export.csv', selectedFields = null) {
        const fields = selectedFields || Object.keys(this.fields);
        const headers = fields.map(f => this.fields[f].label);
        const rows = awards.map(a =>
            fields.map(f => {
                const key = this.fields[f].key;
                let val = this.getFieldValue(a, key);
                return val;
            })
        );

        // 添加BOM确保Excel打开中文不乱码
        let csv = '\uFEFF';
        csv += headers.map(h => `"${h}"`).join(',') + '\n';
        rows.forEach(row => {
            csv += row.map(cell => `"${(cell || '').toString().replace(/"/g, '""')}"`).join(',') + '\n';
        });

        this.download(csv, filename, 'text/csv;charset=utf-8');
    },

    // 导出为Excel兼容的HTML
    exportToExcel(awards, filename = 'awards_export.xls', selectedFields = null) {
        const fields = selectedFields || Object.keys(this.fields);
        const headers = fields.map(f => `<th>${this.fields[f].label}</th>`).join('');

        let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8"><title>濠江中学获奖记录</title></head><body><table border="1" style="border-collapse:collapse;">
<thead><tr style="background:#f0f0f0;">${headers}</tr></thead><tbody>`;

        awards.forEach(a => {
            const cells = fields.map(f => {
                const key = this.fields[f].key;
                const val = this.getFieldValue(a, key);
                return `<td>${val}</td>`;
            }).join('');
            html += `<tr>${cells}</tr>`;
        });

        html += '</tbody></table></body></html>';
        this.download(html, filename, 'application/vnd.ms-excel');
    },

    // 导出全校统计汇总
    exportSummary(classStats, filename = 'awards_summary.xls') {
        const headers = ['班级', '班主任', '学生人数', '获奖人数', '总奖项数', '班级级', '校级', '区级', '市级', '省级', '国家级', '国际级'];

        let html = `<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel">
<head><meta charset="utf-8"><title>濠江中学全校获奖统计汇总</title></head><body><table border="1" style="border-collapse:collapse;">
<thead><tr style="background:#f0f0f0;">${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>`;

        classStats.forEach(stat => {
            html += `<tr>
<td>${stat.className}</td>
<td>${stat.teacherName}</td>
<td>${stat.studentCount}</td>
<td>${stat.awardedStudentCount}</td>
<td>${stat.totalAwards}</td>
<td>${stat.levelCounts['班级级'] || 0}</td>
<td>${stat.levelCounts['校级'] || 0}</td>
<td>${stat.levelCounts['区级'] || 0}</td>
<td>${stat.levelCounts['市级'] || 0}</td>
<td>${stat.levelCounts['省级'] || 0}</td>
<td>${stat.levelCounts['国家级'] || 0}</td>
<td>${stat.levelCounts['国际级'] || 0}</td>
</tr>`;
        });

        html += '</tbody></table></body></html>';
        this.download(html, filename, 'application/vnd.ms-excel');
    },

    // 导出统计汇总CSV
    exportSummaryCSV(classStats, filename = 'awards_summary.csv') {
        const headers = ['班级', '班主任', '学生人数', '获奖人数', '总奖项数', '班级级', '校级', '区级', '市级', '省级', '国家级', '国际级'];

        let csv = '\uFEFF';
        csv += headers.map(h => `"${h}"`).join(',') + '\n';
        classStats.forEach(stat => {
            csv += [
                stat.className,
                stat.teacherName,
                stat.studentCount,
                stat.awardedStudentCount,
                stat.totalAwards,
                stat.levelCounts['班级级'] || 0,
                stat.levelCounts['校级'] || 0,
                stat.levelCounts['区级'] || 0,
                stat.levelCounts['市级'] || 0,
                stat.levelCounts['省级'] || 0,
                stat.levelCounts['国家级'] || 0,
                stat.levelCounts['国际级'] || 0
            ].map(v => `"${v}"`).join(',') + '\n';
        });

        this.download(csv, filename, 'text/csv;charset=utf-8');
    },

    // 下载文件
    download(content, filename, mimeType) {
        const blob = new Blob([content], { type: mimeType });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);

        // 记录导出日志
        OperationLog.log(OperationLog.types.EXPORT, '', `导出了文件：${filename}（${mimeType.includes('csv') ? 'CSV' : 'Excel'}格式）`);
    },

    // 获取状态文本
    getStatusText(status) {
        const statusMap = {
            'pending': '待审核',
            'approved': '已通过',
            'rejected': '已驳回'
        };
        return statusMap[status] || status;
    }
};

// ============================================
// UI 工具函数
// ============================================

const UI = {
    // 格式化日期
    formatDate(dateStr) {
        if (!dateStr) return '-';
        const date = new Date(dateStr);
        return date.toLocaleDateString('zh-CN');
    },

    // 获取状态标签HTML
    getStatusBadge(status) {
        const statusMap = {
            'pending': { text: '待审核', class: 'status-pending' },
            'approved': { text: '已通过', class: 'status-approved' },
            'rejected': { text: '已驳回', class: 'status-rejected' }
        };
        const info = statusMap[status] || { text: status, class: 'status-pending' };
        return `<span class="status-badge ${info.class}">${info.text}</span>`;
    },

    // 获取审核进度
    getApprovalProgress(award) {
        if (award.status === 'approved') {
            return `<span class="status-badge status-approved">已完成</span>`;
        }
        if (award.status === 'rejected') {
            return `<span class="status-badge status-rejected">已驳回</span>`;
        }
        if (award.teacherApproved) {
            return `<span class="status-badge status-teacher-approved">教师已审</span>`;
        }
        return `<span class="status-badge status-pending">待教师审核</span>`;
    },

    // 渲染表格
    renderTable(containerId, awards, columns, actions = []) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = `<div class="table-container">
            <table>
                <thead><tr>`;
        
        columns.forEach(col => {
            html += `<th>${col.title}</th>`;
        });
        if (actions.length > 0) {
            html += `<th>操作</th>`;
        }
        html += `</tr></thead><tbody>`;

        if (awards.length === 0) {
            html += `<tr><td colspan="${columns.length + (actions.length > 0 ? 1 : 0)}" style="text-align:center;padding:60px;">
                <div class="empty-state">
                    <i class="fa fa-inbox"></i>
                    <h3>暂无数据</h3>
                    <p>没有找到符合条件的记录</p>
                </div>
            </td></tr>`;
        } else {
            awards.forEach(award => {
                html += `<tr>`;
                columns.forEach(col => {
                    let value = award[col.key];
                    if (col.type === 'checkbox') {
                        const checkboxClass = col.checkboxClass || 'review-checkbox';
                        value = `<input type="checkbox" class="${escapeHtml(checkboxClass)}" value="${escapeHtml(award.id)}" style="width:16px;height:16px;cursor:pointer;">`;
                    } else if (col.type === 'status') {
                        value = this.getStatusBadge(value);
                    } else if (col.type === 'progress') {
                        value = this.getApprovalProgress(award);
                    } else if (col.type === 'date') {
                        value = this.formatDate(value);
                    } else if (col.render) {
                        value = col.render(value, award);
                    } else {
                        value = escapeHtml(value);
                    }
                    html += `<td>${value || '-'}</td>`;
                });
                if (actions.length > 0) {
                    html += `<td><div class="action-btns">`;
                    actions.forEach(action => {
                        html += `<button class="action-btn ${escapeHtml(action.class)}" onclick="${escapeHtml(action.handler)}('${escapeHtml(award.id)}')">${escapeHtml(action.text)}</button>`;
                    });
                    html += `</div></td>`;
                }
                html += `</tr>`;
            });
        }

        html += `</tbody></table></div>`;
        container.innerHTML = html;
    },

    // 打开模态框
    openModal(modalId) {
        document.getElementById(modalId).classList.add('show');
        document.body.style.overflow = 'hidden';
    },

    // 关闭模态框
    closeModal(modalId) {
        document.getElementById(modalId).classList.remove('show');
        document.body.style.overflow = '';
    },

    // 渲染简洁横向条形图 - 更直观清晰
    renderBarChart(containerId, data, title) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = Object.entries(data);
        if (entries.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa fa-chart-bar"></i><h3>暂无数据</h3><p>当前没有统计数据</p></div>';
            return;
        }

        const max = Math.max(...entries.map(e => e[1]), 1);
        const total = entries.reduce((sum, e) => sum + e[1], 0);
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

        let html = `<div style="padding:16px;overflow-x:auto;">
            ${title ? `<h4 style="margin-bottom:16px;text-align:center;color:#1e293b;font-weight:600;font-size:15px;">${title}</h4>` : ''}
            <div style="min-width:280px;">`;

        entries.forEach(([label, value], index) => {
            const percentage = ((value / total) * 100).toFixed(0);
            const barWidth = Math.max((value / max) * 100, 5);
            const color = colors[index % colors.length];
            html += `
            <div style="display:flex;align-items:center;margin-bottom:10px;gap:10px;">
                <div style="width:70px;text-align:right;font-size:13px;color:#64748b;flex-shrink:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</div>
                <div style="flex:1;height:24px;background:#f1f5f9;border-radius:4px;overflow:hidden;min-width:100px;">
                    <div style="height:100%;width:${barWidth}%;background:${color};border-radius:4px;transition:width 0.5s ease;display:flex;align-items:center;justify-content:flex-end;padding-right:8px;min-width:35px;">
                        <span style="color:white;font-size:12px;font-weight:600;">${value}</span>
                    </div>
                </div>
                <div style="width:40px;font-size:12px;color:#64748b;flex-shrink:0;">${percentage}%</div>
            </div>`;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    },

    // 渲染简洁排名列表
    renderSimpleList(containerId, data, title) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const entries = Object.entries(data);
        if (entries.length === 0) {
            container.innerHTML = '<div class="empty-state"><i class="fa fa-list"></i><h3>暂无数据</h3><p>当前没有统计数据</p></div>';
            return;
        }

        const total = entries.reduce((sum, e) => sum + e[1], 0);
        const colors = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#06b6d4', '#8b5cf6', '#ec4899'];

        let html = `<div style="padding:16px;overflow-x:auto;">
            ${title ? `<h4 style="margin-bottom:16px;text-align:center;color:#1e293b;font-weight:600;font-size:15px;">${title}</h4>` : ''}
            <div style="display:grid;gap:10px;min-width:200px;">`;

        entries.forEach(([label, value], index) => {
            const percentage = ((value / total) * 100).toFixed(1);
            const color = colors[index % colors.length];
            html += `
            <div style="display:flex;align-items:center;padding:10px 12px;background:#f8fafc;border-radius:6px;gap:10px;">
                <div style="width:24px;height:24px;background:${color};border-radius:4px;display:flex;align-items:center;justify-content:center;color:white;font-weight:700;font-size:12px;flex-shrink:0;">${index + 1}</div>
                <div style="flex:1;min-width:0;overflow:hidden;">
                    <div style="font-size:13px;font-weight:600;color:#1e293b;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${label}</div>
                </div>
                <div style="text-align:right;flex-shrink:0;">
                    <span style="font-size:16px;font-weight:700;color:${color};">${value}</span>
                    <span style="font-size:11px;color:#94a3b8;margin-left:2px;">(${percentage}%)</span>
                </div>
            </div>`;
        });

        html += `</div></div>`;
        container.innerHTML = html;
    }
};

// ============================================
// 表单验证工具
// ============================================

const FormValidator = {
    // 验证规则
    rules: {
        required: (value) => value && value.trim() !== '',
        minLength: (value, len) => !value || value.length >= len,
        maxLength: (value, len) => !value || value.length <= len
    },

    // 验证单个字段
    validateField(field, rules) {
        const value = field.value;
        const errorEl = field.nextElementSibling;
        
        for (const rule of rules) {
            const { type, params, message } = rule;
            if (!this.rules[type](value, params)) {
                field.classList.add('error');
                if (errorEl && errorEl.classList.contains('error-msg')) {
                    errorEl.textContent = message;
                    errorEl.style.display = 'block';
                }
                return false;
            }
        }
        
        field.classList.remove('error');
        if (errorEl && errorEl.classList.contains('error-msg')) {
            errorEl.style.display = 'none';
        }
        return true;
    },

    // 验证整个表单
    validate(formId) {
        const form = document.getElementById(formId);
        if (!form) return true;

        const inputs = form.querySelectorAll('input[required], select[required], textarea[required]');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim()) {
                input.classList.add('error');
                const errorEl = input.nextElementSibling;
                if (errorEl && errorEl.classList.contains('error-msg')) {
                    errorEl.textContent = '此项为必填项';
                    errorEl.style.display = 'block';
                }
                isValid = false;
            } else {
                input.classList.remove('error');
                const errorEl = input.nextElementSibling;
                if (errorEl && errorEl.classList.contains('error-msg')) {
                    errorEl.style.display = 'none';
                }
            }
        });

        return isValid;
    }
};

// ============================================
// 图片预览工具
// ============================================

const ImagePreview = {
    // 处理图片上传预览
    setup(inputId, previewId) {
        const input = document.getElementById(inputId);
        const preview = document.getElementById(previewId);
        
        if (!input || !preview) return;

        input.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;

            // 验证文件类型
            if (!file.type.startsWith('image/')) {
                Toast.show('请选择图片文件', 'error');
                return;
            }

            // 验证文件大小（最大2MB）
            if (file.size > 2 * 1024 * 1024) {
                Toast.show('图片大小不能超过2MB', 'error');
                return;
            }

            const reader = new FileReader();
            reader.onload = (e) => {
                preview.src = e.target.result;
                preview.style.display = 'block';
            };
            reader.readAsDataURL(file);
        });
    },

    // 清除预览
    clear(previewId) {
        const preview = document.getElementById(previewId);
        if (preview) {
            preview.src = '';
            preview.style.display = 'none';
        }
    }
};

// ============================================
// 页面初始化
// ============================================

document.addEventListener('DOMContentLoaded', function() {
    DataStore.init();
    NotificationManager.init();

    // 检查登录状态
    if (!window.location.pathname.includes('index.html')) {
        if (!Auth.checkLogin()) {
            window.location.href = 'index.html';
        } else {
            // 登录后检查通知
            checkNotificationsOnLogin();
        }
    }
});

// 登录后检查通知
function checkNotificationsOnLogin() {
    const userId = Auth.currentUser?.id || Auth.currentUser?.username;
    const userRole = Auth.currentRole;

    // 更新未读数量显示
    updateNotificationBadge();
    updatePendingBadge();

    // 检查是否有未读通知
    const unreadCount = NotificationManager.getUnreadCount(userId, userRole);
    if (unreadCount > 0) {
        showNotificationPopup(userId, userRole);
    }
}

// 更新通知红点
function updateNotificationBadge() {
    const userId = Auth.currentUser?.id || Auth.currentUser?.username;
    const userRole = Auth.currentRole;
    const count = NotificationManager.getUnreadCount(userId, userRole);

    document.querySelectorAll('.notification-badge').forEach(badge => {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// 显示通知弹窗
function showNotificationPopup(userId, userRole) {
    const notifications = NotificationManager.getUserNotifications(userId, userRole).slice(0, 5);
    if (notifications.length === 0) return;

    const overlay = document.createElement('div');
    overlay.className = 'notification-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:10000;display:flex;align-items:center;justify-content:center;';

    const popup = document.createElement('div');
    popup.className = 'notification-popup';
    popup.style.cssText = 'background:white;border-radius:16px;max-width:420px;width:90%;max-height:80vh;overflow:hidden;box-shadow:0 20px 60px rgba(0,0,0,0.3);';

    let itemsHtml = notifications.map(n => {
        const icon = getNotificationIcon(n.type);
        const timeAgo = getTimeAgo(n.createTime);
        const isRead = n.read || (n.isAnnouncement && n.readBy?.includes(userId));
        return `
            <div class="notif-item ${isRead ? 'read' : ''}"
                 onclick="handleNotificationClick('${n.id}', '${userId}', '${n.relatedId || ''}', event)"
                 style="padding:16px 20px;border-bottom:1px solid #f0f0f0;cursor:pointer;transition:background 0.2s;display:flex;gap:14px;align-items:flex-start;">
                <div style="width:42px;height:42px;border-radius:12px;background:${getNotificationColor(n.type)};display:flex;align-items:center;justify-content:center;color:white;font-size:18px;flex-shrink:0;">
                    <i class="fa fa-${icon}"></i>
                </div>
                <div style="flex:1;min-width:0;">
                    <div style="font-size:14px;font-weight:600;color:#1a1a1a;margin-bottom:4px;">${n.title}</div>
                    <div style="font-size:13px;color:#666;line-height:1.4;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;">${n.content}</div>
                    <div style="font-size:11px;color:#999;margin-top:6px;">${timeAgo}</div>
                </div>
                ${!isRead ? '<div style="width:8px;height:8px;border-radius:50%;background:#ef4444;flex-shrink:0;margin-top:6px;"></div>' : ''}
            </div>
        `;
    }).join('');

    popup.innerHTML = `
        <div style="padding:20px 24px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;background:linear-gradient(135deg, #4f46e5, #6366f1);color:white;">
            <div style="display:flex;align-items:center;gap:10px;">
                <i class="fa fa-bell" style="font-size:20px;"></i>
                <span style="font-size:17px;font-weight:600;">通知中心</span>
            </div>
            <button onclick="closeNotificationPopup()" style="background:rgba(255,255,255,0.2);border:none;color:white;width:32px;height:32px;border-radius:50%;cursor:pointer;font-size:16px;display:flex;align-items:center;justify-content:center;">
                <i class="fa fa-times"></i>
            </button>
        </div>
        <div style="max-height:400px;overflow-y:auto;">
            ${itemsHtml}
        </div>
        <div style="padding:14px 24px;text-align:center;border-top:1px solid #eee;">
            <button onclick="closeNotificationPopup()" style="background:#f5f5f5;border:none;padding:10px 24px;border-radius:8px;color:#666;font-size:14px;cursor:pointer;font-weight:500;">
                关闭
            </button>
        </div>
    `;

    overlay.appendChild(popup);
    document.body.appendChild(overlay);

    overlay.addEventListener('click', function(e) {
        if (e.target === overlay) closeNotificationPopup();
    });
}

function closeNotificationPopup() {
    const overlay = document.querySelector('.notification-overlay');
    if (overlay) overlay.remove();
}

function getNotificationIcon(type) {
    const icons = {
        'application': 'paper-plane',
        'review': 'check-circle',
        'rejected': 'times-circle',
        'announcement': 'bullhorn',
        'system': 'cog'
    };
    return icons[type] || 'bell';
}

function getNotificationColor(type) {
    const colors = {
        'application': '#4f46e5',
        'review': '#10b981',
        'rejected': '#ef4444',
        'announcement': '#f59e0b',
        'system': '#64748b'
    };
    return colors[type] || '#4f46e5';
}

function getTimeAgo(timeString) {
    const now = new Date();
    const time = new Date(timeString);
    const diff = Math.floor((now - time) / 1000);

    if (diff < 60) return '刚刚';
    if (diff < 3600) return Math.floor(diff / 60) + '分钟前';
    if (diff < 86400) return Math.floor(diff / 3600) + '小时前';
    if (diff < 604800) return Math.floor(diff / 86400) + '天前';
    return time.toLocaleDateString('zh-CN');
}

function handleNotificationClick(notificationId, userId, relatedId, event) {
    event.stopPropagation();
    NotificationManager.markAsRead(notificationId, userId);
    updateNotificationBadge();
    closeNotificationPopup();

    if (relatedId) {
        location.reload();
    }
}

// 打开通知面板
function openNotificationPanel() {
    const userId = Auth.currentUser?.id || Auth.currentUser?.username;
    const userRole = Auth.currentRole;
    const notifications = NotificationManager.getUserNotifications(userId, userRole);

    const overlay = document.createElement('div');
    overlay.id = 'notification-panel-overlay';
    overlay.style.cssText = 'position:fixed;top:0;left:0;right:0;bottom:0;background:rgba(0,0,0,0.5);z-index:9998;';
    overlay.onclick = closeNotificationPanel;

    const panel = document.createElement('div');
    panel.id = 'notification-panel';
    panel.style.cssText = 'position:fixed;top:0;right:0;width:400px;max-width:90vw;height:100vh;background:white;box-shadow:-4px 0 20px rgba(0,0,0,0.15);z-index:9999;display:flex;flex-direction:column;animation:slideInRight 0.3s ease;';

    const notificationsHtml = notifications.length > 0
        ? notifications.map(n => {
            const icon = getNotificationIcon(n.type);
            const timeAgo = getTimeAgo(n.createTime);
            const isRead = n.read || (n.isAnnouncement && n.readBy?.includes(userId));
            return `
                <div class="notif-list-item ${isRead ? 'read' : ''}"
                     onclick="handleNotificationClick('${n.id}', '${userId}', '${n.relatedId || ''}', event)"
                     style="padding:16px 20px;border-bottom:1px solid #f5f5f5;cursor:pointer;transition:background 0.2s;background:${isRead ? '#fafafa' : 'white'};">
                    <div style="display:flex;gap:12px;align-items:flex-start;">
                        <div style="width:40px;height:40px;border-radius:10px;background:${getNotificationColor(n.type)};display:flex;align-items:center;justify-content:center;color:white;font-size:16px;flex-shrink:0;">
                            <i class="fa fa-${icon}"></i>
                        </div>
                        <div style="flex:1;min-width:0;">
                            <div style="font-size:14px;font-weight:${isRead ? '500' : '600'};color:#1a1a1a;margin-bottom:4px;">${n.title}</div>
                            <div style="font-size:13px;color:#666;line-height:1.4;">${n.content}</div>
                            <div style="font-size:11px;color:#999;margin-top:6px;">${timeAgo}</div>
                        </div>
                        ${!isRead ? '<div style="width:8px;height:8px;border-radius:50%;background:#ef4444;flex-shrink:0;"></div>' : ''}
                    </div>
                </div>
            `;
        }).join('')
        : '<div style="padding:60px 20px;text-align:center;color:#999;"><i class="fa fa-bell-slash" style="font-size:48px;margin-bottom:16px;opacity:0.5;"></i><p>暂无通知</p></div>';

    panel.innerHTML = `
        <div style="padding:20px 24px;border-bottom:1px solid #eee;display:flex;align-items:center;justify-content:space-between;background:white;">
            <div style="display:flex;align-items:center;gap:10px;">
                <i class="fa fa-bell" style="font-size:20px;color:#4f46e5;"></i>
                <span style="font-size:17px;font-weight:600;color:#1a1a1a;">通知中心</span>
            </div>
            <div style="display:flex;gap:10px;align-items:center;">
                <button onclick="markAllNotificationsRead('${userId}')" style="background:#f0f0f0;border:none;padding:6px 12px;border-radius:6px;color:#666;font-size:12px;cursor:pointer;">
                    全部已读
                </button>
                <button onclick="closeNotificationPanel()" style="background:none;border:none;color:#999;font-size:20px;cursor:pointer;padding:4px;">
                    <i class="fa fa-times"></i>
                </button>
            </div>
        </div>
        <div style="flex:1;overflow-y:auto;">
            ${notificationsHtml}
        </div>
    `;

    document.body.appendChild(overlay);
    document.body.appendChild(panel);
}

function closeNotificationPanel() {
    const overlay = document.getElementById('notification-panel-overlay');
    if (overlay) overlay.remove();
    const panel = document.getElementById('notification-panel');
    if (panel) panel.remove();
}

function markAllNotificationsRead(userId) {
    const userRole = Auth.currentRole;
    NotificationManager.markAllAsRead(userId, userRole);
    updateNotificationBadge();
    closeNotificationPanel();
    setTimeout(() => openNotificationPanel(), 100);
}

// 获取待审核数量
function getPendingCount() {
    const awards = DataStore.get('awards');
    const userId = Auth.currentUser?.id || Auth.currentUser?.username;
    const userRole = Auth.currentRole;

    if (userRole === 'admin') {
        return awards.filter(a => a.teacherApproved && !a.adminApproved && a.status !== 'rejected').length;
    }
    if (userRole === 'teacher') {
        const classId = Auth.currentUser?.classId;
        return awards.filter(a => a.classId === classId && !a.teacherApproved && a.status !== 'rejected').length;
    }
    return 0;
}

// 更新待审核红点
function updatePendingBadge() {
    const count = getPendingCount();
    document.querySelectorAll('.pending-badge').forEach(badge => {
        if (count > 0) {
            badge.textContent = count > 99 ? '99+' : count;
            badge.style.display = 'flex';
        } else {
            badge.style.display = 'none';
        }
    });
}

// 通用函数
function logout() {
    Auth.logout();
}

function goToPage(page) {
    window.location.href = page;
}

// ============================================
// 通知管理器
// ============================================
const NotificationManager = {
    STORAGE_KEY: 'haojiang_notifications',

    // 初始化通知存储
    init() {
        if (!localStorage.getItem(this.STORAGE_KEY)) {
            localStorage.setItem(this.STORAGE_KEY, JSON.stringify([]));
        }
    },

    // 获取所有通知
    getAll() {
        return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    },

    // 保存通知
    save(notifications) {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(notifications));
    },

    // 添加通知
    add(notification) {
        const notifications = this.getAll();
        const newNotification = {
            id: 'n' + Date.now() + Math.random().toString(36).substr(2, 5),
            ...notification,
            read: false,
            createTime: new Date().toISOString()
        };
        notifications.unshift(newNotification);
        this.save(notifications);
        return newNotification;
    },

    // 发送通知给用户
    sendToUser(userId, userRole, type, title, content, relatedId = null) {
        return this.add({
            userId,
            userRole,
            type, // 'application', 'review', 'announcement'
            title,
            content,
            relatedId
        });
    },

    // 发送通知给教师（班级所有待审核）
    sendToTeacher(classId, type, title, content, relatedId = null) {
        return this.add({
            classId,
            userId: 'teacher_' + classId,
            userRole: 'teacher',
            type,
            title,
            content,
            relatedId,
            target: 'class'
        });
    },

    // 发送通知给管理员
    sendToAdmin(type, title, content, relatedId = null) {
        return this.add({
            userId: 'admin',
            userRole: 'admin',
            type,
            title,
            content,
            relatedId
        });
    },

    // 发送全校公告
    sendAnnouncement(title, content) {
        return this.add({
            userId: 'all',
            userRole: 'all',
            type: 'announcement',
            title,
            content,
            isAnnouncement: true
        });
    },

    // 获取用户未读通知数
    getUnreadCount(userId, userRole) {
        const notifications = this.getAll();
        return notifications.filter(n => {
            if (n.isAnnouncement) {
                if (n.readBy && n.readBy.includes(userId)) return false;
                return true;
            }
            if (n.userRole === 'all' && n.userId === 'all') return true;
            if (n.userRole === 'admin' && userRole === 'admin') return !n.read;
            if (n.userRole === 'teacher' && userRole === 'teacher') return !n.read && n.userId === userId;
            if (n.userRole === 'student' && userRole === 'student') return !n.read && n.userId === userId;
            return false;
        }).length;
    },

    // 获取用户通知列表
    getUserNotifications(userId, userRole) {
        const notifications = this.getAll();
        return notifications.filter(n => {
            if (n.isAnnouncement) return true;
            if (n.userRole === 'admin' && userRole === 'admin') return true;
            if (n.userRole === 'teacher' && userRole === 'teacher') return n.userId === userId;
            if (n.userRole === 'student' && userRole === 'student') return n.userId === userId;
            return false;
        }).sort((a, b) => new Date(b.createTime) - new Date(a.createTime));
    },

    // 标记通知为已读
    markAsRead(notificationId, userId) {
        const notifications = this.getAll();
        const notification = notifications.find(n => n.id === notificationId);
        if (notification) {
            if (notification.isAnnouncement) {
                if (!notification.readBy) notification.readBy = [];
                if (!notification.readBy.includes(userId)) {
                    notification.readBy.push(userId);
                }
            } else {
                notification.read = true;
            }
            this.save(notifications);
        }
    },

    // 全部标记已读
    markAllAsRead(userId, userRole) {
        const notifications = this.getAll();
        notifications.forEach(n => {
            if (n.isAnnouncement) {
                if (!n.readBy) n.readBy = [];
                if (!n.readBy.includes(userId)) {
                    n.readBy.push(userId);
                }
            } else if (n.userId === userId || (userRole === 'admin' && n.userRole === 'admin')) {
                n.read = true;
            }
        });
        this.save(notifications);
    },

    // 删除通知
    delete(notificationId) {
        const notifications = this.getAll();
        const filtered = notifications.filter(n => n.id !== notificationId);
        this.save(filtered);
    },

    // 清空已读通知
    clearRead(userId) {
        const notifications = this.getAll();
        const filtered = notifications.filter(n => {
            if (n.isAnnouncement) return true;
            if (n.userId === userId) return !n.read;
            return true;
        });
        this.save(filtered);
    }
};

// 确认对话框
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}
