// 导入导出管理模块
window.ExportManager = {
    // 初始化
    init: function() {
        this.bindEvents();
    },
    
    // 绑定事件
    bindEvents: function() {
        // 导出按钮
        const exportBtn = document.getElementById('excelExport');
        if (exportBtn) {
            exportBtn.addEventListener('click', () => this.handleExport());
        }
        
        // 导入按钮
        const importInput = document.getElementById('excelImport');
        if (importInput) {
            importInput.addEventListener('change', (e) => this.handleImport(e));
        }
    },
    
    // 处理导出
    handleExport: function() {
        try {
            // 检查权限
            if (!window.AuthManager.hasPermission('export')) {
                window.AuthManager.showPermissionError('您没有导出权限');
                return;
            }
            
            // 获取要导出的数据
            const data = this.prepareExportData();
            
            if (data.length === 0) {
                alert('没有数据可以导出');
                return;
            }
            
            // 执行导出
            this.exportToExcel(data);
            
            // 记录用户操作
            if (window.AuthManager) {
                window.AuthManager.logUserAction('export', { 
                    recordCount: data.length,
                    timestamp: new Date().toISOString()
                });
            }
            
        } catch (error) {
            console.error('导出失败:', error);
            alert('导出失败，请重试');
        }
    },
    
    // 准备导出数据
    prepareExportData: function() {
        // 获取当前筛选后的数据
        let data = [];
        if (window.TableManager && window.TableManager.filteredData) {
            data = window.TableManager.filteredData;
        } else {
            data = DataManager.getCombinedData();
        }
        
        // 只导出可见列的数据
        const visibleColumns = window.TableManager ? window.TableManager.getVisibleColumns() : [];
        
        return data.map(row => {
            const exportRow = {};
            
            visibleColumns.forEach(columnKey => {
                const config = AppUtils.getColumnConfig(columnKey);
                if (config) {
                    const value = row[columnKey] || '';
                    exportRow[config.label] = this.formatExportValue(value, config);
                }
            });
            
            return exportRow;
        });
    },
    
    // 格式化导出值
    formatExportValue: function(value, config) {
        if (!value) return '';
        
        switch (config.type) {
            case 'date':
                return AppUtils.formatDate(value);
            case 'datetime':
                return AppUtils.formatDate(value, 'YYYY-MM-DD HH:mm');
            case 'select':
                // 对于选择类型，导出显示值而不是原始值
                if (config.options) {
                    const option = config.options.find(opt => opt.value === value);
                    return option ? option.label : value;
                }
                return value;
            default:
                return value.toString();
        }
    },
    
    // 导出到Excel
    exportToExcel: function(data) {
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        
        // 创建工作表
        const ws = XLSX.utils.json_to_sheet(data);
        
        // 设置列宽
        const colWidths = this.calculateColumnWidths(data);
        ws['!cols'] = colWidths;
        
        // 设置表头样式
        this.setHeaderStyle(ws, data);
        
        // 添加工作表到工作簿
        XLSX.utils.book_append_sheet(wb, ws, '汇总数据');
        
        // 生成文件名
        const fileName = this.generateFileName();
        
        // 导出文件
        XLSX.writeFile(wb, fileName);
        
        // 显示成功消息
        this.showSuccessMessage(`数据已导出到 ${fileName}`);
    },
    
    // 计算列宽
    calculateColumnWidths: function(data) {
        if (data.length === 0) return [];
        
        const colWidths = [];
        const headers = Object.keys(data[0]);
        
        headers.forEach((header, index) => {
            let maxWidth = header.length;
            
            // 检查数据中的最大宽度
            data.forEach(row => {
                const cellValue = row[header] ? row[header].toString() : '';
                maxWidth = Math.max(maxWidth, cellValue.length);
            });
            
            // 设置合理的列宽范围
            colWidths[index] = { 
                wch: Math.min(Math.max(maxWidth, 10), 50) 
            };
        });
        
        return colWidths;
    },
    
    // 设置表头样式
    setHeaderStyle: function(ws, data) {
        if (data.length === 0) return;
        
        const headers = Object.keys(data[0]);
        const range = XLSX.utils.decode_range(ws['!ref']);
        
        // 设置表头样式
        for (let col = range.s.c; col <= range.e.c; col++) {
            const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col });
            if (ws[cellAddress]) {
                ws[cellAddress].s = {
                    font: { bold: true, color: { rgb: "FFFFFF" } },
                    fill: { fgColor: { rgb: "4F81BD" } },
                    alignment: { horizontal: "center", vertical: "center" }
                };
            }
        }
    },
    
    // 生成文件名
    generateFileName: function() {
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        return `油站产品维修数据_${year}${month}${day}_${hours}${minutes}.xlsx`;
    },
    
    // 处理导入
    handleImport: function(event) {
        try {
            // 检查权限
            if (!window.AuthManager.hasPermission('import')) {
                window.AuthManager.showPermissionError('您没有导入权限');
                event.target.value = ''; // 清空文件选择
                return;
            }
            
            const file = event.target.files[0];
            if (!file) return;
            
            // 验证文件类型
            if (!this.validateFileType(file)) {
                alert('请选择有效的Excel文件 (.xlsx, .xls)');
                event.target.value = '';
                return;
            }
            
            // 验证文件大小
            if (!this.validateFileSize(file)) {
                alert(`文件大小超过限制 (${AppConfig.import.maxFileSize / 1024 / 1024}MB)`);
                event.target.value = '';
                return;
            }
            
            // 读取文件
            this.readExcelFile(file);
            
        } catch (error) {
            console.error('导入失败:', error);
            alert('导入失败，请重试');
            event.target.value = '';
        }
    },
    
    // 验证文件类型
    validateFileType: function(file) {
        const allowedTypes = AppConfig.import.supportedFormats;
        const fileExtension = '.' + file.name.split('.').pop().toLowerCase();
        return allowedTypes.includes(fileExtension);
    },
    
    // 验证文件大小
    validateFileSize: function(file) {
        return file.size <= AppConfig.import.maxFileSize;
    },
    
    // 读取Excel文件
    readExcelFile: function(file) {
        const reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                const data = new Uint8Array(e.target.result);
                const workbook = XLSX.read(data, { type: 'array' });
                
                // 获取第一个工作表
                const firstSheetName = workbook.SheetNames[0];
                const worksheet = workbook.Sheets[firstSheetName];
                
                // 转换为JSON
                const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
                
                // 处理导入数据
                this.processImportData(jsonData);
                
            } catch (error) {
                console.error('文件读取失败:', error);
                alert('文件读取失败，请检查文件格式');
            }
        };
        
        reader.onerror = () => {
            alert('文件读取失败');
        };
        
        reader.readAsArrayBuffer(file);
    },
    
    // 处理导入数据
    processImportData: function(rawData) {
        if (rawData.length < 2) {
            alert('文件中没有有效数据');
            return;
        }
        
        // 第一行是表头
        const headers = rawData[0];
        const dataRows = rawData.slice(1);
        
        // 验证表头
        const validationResult = this.validateHeaders(headers);
        if (!validationResult.valid) {
            alert(`表头验证失败: ${validationResult.message}`);
            return;
        }
        
        // 转换数据格式
        const importData = this.convertImportData(headers, dataRows);
        
        // 验证数据
        const dataValidation = this.validateImportData(importData);
        if (!dataValidation.valid) {
            alert(`数据验证失败: ${dataValidation.message}`);
            return;
        }
        
        // 显示导入预览
        this.showImportPreview(importData);
    },
    
    // 验证表头
    validateHeaders: function(headers) {
        // 创建表头映射
        const headerMap = {};
        headers.forEach((header, index) => {
            if (header) {
                headerMap[header.trim()] = index;
            }
        });
        
        // 检查必需的列
        const missingColumns = [];
        
        // 检查每个分组的必需列
        for (const [groupKey, requiredColumns] of Object.entries(AppConfig.import.requiredColumns)) {
            for (const columnKey of requiredColumns) {
                const config = AppUtils.getColumnConfig(columnKey);
                if (config && !headerMap[config.label]) {
                    missingColumns.push(config.label);
                }
            }
        }
        
        if (missingColumns.length > 0) {
            return {
                valid: false,
                message: `缺少必需的列: ${missingColumns.join(', ')}`
            };
        }
        
        return { valid: true };
    },
    
    // 转换导入数据
    convertImportData: function(headers, dataRows) {
        const convertedData = [];
        
        dataRows.forEach((row, rowIndex) => {
            if (row.some(cell => cell !== null && cell !== undefined && cell !== '')) {
                const item = {};
                
                headers.forEach((header, colIndex) => {
                    if (header) {
                        const cleanHeader = header.trim();
                        const value = row[colIndex];
                        
                        // 根据表头找到对应的字段配置
                        const fieldConfig = this.findFieldByLabel(cleanHeader);
                        if (fieldConfig) {
                            item[fieldConfig.key] = this.convertCellValue(value, fieldConfig.config);
                        }
                    }
                });
                
                convertedData.push(item);
            }
        });
        
        return convertedData;
    },
    
    // 根据标签查找字段配置
    findFieldByLabel: function(label) {
        for (const group of Object.values(AppConfig.columns)) {
            for (const [key, config] of Object.entries(group.fields)) {
                if (config.label === label) {
                    return { key, config };
                }
            }
        }
        return null;
    },
    
    // 转换单元格值
    convertCellValue: function(value, config) {
        if (value === null || value === undefined || value === '') {
            return '';
        }
        
        switch (config.type) {
            case 'date':
            case 'datetime':
                // 处理Excel日期格式
                if (typeof value === 'number') {
                    const date = new Date((value - 25569) * 86400 * 1000);
                    return config.type === 'date' 
                        ? AppUtils.formatDate(date.toISOString())
                        : AppUtils.formatDate(date.toISOString(), 'YYYY-MM-DD HH:mm');
                }
                return value.toString();
            case 'select':
                // 对于选择类型，尝试匹配显示值到实际值
                if (config.options) {
                    const option = config.options.find(opt => opt.label === value.toString());
                    return option ? option.value : value.toString();
                }
                return value.toString();
            default:
                return value.toString();
        }
    },
    
    // 验证导入数据
    validateImportData: function(data) {
        const errors = [];
        
        data.forEach((item, index) => {
            // 验证必填字段
            for (const group of Object.values(AppConfig.columns)) {
                for (const [key, config] of Object.entries(group.fields)) {
                    if (config.required && (!item[key] || item[key].toString().trim() === '')) {
                        errors.push(`第${index + 1}行: ${config.label}不能为空`);
                    }
                }
            }
        });
        
        if (errors.length > 0) {
            return {
                valid: false,
                message: errors.slice(0, 5).join('\n') + (errors.length > 5 ? '\n...' : '')
            };
        }
        
        return { valid: true };
    },
    
    // 显示导入预览
    showImportPreview: function(data) {
        const message = `
            准备导入 ${data.length} 条记录
            
            预览前3条数据:
            ${data.slice(0, 3).map((item, index) => 
                `${index + 1}. ${JSON.stringify(item, null, 2)}`
            ).join('\n\n')}
            
            确定要导入这些数据吗？
        `;
        
        if (confirm(message)) {
            this.executeImport(data);
        }
    },
    
    // 执行导入
    executeImport: function(data) {
        try {
            // 这里应该调用API保存数据
            console.log('导入数据:', data);
            
            // 模拟导入成功
            this.showSuccessMessage(`成功导入 ${data.length} 条记录`);
            
            // 刷新表格数据
            if (window.TableManager) {
                // 这里应该重新从服务器加载数据
                // 现在只是简单地刷新当前数据
                window.TableManager.loadData();
            }
            
            // 记录用户操作
            if (window.AuthManager) {
                window.AuthManager.logUserAction('import', { 
                    recordCount: data.length,
                    timestamp: new Date().toISOString()
                });
            }
            
            // 清空文件选择
            const importInput = document.getElementById('excelImport');
            if (importInput) {
                importInput.value = '';
            }
            
        } catch (error) {
            console.error('导入执行失败:', error);
            alert('导入执行失败，请重试');
        }
    },
    
    // 显示成功消息
    showSuccessMessage: function(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded-md shadow-lg z-50 fade-in';
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-check-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    },
    
    // 显示错误消息
    showErrorMessage: function(message) {
        const toast = document.createElement('div');
        toast.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded-md shadow-lg z-50 fade-in';
        toast.innerHTML = `
            <div class="flex items-center">
                <i class="fas fa-exclamation-circle mr-2"></i>
                <span>${message}</span>
            </div>
        `;
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.remove();
        }, 4000);
    },
    
    // 生成导入模板
    generateImportTemplate: function() {
        const templateData = [];
        const headers = {};
        
        // 收集所有必需的列标题
        for (const group of Object.values(AppConfig.columns)) {
            for (const [key, config] of Object.entries(group.fields)) {
                if (config.required) {
                    headers[config.label] = '';
                }
            }
        }
        
        // 添加示例数据行
        templateData.push(headers);
        
        // 创建工作簿
        const wb = XLSX.utils.book_new();
        const ws = XLSX.utils.json_to_sheet(templateData);
        
        // 添加工作表
        XLSX.utils.book_append_sheet(wb, ws, '导入模板');
        
        // 导出模板
        XLSX.writeFile(wb, '导入模板.xlsx');
        
        this.showSuccessMessage('导入模板已生成');
    }
};

// 页面加载完成后初始化导出管理器
document.addEventListener('DOMContentLoaded', function() {
    window.ExportManager.init();
});