// 身份验证和权限管理模块
window.AuthManager = {
    // 当前用户信息
    currentUser: null,
    
    // 初始化
    init: function() {
        // 检查本地存储中的用户信息
        const savedUser = localStorage.getItem('currentUser');
        if (savedUser) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.showMainInterface();
                this.updateUserPermissions();
            } catch (e) {
                localStorage.removeItem('currentUser');
            }
        }
        
        // 绑定登录表单事件
        this.bindLoginEvents();
    },
    
    // 绑定登录相关事件
    bindLoginEvents: function() {
        const loginForm = document.getElementById('loginForm');
        const logoutBtn = document.getElementById('logoutBtn');
        
        if (loginForm) {
            loginForm.addEventListener('submit', (e) => this.handleLogin(e));
        }
        
        if (logoutBtn) {
            logoutBtn.addEventListener('click', () => this.handleLogout());
        }
    },
    
    // 处理登录
    handleLogin: function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value.trim();
        const loginError = document.getElementById('loginError');
        
        // 清除之前的错误信息
        loginError.classList.add('hidden');
        
        // 验证输入
        if (!username || !password) {
            this.showLoginError('请输入用户名和密码');
            return;
        }
        
        // 验证用户凭据
        const user = this.validateCredentials(username, password);
        if (user) {
            this.currentUser = user;
            
            // 保存到本地存储
            localStorage.setItem('currentUser', JSON.stringify(user));
            
            // 显示主界面
            this.showMainInterface();
            
            // 更新用户权限
            this.updateUserPermissions();
            
            // 加载数据
            if (window.TableManager) {
                window.TableManager.loadData();
            }
            
            // 清空登录表单
            document.getElementById('loginForm').reset();
            
            console.log('用户登录成功:', user);
        } else {
            this.showLoginError('用户名或密码错误，请重试');
        }
    },
    
    // 验证用户凭据
    validateCredentials: function(username, password) {
        // 预定义的用户账户
        const users = {
            'admin': {
                username: 'admin',
                password: '123456',
                role: 'admin',
                displayName: '管理员'
            },
            'guest': {
                username: 'guest',
                password: '123456',
                role: 'guest',
                displayName: '访客'
            }
        };
        
        const user = users[username];
        if (user && user.password === password) {
            return {
                username: user.username,
                role: user.role,
                displayName: user.displayName,
                loginTime: new Date().toISOString(),
                permissions: AppConfig.roles[user.role].permissions
            };
        }
        
        return null;
    },
    
    // 显示登录错误
    showLoginError: function(message) {
        const loginError = document.getElementById('loginError');
        loginError.textContent = message;
        loginError.classList.remove('hidden');
        
        // 3秒后自动隐藏错误信息
        setTimeout(() => {
            loginError.classList.add('hidden');
        }, 3000);
    },
    
    // 显示主界面
    showMainInterface: function() {
        // 隐藏登录模态框
        const loginModal = document.getElementById('loginModal');
        const mainNav = document.getElementById('mainNav');
        const mainContent = document.getElementById('mainContent');
        
        if (loginModal) {
            loginModal.classList.add('hidden');
        }
        
        if (mainNav) {
            mainNav.classList.remove('hidden');
        }
        
        if (mainContent) {
            mainContent.classList.remove('hidden');
        }
        
        // 更新用户显示
        this.updateUserDisplay();
    },
    
    // 更新用户显示
    updateUserDisplay: function() {
        const currentUserEl = document.getElementById('currentUser');
        if (currentUserEl && this.currentUser) {
            currentUserEl.textContent = this.currentUser.displayName;
        }
    },
    
    // 更新用户权限
    updateUserPermissions: function() {
        if (!this.currentUser) return;
        
        const isAdmin = this.currentUser.role === 'admin';
        
        // 控制管理员专用功能的显示
        const adminElements = document.querySelectorAll('.admin-only');
        adminElements.forEach(el => {
            if (isAdmin) {
                el.style.display = el.dataset.originalDisplay || 'inline-flex';
            } else {
                // 保存原始显示状态
                if (!el.dataset.originalDisplay) {
                    el.dataset.originalDisplay = window.getComputedStyle(el).display;
                }
                el.style.display = 'none';
            }
        });
        
        // 控制表格操作按钮
        this.updateTablePermissions();
        
        // 更新导出按钮权限（只有有export权限的用户才能看到）
        const exportBtn = document.getElementById('excelExport');
        if (exportBtn) {
            if (this.hasPermission('export')) {
                exportBtn.style.display = 'inline-flex';
            } else {
                exportBtn.style.display = 'none';
            }
        }
        
        console.log('权限更新完成:', this.currentUser.permissions);
    },
    
    // 更新表格权限
    updateTablePermissions: function() {
        // 这个方法会在表格渲染时被调用
        // 根据用户权限显示或隐藏操作按钮
        const isAdmin = this.hasPermission('edit');
        
        // 移除或禁用编辑、删除按钮
        setTimeout(() => {
            const actionButtons = document.querySelectorAll('.action-btn-edit, .action-btn-delete');
            actionButtons.forEach(btn => {
                if (isAdmin) {
                    btn.style.display = 'inline-flex';
                    btn.disabled = false;
                } else {
                    btn.style.display = 'none';
                }
            });
        }, 100);
    },
    
    // 处理登出
    handleLogout: function() {
        // 清除用户信息
        this.currentUser = null;
        localStorage.removeItem('currentUser');
        
        // 显示登录界面
        this.showLoginInterface();
        
        // 重置表格
        if (window.TableManager) {
            window.TableManager.clearTable();
        }
        
        console.log('用户已登出');
    },
    
    // 显示登录界面
    showLoginInterface: function() {
        const loginModal = document.getElementById('loginModal');
        const mainNav = document.getElementById('mainNav');
        const mainContent = document.getElementById('mainContent');
        const loginError = document.getElementById('loginError');
        
        if (loginModal) {
            loginModal.classList.remove('hidden');
        }
        
        if (mainNav) {
            mainNav.classList.add('hidden');
        }
        
        if (mainContent) {
            mainContent.classList.add('hidden');
        }
        
        if (loginError) {
            loginError.classList.add('hidden');
        }
        
        // 清空登录表单
        const loginForm = document.getElementById('loginForm');
        if (loginForm) {
            loginForm.reset();
        }
    },
    
    // 获取当前用户
    getCurrentUser: function() {
        return this.currentUser;
    },
    
    // 检查是否已登录
    isLoggedIn: function() {
        return this.currentUser !== null;
    },
    
    // 检查权限
    hasPermission: function(permission) {
        if (!this.currentUser || !this.currentUser.permissions) {
            return false;
        }
        
        return this.currentUser.permissions.includes(permission);
    },
    
    // 检查是否为管理员
    isAdmin: function() {
        return this.currentUser && this.currentUser.role === 'admin';
    },
    
    // 检查是否为访客
    isGuest: function() {
        return this.currentUser && this.currentUser.role === 'guest';
    },
    
    // 权限检查装饰器
    requirePermission: function(permission, callback, errorCallback) {
        if (this.hasPermission(permission)) {
            if (typeof callback === 'function') {
                callback();
            }
        } else {
            const message = `您没有执行此操作的权限 (需要: ${permission})`;
            console.warn(message);
            
            if (typeof errorCallback === 'function') {
                errorCallback(message);
            } else {
                alert(message);
            }
        }
    },
    
    // 显示权限错误
    showPermissionError: function(message) {
        // 可以使用更友好的提示方式
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 fade-in';
        toast.textContent = message || '您没有执行此操作的权限';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // 获取用户角色配置
    getRoleConfig: function(role) {
        return AppConfig.roles[role] || null;
    },
    
    // 获取当前用户角色配置
    getCurrentUserRoleConfig: function() {
        if (!this.currentUser) return null;
        return this.getRoleConfig(this.currentUser.role);
    },
    
    // 记录用户操作日志
    logUserAction: function(action, details = {}) {
        if (!this.currentUser) return;
        
        const logEntry = {
            timestamp: new Date().toISOString(),
            user: this.currentUser.username,
            role: this.currentUser.role,
            action: action,
            details: details
        };
        
        console.log('用户操作日志:', logEntry);
        
        // 这里可以添加发送到服务器的逻辑
        // 或保存到本地存储用于审计
    },
    
    // 会话管理
    extendSession: function() {
        if (this.currentUser) {
            this.currentUser.lastActivity = new Date().toISOString();
            localStorage.setItem('currentUser', JSON.stringify(this.currentUser));
        }
    },
    
    // 检查会话是否过期
    checkSessionExpiry: function() {
        if (!this.currentUser || !this.currentUser.lastActivity) return true;
        
        const lastActivity = new Date(this.currentUser.lastActivity);
        const now = new Date();
        const sessionTimeout = 8 * 60 * 60 * 1000; // 8小时
        
        return (now - lastActivity) > sessionTimeout;
    },
    
    // 自动登出过期会话
    autoLogoutIfExpired: function() {
        if (this.isLoggedIn() && this.checkSessionExpiry()) {
            alert('会话已过期，请重新登录');
            this.handleLogout();
        }
    }
};

// 页面加载完成后初始化认证管理器
document.addEventListener('DOMContentLoaded', function() {
    window.AuthManager.init();
    
    // 定期检查会话过期
    setInterval(() => {
        window.AuthManager.autoLogoutIfExpired();
    }, 60000); // 每分钟检查一次
    
    // 用户活动时延长会话
    ['click', 'keypress', 'scroll', 'mousemove'].forEach(event => {
        document.addEventListener(event, () => {
            window.AuthManager.extendSession();
        }, { passive: true });
    });
});