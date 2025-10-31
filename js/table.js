// 表格管理模块
window.TableManager = {
    // 当前数据状态
    currentData: [],
    filteredData: [],
    displayData: [],
    
    // 当前状态
    currentFilters: {},
    currentSort: { field: null, order: 'asc' },
    currentPage: 1,
    pageSize: 10,
    
    // 列显示设置
    columnSettings: {},
    
    // 初始化
    init: function() {
        this.initColumnSettings();
        this.bindEvents();
        this.loadData();
    },
    
    // 初始化列设置
    initColumnSettings: function() {
        // 从本地存储加载列设置，或使用默认设置
        const savedSettings = localStorage.getItem('columnSettings');
        if (savedSettings) {
            try {
                this.columnSettings = JSON.parse(savedSettings);
            } catch (e) {
                this.columnSettings = this.getDefaultColumnSettings();
            }
        } else {
            this.columnSettings = this.getDefaultColumnSettings();
        }
    },
    
    // 获取默认列设置
    getDefaultColumnSettings: function() {
        const settings = {};
        
        // 遍历所有列配置，设置默认显示状态
        for (const group of Object.values(AppConfig.columns)) {
            for (const [key, config] of Object.entries(group.fields)) {
                settings[key] = {
                    visible: config.visible,
                    width: config.width,
                    order: Object.keys(settings).length
                };
            }
        }
        
        return settings;
    },
    
    // 绑定事件
    bindEvents: function() {
        // 搜索按钮
        const searchBtn = document.getElementById('searchBtn');
        if (searchBtn) {
            searchBtn.addEventListener('click', () => this.handleSearch());
        }
        
        // 重置按钮
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => this.handleReset());
        }
        
        // 分页按钮
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.changePage(-1));
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.changePage(1));
        }
        
        // 新增按钮
        const addBtn = document.getElementById('addItemBtn');
        if (addBtn) {
            addBtn.addEventListener('click', () => this.handleAdd());
        }
        
        // 列设置按钮
        const columnBtn = document.getElementById('columnSettingsBtn');
        if (columnBtn) {
            columnBtn.addEventListener('click', () => this.showColumnSettings());
        }
    },
    
    // 加载数据
    loadData: function() {
        // 获取合并的数据
        this.currentData = DataManager.getCombinedData();
        this.applyFiltersAndSort();
        this.renderTable();
        this.updateStatistics();
        this.renderFilters();
    },
    
    // 应用筛选和排序
    applyFiltersAndSort: function() {
        // 应用筛选
        this.filteredData = DataManager.filterData(this.currentData, this.currentFilters);
        
        // 应用排序
        if (this.currentSort.field) {
            this.filteredData = DataManager.sortData(
                this.filteredData, 
                this.currentSort.field, 
                this.currentSort.order
            );
        }
        
        // 重置到第一页
        this.currentPage = 1;
    },
    
    // 渲染表格
    renderTable: function() {
        this.renderTableHeader();
        this.renderTableBody();
        this.updatePagination();
    },
    
    // 渲染表头
    renderTableHeader: function() {
        const tableHeader = document.getElementById('tableHeader');
        if (!tableHeader) return;
        
        // 获取可见列
        const visibleColumns = this.getVisibleColumns();
        
        let headerHTML = '<tr>';
        
        visibleColumns.forEach(columnKey => {
            const config = AppUtils.getColumnConfig(columnKey);
            if (config) {
                const sortClass = this.getSortClass(columnKey);
                const sortable = config.sortable ? 'sortable-header' : '';
                const groupInfo = this.getColumnGroup(columnKey);
                const groupColorClass = groupInfo ? groupInfo.color : 'bg-gray-50 border-gray-200';
                
                headerHTML += `
                    <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider ${sortable} ${sortClass} ${groupColorClass} border-b-2"
                        ${config.sortable ? `onclick="TableManager.handleSort('${columnKey}')"` : ''}
                        data-column="${columnKey}"
                        title="${groupInfo ? groupInfo.name : ''}">
                        ${config.label}
                    </th>
                `;
            }
        });
        
        // 添加操作列
        headerHTML += `
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider actions-column">
                操作
            </th>
        `;
        
        headerHTML += '</tr>';
        tableHeader.innerHTML = headerHTML;
    },
    
    // 渲染表格内容
    renderTableBody: function() {
        const tableBody = document.getElementById('tableBody');
        if (!tableBody) return;
        
        // 获取当前页数据
        const paginatedResult = DataManager.paginateData(
            this.filteredData, 
            this.currentPage, 
            this.pageSize
        );
        
        this.displayData = paginatedResult.data;
        
        if (this.displayData.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="100%" class="px-6 py-8 text-center text-gray-500">
                        <div class="flex flex-col items-center">
                            <i class="fas fa-search text-4xl mb-4 opacity-50"></i>
                            <p>暂无数据</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }
        
        const visibleColumns = this.getVisibleColumns();
        let bodyHTML = '';
        
        this.displayData.forEach((row, index) => {
            bodyHTML += '<tr class="table-row hover:bg-gray-50">';
            
            visibleColumns.forEach(columnKey => {
                const config = AppUtils.getColumnConfig(columnKey);
                const value = row[columnKey] || '';
                const formattedValue = this.formatCellValue(value, config);
                const widthClass = this.getWidthClass(config.width);
                
                // 只有当内容可能被截断时才添加title属性
                const titleAttr = this.shouldShowTooltip(value, formattedValue) ?
                    `title="${this.escapeHtml(value)}"` : '';
                
                bodyHTML += `
                    <td class="table-cell ${widthClass}" ${titleAttr}>
                        ${formattedValue}
                    </td>
                `;
            });
            
            // 操作列
            bodyHTML += `
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                    <div class="flex space-x-2">
                        <button onclick="TableManager.handleView('${index}')" 
                                class="action-btn action-btn-view">
                            <i class="fas fa-eye"></i> 查看
                        </button>
                        <button onclick="TableManager.handleEdit('${index}')" 
                                class="action-btn action-btn-edit admin-only">
                            <i class="fas fa-edit"></i> 编辑
                        </button>
                        <button onclick="TableManager.handleDelete('${index}')" 
                                class="action-btn action-btn-delete admin-only">
                            <i class="fas fa-trash"></i> 删除
                        </button>
                    </div>
                </td>
            `;
            
            bodyHTML += '</tr>';
        });
        
        tableBody.innerHTML = bodyHTML;
        
        // 更新权限
        if (window.AuthManager) {
            window.AuthManager.updateTablePermissions();
        }
    },
    
    // 渲染筛选条件
    renderFilters: function() {
        const filterContent = document.getElementById('filterContent');
        if (!filterContent) return;
        
        // 获取可筛选的列
        const filterableColumns = this.getFilterableColumns();
        
        let filtersHTML = '';
        
        filterableColumns.forEach(columnKey => {
            const config = AppUtils.getColumnConfig(columnKey);
            if (config && config.filterable) {
                filtersHTML += this.createFilterInput(columnKey, config);
            }
        });
        
        filterContent.innerHTML = filtersHTML;
        
        // 绑定筛选输入事件
        this.bindFilterEvents();
    },
    
    // 创建筛选输入
    createFilterInput: function(columnKey, config) {
        const currentValue = this.currentFilters[columnKey] || '';
        
        switch (config.type) {
            case 'select':
                return this.createSelectFilter(columnKey, config, currentValue);
            case 'date':
                return this.createDateFilter(columnKey, config, currentValue);
            default:
                return this.createTextFilter(columnKey, config, currentValue);
        }
    },
    
    // 创建文本筛选
    createTextFilter: function(columnKey, config, currentValue) {
        return `
            <div>
                <label for="filter_${columnKey}" class="block text-sm font-medium text-gray-700 mb-1">
                    ${config.label}
                </label>
                <input type="text" 
                       id="filter_${columnKey}" 
                       class="filter-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       placeholder="输入${config.label}"
                       value="${this.escapeHtml(currentValue)}">
            </div>
        `;
    },
    
    // 创建选择筛选
    createSelectFilter: function(columnKey, config, currentValue) {
        let optionsHTML = '<option value="">全部</option>';
        
        if (config.options) {
            config.options.forEach(option => {
                const selected = currentValue === option.value ? 'selected' : '';
                optionsHTML += `<option value="${option.value}" ${selected}>${option.label}</option>`;
            });
        }
        
        return `
            <div>
                <label for="filter_${columnKey}" class="block text-sm font-medium text-gray-700 mb-1">
                    ${config.label}
                </label>
                <select id="filter_${columnKey}" 
                        class="filter-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                    ${optionsHTML}
                </select>
            </div>
        `;
    },
    
    // 创建日期筛选
    createDateFilter: function(columnKey, config, currentValue) {
        return `
            <div>
                <label for="filter_${columnKey}" class="block text-sm font-medium text-gray-700 mb-1">
                    ${config.label}
                </label>
                <input type="date" 
                       id="filter_${columnKey}" 
                       class="filter-input w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                       value="${currentValue}">
            </div>
        `;
    },
    
    // 绑定筛选事件
    bindFilterEvents: function() {
        const filterInputs = document.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            input.addEventListener('input', (e) => {
                const columnKey = e.target.id.replace('filter_', '');
                this.currentFilters[columnKey] = e.target.value;
            });
            
            // 回车键触发搜索
            input.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.handleSearch();
                }
            });
        });
    },
    
    // 处理搜索
    handleSearch: function() {
        this.applyFiltersAndSort();
        this.renderTable();
        this.updateStatistics();
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction('search', { filters: this.currentFilters });
        }
    },
    
    // 处理重置
    handleReset: function() {
        this.currentFilters = {};
        this.currentSort = { field: null, order: 'asc' };
        this.currentPage = 1;
        
        // 清空筛选输入
        const filterInputs = document.querySelectorAll('.filter-input');
        filterInputs.forEach(input => {
            input.value = '';
        });
        
        this.applyFiltersAndSort();
        this.renderTable();
        this.updateStatistics();
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction('reset_filters');
        }
    },
    
    // 处理排序
    handleSort: function(columnKey) {
        if (this.currentSort.field === columnKey) {
            // 切换排序方向
            this.currentSort.order = this.currentSort.order === 'asc' ? 'desc' : 'asc';
        } else {
            // 新的排序字段
            this.currentSort.field = columnKey;
            this.currentSort.order = 'asc';
        }
        
        this.applyFiltersAndSort();
        this.renderTable();
        
        // 记录用户操作
        if (window.AuthManager) {
            window.AuthManager.logUserAction('sort', { 
                field: columnKey, 
                order: this.currentSort.order 
            });
        }
    },
    
    // 翻页
    changePage: function(direction) {
        const totalPages = Math.ceil(this.filteredData.length / this.pageSize);
        
        if (direction > 0 && this.currentPage < totalPages) {
            this.currentPage++;
        } else if (direction < 0 && this.currentPage > 1) {
            this.currentPage--;
        }
        
        this.renderTableBody();
        this.updatePagination();
    },
    
    // 更新分页信息
    updatePagination: function() {
        const totalItems = this.filteredData.length;
        const totalPages = Math.ceil(totalItems / this.pageSize);
        const startItem = (this.currentPage - 1) * this.pageSize + 1;
        const endItem = Math.min(this.currentPage * this.pageSize, totalItems);
        
        // 更新显示信息
        const displayCount = document.getElementById('displayCount');
        const totalCount = document.getElementById('totalCount');
        const currentPageEl = document.getElementById('currentPage');
        const totalPagesEl = document.getElementById('totalPages');
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        
        if (displayCount) displayCount.textContent = totalItems > 0 ? `${startItem}-${endItem}` : '0';
        if (totalCount) totalCount.textContent = totalItems;
        if (currentPageEl) currentPageEl.textContent = this.currentPage;
        if (totalPagesEl) totalPagesEl.textContent = totalPages;
        
        if (prevBtn) {
            prevBtn.disabled = this.currentPage <= 1;
        }
        if (nextBtn) {
            nextBtn.disabled = this.currentPage >= totalPages;
        }
    },
    
    // 更新统计信息
    updateStatistics: function() {
        const stats = DataManager.getStatistics();
        
        const stationsCount = document.getElementById('stationsCount');
        const productsCount = document.getElementById('productsCount');
        const repairsCount = document.getElementById('repairsCount');
        
        if (stationsCount) stationsCount.textContent = stats.stationsCount;
        if (productsCount) productsCount.textContent = stats.productsCount;
        if (repairsCount) repairsCount.textContent = stats.repairsCount;
    },
    
    // 处理查看
    handleView: function(index) {
        const item = this.displayData[index];
        if (item && window.ModalManager) {
            window.ModalManager.showDetailModal(item);
        }
    },
    
    // 处理编辑
    handleEdit: function(index) {
        if (!window.AuthManager.hasPermission('edit')) {
            window.AuthManager.showPermissionError('您没有编辑权限');
            return;
        }
        
        const item = this.displayData[index];
        if (item && window.ModalManager) {
            window.ModalManager.showEditModal(item);
        }
    },
    
    // 处理删除
    handleDelete: function(index) {
        if (!window.AuthManager.hasPermission('delete')) {
            window.AuthManager.showPermissionError('您没有删除权限');
            return;
        }
        
        const item = this.displayData[index];
        if (item && confirm('确定要删除这条记录吗？')) {
            // 这里应该调用删除API
            console.log('删除记录:', item);
            
            // 记录用户操作
            if (window.AuthManager) {
                window.AuthManager.logUserAction('delete', { item: item });
            }
        }
    },
    
    // 处理新增
    handleAdd: function() {
        if (!window.AuthManager.hasPermission('create')) {
            window.AuthManager.showPermissionError('您没有新增权限');
            return;
        }
        
        if (window.ModalManager) {
            window.ModalManager.showEditModal(null);
        }
    },
    
    // 显示列设置
    showColumnSettings: function() {
        if (window.ModalManager) {
            window.ModalManager.showColumnModal();
        }
    },
    
    // 获取可见列
    getVisibleColumns: function() {
        const visibleColumns = [];
        
        // 根据列设置获取可见列，并按顺序排序
        const sortedColumns = Object.entries(this.columnSettings)
            .filter(([key, setting]) => setting.visible)
            .sort((a, b) => a[1].order - b[1].order)
            .map(([key]) => key);
        
        return sortedColumns;
    },
    
    // 获取可筛选列
    getFilterableColumns: function() {
        const filterableColumns = [];
        
        for (const group of Object.values(AppConfig.columns)) {
            for (const [key, config] of Object.entries(group.fields)) {
                // 筛选条件不受列设置的visible影响，只看配置中的filterable属性
                if (config.filterable) {
                    filterableColumns.push(key);
                }
            }
        }
        
        return filterableColumns.slice(0, 8); // 限制筛选条件数量
    },
    
    // 获取排序样式类
    getSortClass: function(columnKey) {
        if (this.currentSort.field === columnKey) {
            return this.currentSort.order === 'asc' ? 'sort-asc' : 'sort-desc';
        }
        return '';
    },
    
    // 获取宽度样式类
    getWidthClass: function(width) {
        switch (width) {
            case 'narrow': return 'table-cell narrow';
            case 'wide': return 'table-cell wide';
            default: return 'table-cell';
        }
    },
    
    // 格式化单元格值
    formatCellValue: function(value, config) {
        if (!value) return '';
        
        switch (config.type) {
            case 'date':
                return AppUtils.formatDate(value);
            case 'datetime':
                return AppUtils.formatDate(value, 'YYYY-MM-DD HH:mm');
            case 'select':
                if (config.key === 'repairProgress') {
                    const statusStyle = AppUtils.getStatusStyle('repairProgress', value);
                    return `<span class="status-badge ${statusStyle.class}">
                                <i class="${statusStyle.icon}"></i> ${value}
                            </span>`;
                }
                return value;
            default:
                return AppUtils.formatText(value, 30);
        }
    },
    
    // 判断是否需要显示tooltip
    shouldShowTooltip: function(originalValue, formattedValue) {
        if (!originalValue) return false;
        
        // 如果原始值很短（少于20个字符），不显示tooltip
        if (String(originalValue).length <= 20) return false;
        
        // 如果格式化后的值包含HTML标签（如状态标签），不显示tooltip
        if (formattedValue.includes('<span') || formattedValue.includes('<i')) return false;
        
        // 如果原始值和格式化值不同（被截断），显示tooltip
        return String(originalValue) !== formattedValue.replace(/<[^>]*>/g, '');
    },
    
    // 获取列所属的分组信息
    getColumnGroup: function(columnKey) {
        for (const [groupKey, group] of Object.entries(AppConfig.columns)) {
            if (group.fields && group.fields[columnKey]) {
                return {
                    key: groupKey,
                    name: group.groupName,
                    color: group.groupColor || 'bg-gray-50 border-gray-200'
                };
            }
        }
        return null;
    },
    
    // HTML转义
    escapeHtml: function(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    },
    
    // 保存列设置
    saveColumnSettings: function(settings) {
        this.columnSettings = settings;
        localStorage.setItem('columnSettings', JSON.stringify(settings));
        this.renderTable();
        this.renderFilters();
    },
    
    // 清空表格
    clearTable: function() {
        const tableHeader = document.getElementById('tableHeader');
        const tableBody = document.getElementById('tableBody');
        
        if (tableHeader) tableHeader.innerHTML = '';
        if (tableBody) tableBody.innerHTML = '';
        
        this.currentData = [];
        this.filteredData = [];
        this.displayData = [];
        this.updateStatistics();
    }
};

// 页面加载完成后初始化表格管理器
document.addEventListener('DOMContentLoaded', function() {
    // 延迟初始化，确保其他模块已加载
    setTimeout(() => {
        window.TableManager.init();
    }, 100);
});