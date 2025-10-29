// 系统配置文件
window.AppConfig = {
    // 分页配置
    pagination: {
        pageSize: 10,
        maxPageSize: 100
    },
    
    // 用户角色配置
    roles: {
        admin: {
            name: '管理员',
            permissions: ['view', 'create', 'edit', 'delete', 'export', 'import']
        },
        guest: {
            name: '访客',
            permissions: ['view']
        }
    },
    
    // 列配置 - 按照用户要求的分组
    columns: {
        // 油站信息分组
        station: {
            groupName: '油站信息',
            fields: {
                stationId: {
                    key: 'stationId',
                    label: '油站ID',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'narrow',
                    visible: true,
                    required: true
                },
                stationName: {
                    key: 'stationName',
                    label: '油站名称',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: true,
                    required: true
                },
                region: {
                    key: 'region',
                    label: '行政区域（省、市）',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                address: {
                    key: 'address',
                    label: '油站地址',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'wide',
                    visible: false,
                    required: false
                },
                company: {
                    key: 'company',
                    label: '所属企业',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: false
                },
                registerTime: {
                    key: 'registerTime',
                    label: '登记时间',
                    type: 'date',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: false
                }
            }
        },
        
        // 产品信息分组
        product: {
            groupName: '产品信息',
            fields: {
                productSerial: {
                    key: 'productSerial',
                    label: '产品序列号',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: true,
                    required: true
                },
                productTypeCode: {
                    key: 'productTypeCode',
                    label: '产品类别码',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                productTypeDesc: {
                    key: 'productTypeDesc',
                    label: '类别描述',
                    type: 'text',
                    sortable: true,
                    filterable: false,
                    width: 'normal',
                    visible: true,
                    required: true
                },
                productLine: {
                    key: 'productLine',
                    label: '产品线（V|G）',
                    type: 'select',
                    options: [
                        { value: 'V', label: 'V系列' },
                        { value: 'G', label: 'G系列' }
                    ],
                    sortable: true,
                    filterable: true,
                    width: 'narrow',
                    visible: true,
                    required: true
                },
                installSupplier: {
                    key: 'installSupplier',
                    label: '安装供应商',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: false
                },
                installDate: {
                    key: 'installDate',
                    label: '安装日期',
                    type: 'date',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                installStation: {
                    key: 'installStation',
                    label: '安装油站',
                    type: 'text',
                    sortable: true,
                    filterable: false,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                installPerson: {
                    key: 'installPerson',
                    label: '安装人员',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: false
                },
                warrantyDate: {
                    key: 'warrantyDate',
                    label: '质保到期日',
                    type: 'date',
                    sortable: true,
                    filterable: false,
                    width: 'normal',
                    visible: false,
                    required: true
                }
            }
        },
        
        // 维修信息分组
        repair: {
            groupName: '维修情况',
            fields: {
                repairOrderNo: {
                    key: 'repairOrderNo',
                    label: '维修订单号',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: true,
                    required: true
                },
                applyRepairTime: {
                    key: 'applyRepairTime',
                    label: '申请维修时间',
                    type: 'datetime',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: true,
                    required: true
                },
                repairStation: {
                    key: 'repairStation',
                    label: '报修油站',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                repairProductSerial: {
                    key: 'repairProductSerial',
                    label: '报修产品序列号',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                repairServiceProvider: {
                    key: 'repairServiceProvider',
                    label: '维修服务商',
                    type: 'text',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: false
                },
                faultCategory: {
                    key: 'faultCategory',
                    label: '故障类别',
                    type: 'select',
                    options: [
                        { value: '人为损坏', label: '人为损坏' },
                        { value: '自然灾害', label: '自然灾害' },
                        { value: '电气故障', label: '电气故障' },
                        { value: '软件故障', label: '软件故障' },
                        { value: '机械故障', label: '机械故障' }
                    ],
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: true
                },
                faultDescription: {
                    key: 'faultDescription',
                    label: '故障描述',
                    type: 'textarea',
                    sortable: false,
                    filterable: true,
                    width: 'wide',
                    visible: false,
                    required: false
                },
                repairProgress: {
                    key: 'repairProgress',
                    label: '维修进度',
                    type: 'select',
                    options: [
                        { value: '待处理', label: '待处理' },
                        { value: '维修中', label: '维修中' },
                        { value: '已完成', label: '已完成' },
                        { value: '已取消', label: '已取消' }
                    ],
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: true,
                    required: true
                },
                isReplacement: {
                    key: 'isReplacement',
                    label: '是否换件',
                    type: 'select',
                    options: [
                        { value: '是', label: '是' },
                        { value: '否', label: '否' }
                    ],
                    sortable: true,
                    filterable: true,
                    width: 'narrow',
                    visible: false,
                    required: false
                },
                brokenPartReceiveTime: {
                    key: 'brokenPartReceiveTime',
                    label: '坏件收到时间',
                    type: 'datetime',
                    sortable: true,
                    filterable: true,
                    width: 'normal',
                    visible: false,
                    required: false
                }
            }
        }
    },
    
    // 表格视图配置
    views: {
        combined: {
            name: '汇总视图',
            description: '所有数据的综合展示',
            columns: [
                // 默认显示的重要列
                'stationId', 'stationName', 'region',
                'productSerial', 'productTypeDesc', 'productLine', 'installDate',
                'repairOrderNo', 'applyRepairTime', 'repairProgress'
            ]
        }
    },
    
    // 状态映射
    statusMap: {
        repairProgress: {
            '待处理': { class: 'status-pending', icon: 'fas fa-clock' },
            '维修中': { class: 'status-processing', icon: 'fas fa-wrench' },
            '已完成': { class: 'status-completed', icon: 'fas fa-check-circle' },
            '已取消': { class: 'status-cancelled', icon: 'fas fa-times-circle' }
        }
    },
    
    // 导出配置
    export: {
        formats: ['xlsx', 'csv'],
        maxRows: 10000,
        filename: {
            prefix: '油站产品维修数据',
            dateFormat: 'YYYY-MM-DD'
        }
    },
    
    // 导入配置
    import: {
        supportedFormats: ['.xlsx', '.xls', '.csv'],
        maxFileSize: 10 * 1024 * 1024, // 10MB
        requiredColumns: {
            station: ['stationId', 'stationName'],
            product: ['productSerial', 'productTypeCode', 'productLine'],
            repair: ['repairOrderNo', 'repairProductSerial', 'repairProgress']
        }
    }
};

// 工具函数
window.AppUtils = {
    // 获取列配置
    getColumnConfig: function(key) {
        for (const group of Object.values(AppConfig.columns)) {
            if (group.fields[key]) {
                return group.fields[key];
            }
        }
        return null;
    },
    
    // 获取可见列
    getVisibleColumns: function() {
        const visibleColumns = [];
        for (const group of Object.values(AppConfig.columns)) {
            for (const [key, config] of Object.entries(group.fields)) {
                if (config.visible) {
                    visibleColumns.push(key);
                }
            }
        }
        return visibleColumns;
    },
    
    // 格式化日期
    formatDate: function(dateStr, format = 'YYYY-MM-DD') {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        
        switch (format) {
            case 'YYYY-MM-DD':
                return `${year}-${month}-${day}`;
            case 'YYYY-MM-DD HH:mm':
                return `${year}-${month}-${day} ${hours}:${minutes}`;
            default:
                return dateStr;
        }
    },
    
    // 格式化文本（处理过长文本）
    formatText: function(text, maxLength = 20) {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    },
    
    // 获取状态样式
    getStatusStyle: function(field, value) {
        const statusMap = AppConfig.statusMap[field];
        if (statusMap && statusMap[value]) {
            return statusMap[value];
        }
        return { class: '', icon: '' };
    },
    
    // 验证权限
    hasPermission: function(permission) {
        const currentUser = window.AuthManager?.getCurrentUser();
        if (!currentUser) return false;
        
        const role = AppConfig.roles[currentUser.role];
        return role && role.permissions.includes(permission);
    },
    
    // 生成唯一ID
    generateId: function(prefix = 'item') {
        return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    },
    
    // 深拷贝对象
    deepClone: function(obj) {
        if (obj === null || typeof obj !== 'object') return obj;
        if (obj instanceof Date) return new Date(obj.getTime());
        if (obj instanceof Array) return obj.map(item => this.deepClone(item));
        
        const cloned = {};
        for (const key in obj) {
            if (obj.hasOwnProperty(key)) {
                cloned[key] = this.deepClone(obj[key]);
            }
        }
        return cloned;
    }
};