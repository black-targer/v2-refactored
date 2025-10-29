// 模态框管理模块
window.ModalManager = {
    // 当前打开的模态框
    currentModal: null,
    
    // 初始化
    init: function() {
        this.bindEvents();
    },
    
    // 绑定事件
    bindEvents: function() {
        // 详情模态框关闭按钮
        const closeDetailBtn = document.getElementById('closeModalBtn');
        if (closeDetailBtn) {
            closeDetailBtn.addEventListener('click', () => this.closeDetailModal());
        }
        
        // 编辑模态框关闭按钮
        const closeEditBtn = document.getElementById('closeEditModalBtn');
        if (closeEditBtn) {
            closeEditBtn.addEventListener('click', () => this.closeEditModal());
        }
        
        // 列设置模态框关闭按钮
        const closeColumnBtn = document.getElementById('closeColumnModalBtn');
        if (closeColumnBtn) {
            closeColumnBtn.addEventListener('click', () => this.closeColumnModal());
        }
        
        // 点击背景关闭模态框
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('fixed') && e.target.classList.contains('inset-0')) {
                this.closeCurrentModal();
            }
        });
        
        // ESC键关闭模态框
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.closeCurrentModal();
            }
        });
    },
    
    // 显示详情模态框
    showDetailModal: function(item) {
        const modal = document.getElementById('detailModal');
        const title = document.getElementById('modalTitle');
        const content = document.getElementById('modalContent');
        
        if (!modal || !title || !content) return;
        
        // 设置标题
        title.textContent = '详情信息';
        
        // 生成详情内容
        content.innerHTML = this.generateDetailContent(item);
        
        // 显示模态框
        this.showModal(modal);
        this.currentModal = 'detail';
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction('view_detail', { item: item });
        }
    },
    
    // 生成详情内容
    generateDetailContent: function(item) {
        let html = '<div class="space-y-6">';
        
        // 按分组显示信息
        for (const [groupKey, group] of Object.entries(AppConfig.columns)) {
            const groupFields = [];
            
            // 收集该分组的字段
            for (const [fieldKey, config] of Object.entries(group.fields)) {
                const value = item[fieldKey];
                if (value !== undefined && value !== null && value !== '') {
                    groupFields.push({
                        key: fieldKey,
                        config: config,
                        value: value
                    });
                }
            }
            
            if (groupFields.length > 0) {
                html += `
                    <div class="border-l-4 border-blue-500 pl-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-3">${group.groupName}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                `;
                
                groupFields.forEach(field => {
                    const formattedValue = this.formatDetailValue(field.value, field.config);
                    html += `
                        <div class="bg-gray-50 p-3 rounded-md">
                            <dt class="text-sm font-medium text-gray-500">${field.config.label}</dt>
                            <dd class="mt-1 text-sm text-gray-900">${formattedValue}</dd>
                        </div>
                    `;
                });
                
                html += '</div></div>';
            }
        }
        
        html += '</div>';
        return html;
    },
    
    // 格式化详情值
    formatDetailValue: function(value, config) {
        if (!value) return '-';
        
        switch (config.type) {
            case 'date':
                return AppUtils.formatDate(value);
            case 'datetime':
                return AppUtils.formatDate(value, 'YYYY-MM-DD HH:mm');
            case 'select':
                if (config.key === 'repairProgress') {
                    const statusStyle = AppUtils.getStatusStyle('repairProgress', value);
                    return `<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyle.class}">
                                <i class="${statusStyle.icon} mr-1"></i> ${value}
                            </span>`;
                }
                return value;
            case 'textarea':
                return `<div class="whitespace-pre-wrap">${this.escapeHtml(value)}</div>`;
            default:
                return this.escapeHtml(value.toString());
        }
    },
    
    // 显示编辑模态框
    showEditModal: function(item) {
        const modal = document.getElementById('editModal');
        const title = document.getElementById('editModalTitle');
        const content = document.getElementById('editModalContent');
        
        if (!modal || !title || !content) return;
        
        // 设置标题
        title.textContent = item ? '编辑信息' : '新增信息';
        
        // 生成编辑表单
        content.innerHTML = this.generateEditForm(item);
        
        // 显示模态框
        this.showModal(modal);
        this.currentModal = 'edit';
        
        // 绑定表单事件
        this.bindEditFormEvents(item);
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction(item ? 'edit_form' : 'create_form', { item: item });
        }
    },
    
    // 生成编辑表单
    generateEditForm: function(item) {
        let html = '<form id="editForm" class="space-y-6">';
        
        // 按分组生成表单字段
        for (const [groupKey, group] of Object.entries(AppConfig.columns)) {
            const groupFields = [];
            
            // 收集该分组的可编辑字段
            for (const [fieldKey, config] of Object.entries(group.fields)) {
                // 显示所有可见字段，无论是新增还是编辑
                if (config.visible !== false) {
                    groupFields.push({
                        key: fieldKey,
                        config: config,
                        value: item ? (item[fieldKey] || '') : ''
                    });
                }
            }
            
            if (groupFields.length > 0) {
                html += `
                    <div class="border-l-4 border-indigo-500 pl-4">
                        <h3 class="text-lg font-semibold text-gray-900 mb-4">${group.groupName}</h3>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                `;
                
                groupFields.forEach(field => {
                    html += this.generateFormField(field.key, field.config, field.value);
                });
                
                html += '</div></div>';
            }
        }
        
        // 表单按钮
        html += `
            <div class="flex justify-end space-x-3 pt-6 border-t">
                <button type="button" id="cancelEdit" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                    取消
                </button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                    ${item ? '保存' : '创建'}
                </button>
            </div>
        `;
        
        html += '</form>';
        return html;
    },
    
    // 生成表单字段
    generateFormField: function(fieldKey, config, value) {
        const required = config.required ? 'required' : '';
        const requiredMark = config.required ? '<span class="text-red-500">*</span>' : '';
        
        let inputHTML = '';
        
        switch (config.type) {
            case 'select':
                inputHTML = this.generateSelectField(fieldKey, config, value);
                break;
            case 'textarea':
                inputHTML = `
                    <textarea id="${fieldKey}" name="${fieldKey}" rows="3" ${required}
                              class="form-input" 
                              placeholder="输入${config.label}">${this.escapeHtml(value)}</textarea>
                `;
                break;
            case 'date':
                inputHTML = `
                    <input type="date" id="${fieldKey}" name="${fieldKey}" ${required}
                           class="form-input" 
                           value="${value}">
                `;
                break;
            case 'datetime':
                // 转换datetime-local格式
                const datetimeValue = value ? value.replace(' ', 'T').substring(0, 16) : '';
                inputHTML = `
                    <input type="datetime-local" id="${fieldKey}" name="${fieldKey}" ${required}
                           class="form-input" 
                           value="${datetimeValue}">
                `;
                break;
            default:
                inputHTML = `
                    <input type="text" id="${fieldKey}" name="${fieldKey}" ${required}
                           class="form-input" 
                           placeholder="输入${config.label}"
                           value="${this.escapeHtml(value)}">
                `;
        }
        
        return `
            <div class="form-group">
                <label for="${fieldKey}" class="form-label">
                    ${config.label} ${requiredMark}
                </label>
                ${inputHTML}
                <div class="form-error hidden" id="${fieldKey}_error"></div>
            </div>
        `;
    },
    
    // 生成选择字段
    generateSelectField: function(fieldKey, config, value) {
        let optionsHTML = '<option value="">请选择</option>';
        
        if (config.options) {
            config.options.forEach(option => {
                const selected = value === option.value ? 'selected' : '';
                optionsHTML += `<option value="${option.value}" ${selected}>${option.label}</option>`;
            });
        }
        
        return `
            <select id="${fieldKey}" name="${fieldKey}" ${config.required ? 'required' : ''}
                    class="form-input">
                ${optionsHTML}
            </select>
        `;
    },
    
    // 绑定编辑表单事件
    bindEditFormEvents: function(item) {
        const form = document.getElementById('editForm');
        const cancelBtn = document.getElementById('cancelEdit');
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleFormSubmit(e, item));
        }
        
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeEditModal());
        }
    },
    
    // 处理表单提交
    handleFormSubmit: function(e, item) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = {};
        
        // 收集表单数据
        for (const [key, value] of formData.entries()) {
            data[key] = value;
        }
        
        // 验证表单
        if (this.validateForm(data)) {
            // 这里应该调用API保存数据
            console.log(item ? '更新数据:' : '创建数据:', data);
            
            // 记录用户操作
            if (window.AuthManager) {
                window.AuthManager.logUserAction(item ? 'update' : 'create', { data: data });
            }
            
            // 关闭模态框
            this.closeEditModal();
            
            // 刷新表格数据
            if (window.TableManager) {
                window.TableManager.loadData();
            }
            
            // 显示成功消息
            this.showSuccessMessage(item ? '更新成功' : '创建成功');
        }
    },
    
    // 验证表单
    validateForm: function(data) {
        let isValid = true;
        
        // 清除之前的错误
        document.querySelectorAll('.form-error').forEach(el => {
            el.classList.add('hidden');
            el.textContent = '';
        });
        
        document.querySelectorAll('.form-input').forEach(el => {
            el.classList.remove('error');
        });
        
        // 验证必填字段
        for (const [groupKey, group] of Object.entries(AppConfig.columns)) {
            for (const [fieldKey, config] of Object.entries(group.fields)) {
                if (config.required) {
                    const value = data[fieldKey];
                    if (!value || value.trim() === '') {
                        this.showFieldError(fieldKey, `${config.label}不能为空`);
                        isValid = false;
                    }
                }
            }
        }
        
        return isValid;
    },
    
    // 显示字段错误
    showFieldError: function(fieldKey, message) {
        const input = document.getElementById(fieldKey);
        const errorEl = document.getElementById(`${fieldKey}_error`);
        
        if (input) {
            input.classList.add('error');
        }
        
        if (errorEl) {
            errorEl.textContent = message;
            errorEl.classList.remove('hidden');
        }
    },
    
    // 显示列设置模态框
    showColumnModal: function() {
        const modal = document.getElementById('columnModal');
        const content = document.getElementById('columnModalContent');
        
        if (!modal || !content) return;
        
        // 生成列设置内容
        content.innerHTML = this.generateColumnSettings();
        
        // 显示模态框
        this.showModal(modal);
        this.currentModal = 'column';
        
        // 绑定列设置事件
        this.bindColumnEvents();
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction('column_settings');
        }
    },
    
    // 生成列设置内容
    generateColumnSettings: function() {
        let html = '<div class="grid grid-cols-1 md:grid-cols-3 gap-6">';
        
        // 按分组显示列设置
        for (const [groupKey, group] of Object.entries(AppConfig.columns)) {
            // 根据分组设置图标和颜色
            let iconClass = 'fas fa-columns';
            let iconColor = 'text-blue-600';
            
            if (groupKey === 'station') {
                iconClass = 'fas fa-gas-pump';
                iconColor = 'text-blue-600';
            } else if (groupKey === 'product') {
                iconClass = 'fas fa-cogs';
                iconColor = 'text-green-600';
            } else if (groupKey === 'repair') {
                iconClass = 'fas fa-wrench';
                iconColor = 'text-red-600';
            }
            
            html += `
                <div>
                    <h3 class="text-lg font-medium text-gray-900 mb-4 flex items-center">
                        <i class="${iconClass} mr-2 ${iconColor}"></i>${group.groupName}
                    </h3>
                    <div class="space-y-2">
            `;
            
            for (const [fieldKey, config] of Object.entries(group.fields)) {
                const setting = window.TableManager.columnSettings[fieldKey] || { visible: config.visible };
                const checked = setting.visible ? 'checked' : '';
                
                html += `
                    <label class="flex items-center">
                        <input type="checkbox" id="col-${fieldKey}" class="column-checkbox mr-2" ${checked}>
                        <span class="text-sm">${config.label}</span>
                    </label>
                `;
            }
            
            html += '</div></div>';
        }
        
        html += '</div>';
        
        // 操作按钮
        html += `
            <div class="mt-6 flex justify-between">
                <div>
                    <button id="selectAllColumns" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors mr-2">
                        全选
                    </button>
                    <button id="deselectAllColumns" class="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors">
                        全不选
                    </button>
                </div>
                <div class="flex space-x-3">
                    <button id="cancelColumnSettings" class="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors">
                        取消
                    </button>
                    <button id="applyColumnSettings" class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors">
                        应用
                    </button>
                </div>
            </div>
        `;
        
        return html;
    },
    
    // 绑定列设置事件
    bindColumnEvents: function() {
        const selectAllBtn = document.getElementById('selectAllColumns');
        const deselectAllBtn = document.getElementById('deselectAllColumns');
        const cancelBtn = document.getElementById('cancelColumnSettings');
        const applyBtn = document.getElementById('applyColumnSettings');
        
        // 全选按钮
        if (selectAllBtn) {
            selectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.column-checkbox').forEach(checkbox => {
                    checkbox.checked = true;
                });
            });
        }
        
        // 全不选按钮
        if (deselectAllBtn) {
            deselectAllBtn.addEventListener('click', () => {
                document.querySelectorAll('.column-checkbox').forEach(checkbox => {
                    checkbox.checked = false;
                });
            });
        }
        
        // 取消按钮
        if (cancelBtn) {
            cancelBtn.addEventListener('click', () => this.closeColumnModal());
        }
        
        // 应用按钮
        if (applyBtn) {
            applyBtn.addEventListener('click', () => this.applyColumnSettings());
        }
    },
    
    // 应用列设置
    applyColumnSettings: function() {
        const newSettings = {};
        let order = 0;
        
        document.querySelectorAll('.column-checkbox').forEach(checkbox => {
            const fieldKey = checkbox.id.replace('col-', '');
            const config = AppUtils.getColumnConfig(fieldKey);
            
            if (config) {
                newSettings[fieldKey] = {
                    visible: checkbox.checked,
                    width: config.width,
                    order: order++
                };
            }
        });
        
        // 保存设置
        if (window.TableManager) {
            window.TableManager.saveColumnSettings(newSettings);
        }
        
        // 关闭模态框
        this.closeColumnModal();
        
        // 显示成功消息
        this.showSuccessMessage('列设置已保存');
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction('apply_column_settings', { settings: newSettings });
        }
    },
    
    // 保存列设置（兼容性方法，调用applyColumnSettings）
    saveColumnSettings: function() {
        this.applyColumnSettings();
    },
    
    // 显示模态框
    showModal: function(modal) {
        modal.classList.remove('hidden', 'opacity-0');
        const content = modal.querySelector('div');
        if (content) {
            content.classList.remove('scale-95');
            content.classList.add('scale-100');
        }
        
        // 添加动画效果
        setTimeout(() => {
            modal.classList.remove('opacity-0');
        }, 10);
    },
    
    // 关闭详情模态框
    closeDetailModal: function() {
        const modal = document.getElementById('detailModal');
        this.hideModal(modal);
        this.currentModal = null;
    },
    
    // 关闭编辑模态框
    closeEditModal: function() {
        const modal = document.getElementById('editModal');
        this.hideModal(modal);
        this.currentModal = null;
    },
    
    // 关闭列设置模态框
    closeColumnModal: function() {
        const modal = document.getElementById('columnModal');
        this.hideModal(modal);
        this.currentModal = null;
    },
    
    // 关闭当前模态框
    closeCurrentModal: function() {
        switch (this.currentModal) {
            case 'detail':
                this.closeDetailModal();
                break;
            case 'edit':
                this.closeEditModal();
                break;
            case 'column':
                this.closeColumnModal();
                break;
        }
    },
    
    // 隐藏模态框
    hideModal: function(modal) {
        if (!modal) return;
        
        modal.classList.add('opacity-0');
        const content = modal.querySelector('div');
        if (content) {
            content.classList.remove('scale-100');
            content.classList.add('scale-95');
        }
        
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    },
    
    // 显示成功消息
    showSuccessMessage: function(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 fade-in';
        toast.textContent = message;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 3000);
    },
    
    // HTML转义
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }
};

// 页面加载完成后初始化模态框管理器
document.addEventListener('DOMContentLoaded', function() {
    window.ModalManager.init();
});