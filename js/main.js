// 主入口文件 - 协调所有模块
window.App = {
    // 应用版本
    version: '2.0.0',
    
    // 初始化状态
    initialized: false,
    
    // 模块依赖关系
    dependencies: {
        'AppConfig': [],
        'AppUtils': ['AppConfig'],
        'DataManager': ['AppConfig', 'AppUtils'],
        'AuthManager': ['AppConfig', 'AppUtils'],
        'TableManager': ['AppConfig', 'AppUtils', 'DataManager', 'AuthManager'],
        'ModalManager': ['AppConfig', 'AppUtils', 'AuthManager'],
        'ExportManager': ['AppConfig', 'AppUtils', 'DataManager', 'AuthManager']
    },
    
    // 初始化应用
    init: function() {
        if (this.initialized) return;
        
        console.log(`🚀 油站产品维修管理系统 V${this.version} 启动中...`);
        
        // 检查浏览器兼容性
        if (!this.checkBrowserCompatibility()) {
            this.showCompatibilityError();
            return;
        }
        
        // 检查依赖库
        if (!this.checkDependencies()) {
            this.showDependencyError();
            return;
        }
        
        // 初始化模块
        this.initializeModules();
        
        // 设置全局错误处理
        this.setupErrorHandling();
        
        // 标记为已初始化
        this.initialized = true;
        
        console.log('✅ 系统初始化完成');
        
        // 显示版本信息
        this.showVersionInfo();
    },
    
    // 检查浏览器兼容性
    checkBrowserCompatibility: function() {
        // 检查必需的API
        const requiredAPIs = [
            'localStorage',
            'JSON',
            'Promise',
            'fetch'
        ];
        
        for (const api of requiredAPIs) {
            if (typeof window[api] === 'undefined') {
                console.error(`❌ 浏览器不支持 ${api} API`);
                return false;
            }
        }
        
        // 检查ES6特性
        try {
            eval('const test = () => {}; class Test {}');
        } catch (e) {
            console.error('❌ 浏览器不支持 ES6 语法');
            return false;
        }
        
        return true;
    },
    
    // 检查依赖库
    checkDependencies: function() {
        const requiredLibraries = [
            { name: 'XLSX', check: () => typeof window.XLSX !== 'undefined' },
            { name: 'Tailwind CSS', check: () => document.querySelector('script[src*="tailwindcss"]') !== null }
        ];
        
        for (const lib of requiredLibraries) {
            if (!lib.check()) {
                console.error(`❌ 缺少依赖库: ${lib.name}`);
                return false;
            }
        }
        
        return true;
    },
    
    // 初始化模块
    initializeModules: function() {
        const initOrder = this.getInitializationOrder();
        
        initOrder.forEach(moduleName => {
            try {
                const module = window[moduleName];
                if (module && typeof module.init === 'function') {
                    console.log(`🔧 初始化模块: ${moduleName}`);
                    module.init();
                } else if (moduleName !== 'AppConfig' && moduleName !== 'AppUtils') {
                    console.warn(`⚠️ 模块 ${moduleName} 未找到或缺少 init 方法`);
                }
            } catch (error) {
                console.error(`❌ 模块 ${moduleName} 初始化失败:`, error);
            }
        });
    },
    
    // 获取初始化顺序
    getInitializationOrder: function() {
        const visited = new Set();
        const order = [];
        
        const visit = (moduleName) => {
            if (visited.has(moduleName)) return;
            visited.add(moduleName);
            
            const deps = this.dependencies[moduleName] || [];
            deps.forEach(dep => visit(dep));
            
            order.push(moduleName);
        };
        
        Object.keys(this.dependencies).forEach(module => visit(module));
        
        return order;
    },
    
    // 设置全局错误处理
    setupErrorHandling: function() {
        // 捕获未处理的错误
        window.addEventListener('error', (event) => {
            console.error('🚨 全局错误:', event.error);
            this.handleError(event.error, '全局错误');
        });
        
        // 捕获未处理的Promise拒绝
        window.addEventListener('unhandledrejection', (event) => {
            console.error('🚨 未处理的Promise拒绝:', event.reason);
            this.handleError(event.reason, 'Promise拒绝');
            event.preventDefault();
        });
        
        // 设置控制台错误监听
        const originalError = console.error;
        console.error = (...args) => {
            originalError.apply(console, args);
            
            // 如果是严重错误，显示用户友好的提示
            const errorMessage = args.join(' ');
            if (errorMessage.includes('❌') || errorMessage.includes('Fatal')) {
                this.showUserError('系统遇到错误，请刷新页面重试');
            }
        };
    },
    
    // 处理错误
    handleError: function(error, context) {
        // 记录错误到本地存储（用于调试）
        this.logError(error, context);
        
        // 根据错误类型决定是否显示给用户
        if (this.isCriticalError(error)) {
            this.showUserError('系统遇到严重错误，请联系管理员');
        }
    },
    
    // 记录错误
    logError: function(error, context) {
        const errorLog = {
            timestamp: new Date().toISOString(),
            context: context,
            message: error.message || error.toString(),
            stack: error.stack,
            userAgent: navigator.userAgent,
            url: window.location.href
        };
        
        try {
            const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
            logs.push(errorLog);
            
            // 只保留最近的50条错误日志
            if (logs.length > 50) {
                logs.splice(0, logs.length - 50);
            }
            
            localStorage.setItem('errorLogs', JSON.stringify(logs));
        } catch (e) {
            console.warn('无法保存错误日志到本地存储');
        }
    },
    
    // 判断是否为严重错误
    isCriticalError: function(error) {
        const criticalPatterns = [
            /network/i,
            /fetch/i,
            /permission/i,
            /authentication/i,
            /authorization/i
        ];
        
        const errorMessage = error.message || error.toString();
        return criticalPatterns.some(pattern => pattern.test(errorMessage));
    },
    
    // 显示兼容性错误
    showCompatibilityError: function() {
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">浏览器不兼容</h1>
                    <p class="text-gray-600 mb-6">
                        您的浏览器版本过低，无法运行此系统。<br>
                        请升级到以下浏览器的最新版本：
                    </p>
                    <ul class="text-left space-y-2 mb-6">
                        <li>• Chrome 80+</li>
                        <li>• Firefox 75+</li>
                        <li>• Safari 13+</li>
                        <li>• Edge 80+</li>
                    </ul>
                    <button onclick="location.reload()" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        重新检测
                    </button>
                </div>
            </div>
        `;
    },
    
    // 显示依赖错误
    showDependencyError: function() {
        document.body.innerHTML = `
            <div class="min-h-screen flex items-center justify-center bg-gray-50">
                <div class="max-w-md w-full bg-white rounded-lg shadow-md p-8 text-center">
                    <div class="text-red-500 text-6xl mb-4">📦</div>
                    <h1 class="text-2xl font-bold text-gray-900 mb-4">资源加载失败</h1>
                    <p class="text-gray-600 mb-6">
                        系统依赖的资源文件加载失败，可能是网络问题导致。
                    </p>
                    <button onclick="location.reload()" 
                            class="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                        重新加载
                    </button>
                </div>
            </div>
        `;
    },
    
    // 显示用户错误
    showUserError: function(message) {
        // 创建错误提示
        const errorDiv = document.createElement('div');
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-6 py-4 rounded-md shadow-lg z-50 max-w-sm';
        errorDiv.innerHTML = `
            <div class="flex items-start">
                <i class="fas fa-exclamation-triangle mr-3 mt-1"></i>
                <div>
                    <div class="font-semibold">系统错误</div>
                    <div class="text-sm mt-1">${message}</div>
                </div>
                <button onclick="this.parentElement.parentElement.remove()" 
                        class="ml-4 text-white hover:text-gray-200">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        document.body.appendChild(errorDiv);
        
        // 5秒后自动移除
        setTimeout(() => {
            if (errorDiv.parentElement) {
                errorDiv.remove();
            }
        }, 5000);
    },
    
    // 显示版本信息
    showVersionInfo: function() {
        if (window.location.search.includes('debug=true')) {
            console.group('🔧 系统信息');
            console.log(`版本: ${this.version}`);
            console.log(`构建时间: ${new Date().toISOString()}`);
            console.log(`用户代理: ${navigator.userAgent}`);
            console.log(`屏幕分辨率: ${screen.width}x${screen.height}`);
            console.log(`视口大小: ${window.innerWidth}x${window.innerHeight}`);
            console.groupEnd();
        }
    },
    
    // 获取系统状态
    getSystemStatus: function() {
        return {
            version: this.version,
            initialized: this.initialized,
            modules: Object.keys(this.dependencies).map(name => ({
                name: name,
                loaded: typeof window[name] !== 'undefined',
                initialized: window[name] && typeof window[name].init === 'function'
            })),
            performance: {
                loadTime: performance.now(),
                memory: performance.memory ? {
                    used: Math.round(performance.memory.usedJSHeapSize / 1024 / 1024) + 'MB',
                    total: Math.round(performance.memory.totalJSHeapSize / 1024 / 1024) + 'MB'
                } : null
            }
        };
    },
    
    // 重启应用
    restart: function() {
        console.log('🔄 重启应用...');
        
        // 清理状态
        this.initialized = false;
        
        // 清理模块状态
        Object.keys(this.dependencies).forEach(moduleName => {
            const module = window[moduleName];
            if (module && typeof module.cleanup === 'function') {
                try {
                    module.cleanup();
                } catch (error) {
                    console.warn(`模块 ${moduleName} 清理失败:`, error);
                }
            }
        });
        
        // 重新初始化
        setTimeout(() => {
            this.init();
        }, 100);
    },
    
    // 导出错误日志
    exportErrorLogs: function() {
        try {
            const logs = JSON.parse(localStorage.getItem('errorLogs') || '[]');
            const dataStr = JSON.stringify(logs, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            const link = document.createElement('a');
            link.href = URL.createObjectURL(dataBlob);
            link.download = `error_logs_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            
            console.log('✅ 错误日志已导出');
        } catch (error) {
            console.error('❌ 导出错误日志失败:', error);
        }
    },
    
    // 清理错误日志
    clearErrorLogs: function() {
        try {
            localStorage.removeItem('errorLogs');
            console.log('✅ 错误日志已清理');
        } catch (error) {
            console.error('❌ 清理错误日志失败:', error);
        }
    }
};

// 页面加载完成后初始化应用
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保所有脚本都已加载
    setTimeout(() => {
        window.App.init();
    }, 50);
});

// 页面卸载前清理
window.addEventListener('beforeunload', function() {
    if (window.App.initialized) {
        console.log('🧹 应用清理中...');
        
        // 保存用户状态
        if (window.AuthManager && window.AuthManager.isLoggedIn()) {
            window.AuthManager.extendSession();
        }
        
        // 保存表格状态
        if (window.TableManager) {
            const currentState = {
                filters: window.TableManager.currentFilters,
                sort: window.TableManager.currentSort,
                page: window.TableManager.currentPage
            };
            
            try {
                localStorage.setItem('tableState', JSON.stringify(currentState));
            } catch (e) {
                console.warn('无法保存表格状态');
            }
        }
    }
});

// 暴露调试接口（仅在开发模式下）
if (window.location.hostname === 'localhost' || window.location.search.includes('debug=true')) {
    window.debug = {
        app: window.App,
        getStatus: () => window.App.getSystemStatus(),
        restart: () => window.App.restart(),
        exportLogs: () => window.App.exportErrorLogs(),
        clearLogs: () => window.App.clearErrorLogs(),
        modules: {
            auth: () => window.AuthManager,
            table: () => window.TableManager,
            modal: () => window.ModalManager,
            export: () => window.ExportManager,
            data: () => window.DataManager
        }
    };
    
    console.log('🔧 调试接口已启用，使用 window.debug 访问');
}