// 数据管理模块
window.DataManager = {
    // 测试数据
    testData: {
        // 油站数据
        stations: [
            { 
                stationId: 'S001', 
                stationName: '城东加油站', 
                region: '东城区，北京市', 
                address: '东城区东方路123号', 
                company: '中石化北京分公司',
                registerTime: '2023-01-15' 
            },
            { 
                stationId: 'S002', 
                stationName: '城西加油站', 
                region: '西城区，北京市', 
                address: '西城区西湖路45号', 
                company: '中石油北京分公司',
                registerTime: '2023-02-20' 
            },
            { 
                stationId: 'S003', 
                stationName: '城南加油站', 
                region: '朝阳区，北京市', 
                address: '朝阳区南湖路67号', 
                company: '中石化北京分公司',
                registerTime: '2023-03-10' 
            },
            { 
                stationId: 'S004', 
                stationName: '城北加油站', 
                region: '海淀区，北京市', 
                address: '海淀区北京路89号', 
                company: '中石油北京分公司',
                registerTime: '2023-04-05' 
            },
            { 
                stationId: 'S005', 
                stationName: '中心加油站', 
                region: '东城区，北京市', 
                address: '东城区中心大道10号', 
                company: '中石化北京分公司',
                registerTime: '2023-05-18' 
            },
            { 
                stationId: 'S006', 
                stationName: '高新区加油站', 
                region: '海淀区，北京市', 
                address: '海淀区科技路22号', 
                company: '中石油北京分公司',
                registerTime: '2023-06-30' 
            },
            { 
                stationId: 'S007', 
                stationName: '工业园区加油站', 
                region: '大兴区，北京市', 
                address: '大兴区工业路33号', 
                company: '中石化北京分公司',
                registerTime: '2023-07-12' 
            },
            { 
                stationId: 'S008', 
                stationName: '滨海加油站', 
                region: '通州区，北京市', 
                address: '通州区海景路44号', 
                company: '中石油北京分公司',
                registerTime: '2023-08-15' 
            },
            { 
                stationId: 'S009', 
                stationName: '山区加油站', 
                region: '房山区，北京市', 
                address: '房山区山路55号', 
                company: '中石化北京分公司',
                registerTime: '2023-09-20' 
            },
            { 
                stationId: 'S010', 
                stationName: '河区加油站', 
                region: '顺义区，北京市', 
                address: '顺义区河路66号', 
                company: '中石油北京分公司',
                registerTime: '2023-10-01' 
            },
            { 
                stationId: 'S011', 
                stationName: '湖区别墅区加油站', 
                region: '昌平区，北京市', 
                address: '昌平区湖光路77号', 
                company: '中石化北京分公司',
                registerTime: '2023-11-11' 
            },
            { 
                stationId: 'S012', 
                stationName: '森林公园加油站', 
                region: '密云区，北京市', 
                address: '密云区公园路88号', 
                company: '中石油北京分公司',
                registerTime: '2023-12-25' 
            }
        ],
        
        // 产品数据
        products: [
            { 
                productSerial: 'P001', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'V', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-01-20', 
                installStation: 'S001',
                installPerson: '张工程师',
                warrantyDate: '2026-01-19' 
            },
            { 
                productSerial: 'P002', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'V', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-01-20', 
                installStation: 'S001',
                installPerson: '李工程师',
                warrantyDate: '2026-01-19' 
            },
            { 
                productSerial: 'P003', 
                productTypeCode: 'TC002', 
                productTypeDesc: '储油罐', 
                productLine: 'G', 
                installSupplier: '天津石化设备公司',
                installDate: '2023-01-18', 
                installStation: 'S001',
                installPerson: '王工程师',
                warrantyDate: '2028-01-17' 
            },
            { 
                productSerial: 'P004', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'V', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-02-25', 
                installStation: 'S002',
                installPerson: '赵工程师',
                warrantyDate: '2026-02-24' 
            },
            { 
                productSerial: 'P005', 
                productTypeCode: 'TC003', 
                productTypeDesc: '监控系统', 
                productLine: 'G', 
                installSupplier: '上海智能科技公司',
                installDate: '2023-02-26', 
                installStation: 'S002',
                installPerson: '孙工程师',
                warrantyDate: '2025-02-25' 
            },
            { 
                productSerial: 'P006', 
                productTypeCode: 'TC004', 
                productTypeDesc: '支付终端', 
                productLine: 'V', 
                installSupplier: '深圳支付设备公司',
                installDate: '2023-03-15', 
                installStation: 'S003',
                installPerson: '周工程师',
                warrantyDate: '2025-03-14' 
            },
            { 
                productSerial: 'P007', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'G', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-03-16', 
                installStation: 'S003',
                installPerson: '吴工程师',
                warrantyDate: '2026-03-15' 
            },
            { 
                productSerial: 'P008', 
                productTypeCode: 'TC005', 
                productTypeDesc: '消防设备', 
                productLine: 'V', 
                installSupplier: '北京消防设备公司',
                installDate: '2023-04-10', 
                installStation: 'S004',
                installPerson: '郑工程师',
                warrantyDate: '2027-04-09' 
            },
            { 
                productSerial: 'P009', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'V', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-04-08', 
                installStation: 'S004',
                installPerson: '钱工程师',
                warrantyDate: '2026-04-07' 
            },
            { 
                productSerial: 'P010', 
                productTypeCode: 'TC002', 
                productTypeDesc: '储油罐', 
                productLine: 'G', 
                installSupplier: '天津石化设备公司',
                installDate: '2023-05-22', 
                installStation: 'S005',
                installPerson: '冯工程师',
                warrantyDate: '2028-05-21' 
            },
            { 
                productSerial: 'P011', 
                productTypeCode: 'TC006', 
                productTypeDesc: '照明系统', 
                productLine: 'V', 
                installSupplier: '北京照明设备公司',
                installDate: '2023-05-23', 
                installStation: 'S005',
                installPerson: '陈工程师',
                warrantyDate: '2025-05-22' 
            },
            { 
                productSerial: 'P012', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'G', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-07-05', 
                installStation: 'S006',
                installPerson: '褚工程师',
                warrantyDate: '2026-07-04' 
            },
            { 
                productSerial: 'P013', 
                productTypeCode: 'TC003', 
                productTypeDesc: '监控系统', 
                productLine: 'V', 
                installSupplier: '上海智能科技公司',
                installDate: '2023-07-18', 
                installStation: 'S007',
                installPerson: '卫工程师',
                warrantyDate: '2025-07-17' 
            },
            { 
                productSerial: 'P014', 
                productTypeCode: 'TC004', 
                productTypeDesc: '支付终端', 
                productLine: 'G', 
                installSupplier: '深圳支付设备公司',
                installDate: '2023-08-20', 
                installStation: 'S008',
                installPerson: '蒋工程师',
                warrantyDate: '2025-08-19' 
            },
            { 
                productSerial: 'P015', 
                productTypeCode: 'TC005', 
                productTypeDesc: '消防设备', 
                productLine: 'V', 
                installSupplier: '北京消防设备公司',
                installDate: '2023-09-25', 
                installStation: 'S009',
                installPerson: '沈工程师',
                warrantyDate: '2027-09-24' 
            },
            { 
                productSerial: 'P016', 
                productTypeCode: 'TC006', 
                productTypeDesc: '照明系统', 
                productLine: 'G', 
                installSupplier: '北京照明设备公司',
                installDate: '2023-10-05', 
                installStation: 'S010',
                installPerson: '韩工程师',
                warrantyDate: '2025-10-04' 
            },
            { 
                productSerial: 'P017', 
                productTypeCode: 'TC001', 
                productTypeDesc: '加油机', 
                productLine: 'V', 
                installSupplier: '北京设备安装公司',
                installDate: '2023-11-15', 
                installStation: 'S011',
                installPerson: '杨工程师',
                warrantyDate: '2026-11-14' 
            }
        ],
        
        // 维修数据
        repairs: [
            { 
                repairOrderNo: 'R001', 
                repairProductSerial: 'P001', 
                applyRepairTime: '2023-06-10 09:30:00', 
                repairStation: 'S001', 
                repairServiceProvider: '北京维修服务公司',
                faultCategory: '机械故障', 
                faultDescription: '加油枪无法正常工作，需要更换密封件',
                repairProgress: '已完成',
                isReplacement: true,
                brokenPartReceiveTime: '2023-06-12 14:20:00'
            },
            { 
                repairOrderNo: 'R002', 
                repairProductSerial: 'P004', 
                applyRepairTime: '2023-07-15 14:15:00', 
                repairStation: 'S002', 
                repairServiceProvider: '天津设备维修中心',
                faultCategory: '电气故障', 
                faultDescription: '显示屏无法显示，电路板故障',
                repairProgress: '已完成',
                isReplacement: true,
                brokenPartReceiveTime: '2023-07-17 10:30:00'
            },
            { 
                repairOrderNo: 'R003', 
                repairProductSerial: 'P005', 
                applyRepairTime: '2023-08-05 10:45:00', 
                repairStation: 'S002', 
                repairServiceProvider: '上海智能维修公司',
                faultCategory: '软件故障', 
                faultDescription: '监控系统软件崩溃，需要重新安装',
                repairProgress: '已完成',
                isReplacement: false,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R004', 
                repairProductSerial: 'P006', 
                applyRepairTime: '2023-09-20 16:20:00', 
                repairStation: 'S003', 
                repairServiceProvider: '深圳支付维修服务',
                faultCategory: '软件故障', 
                faultDescription: '支付终端无法连接网络，通信模块故障',
                repairProgress: '已完成',
                isReplacement: true,
                brokenPartReceiveTime: '2023-09-22 11:15:00'
            },
            { 
                repairOrderNo: 'R005', 
                repairProductSerial: 'P008', 
                applyRepairTime: '2023-10-10 08:30:00', 
                repairStation: 'S004', 
                repairServiceProvider: '北京消防维修公司',
                faultCategory: '机械故障', 
                faultDescription: '灭火器压力不足，需要更换',
                repairProgress: '已完成',
                isReplacement: true,
                brokenPartReceiveTime: '2023-10-12 13:45:00'
            },
            { 
                repairOrderNo: 'R006', 
                repairProductSerial: 'P010', 
                applyRepairTime: '2023-11-05 11:20:00', 
                repairStation: 'S005', 
                repairServiceProvider: '天津石化维修中心',
                faultCategory: '人为损坏', 
                faultDescription: '储油罐外壳被撞击损坏，需要修复',
                repairProgress: '已完成',
                isReplacement: false,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R007', 
                repairProductSerial: 'P012', 
                applyRepairTime: '2023-12-15 13:10:00', 
                repairStation: 'S006', 
                repairServiceProvider: '北京维修服务公司',
                faultCategory: '机械故障', 
                faultDescription: '加油机流量计不准确，需要校准',
                repairProgress: '已完成',
                isReplacement: false,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R008', 
                repairProductSerial: 'P013', 
                applyRepairTime: '2024-01-20 09:50:00', 
                repairStation: 'S007', 
                repairServiceProvider: '上海智能维修公司',
                faultCategory: '电气故障', 
                faultDescription: '监控摄像头无法录像，存储设备故障',
                repairProgress: '已完成',
                isReplacement: true,
                brokenPartReceiveTime: '2024-01-22 15:30:00'
            },
            { 
                repairOrderNo: 'R009', 
                repairProductSerial: 'P015', 
                applyRepairTime: '2024-02-10 14:40:00', 
                repairStation: 'S009', 
                repairServiceProvider: '北京消防维修公司',
                faultCategory: '机械故障', 
                faultDescription: '消防泵无法启动，电机故障',
                repairProgress: '已完成',
                isReplacement: true,
                brokenPartReceiveTime: '2024-02-12 10:20:00'
            },
            { 
                repairOrderNo: 'R010', 
                repairProductSerial: 'P002', 
                applyRepairTime: '2024-03-05 10:15:00', 
                repairStation: 'S001', 
                repairServiceProvider: '北京维修服务公司',
                faultCategory: '电气故障', 
                faultDescription: '加油机电路板老化，需要更换',
                repairProgress: '维修中',
                isReplacement: true,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R011', 
                repairProductSerial: 'P007', 
                applyRepairTime: '2024-03-12 15:25:00', 
                repairStation: 'S003', 
                repairServiceProvider: '北京维修服务公司',
                faultCategory: '机械故障', 
                faultDescription: '加油软管破损，需要更换',
                repairProgress: '维修中',
                isReplacement: true,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R012', 
                repairProductSerial: 'P009', 
                applyRepairTime: '2024-03-18 11:35:00', 
                repairStation: 'S004', 
                repairServiceProvider: '北京维修服务公司',
                faultCategory: '软件故障', 
                faultDescription: '加油机系统频繁重启，软件不稳定',
                repairProgress: '待处理',
                isReplacement: false,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R013', 
                repairProductSerial: 'P011', 
                applyRepairTime: '2024-03-20 08:45:00', 
                repairStation: 'S005', 
                repairServiceProvider: '北京照明维修公司',
                faultCategory: '电气故障', 
                faultDescription: '照明系统部分灯具不亮，线路故障',
                repairProgress: '待处理',
                isReplacement: false,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R014', 
                repairProductSerial: 'P014', 
                applyRepairTime: '2024-03-22 16:55:00', 
                repairStation: 'S008', 
                repairServiceProvider: '深圳支付维修服务',
                faultCategory: '软件故障', 
                faultDescription: '支付终端无法处理银行卡支付',
                repairProgress: '待处理',
                isReplacement: false,
                brokenPartReceiveTime: null
            },
            { 
                repairOrderNo: 'R015', 
                repairProductSerial: 'P016', 
                applyRepairTime: '2024-03-25 12:05:00', 
                repairStation: 'S010', 
                repairServiceProvider: '北京照明维修公司',
                faultCategory: '自然灾害', 
                faultDescription: '照明设备被雷击损坏',
                repairProgress: '已取消',
                isReplacement: false,
                brokenPartReceiveTime: null
            }
        ]
    },
    
    // 合并数据生成汇总视图
    getCombinedData: function() {
        const combinedData = [];
        
        // 以产品为主体，关联油站和维修信息
        this.testData.products.forEach(product => {
            // 查找对应的油站信息
            const station = this.testData.stations.find(s => s.stationId === product.installStation) || {};
            
            // 查找对应的维修信息（可能有多个）
            const repairs = this.testData.repairs.filter(r => r.repairProductSerial === product.productSerial);
            
            if (repairs.length > 0) {
                // 如果有维修记录，为每个维修记录创建一行
                repairs.forEach(repair => {
                    combinedData.push({
                        // 油站信息
                        stationId: station.stationId || '',
                        stationName: station.stationName || '',
                        region: station.region || '',
                        address: station.address || '',
                        company: station.company || '',
                        registerTime: station.registerTime || '',
                        
                        // 产品信息
                        productSerial: product.productSerial,
                        productTypeCode: product.productTypeCode,
                        productTypeDesc: product.productTypeDesc,
                        productLine: product.productLine,
                        installSupplier: product.installSupplier || '',
                        installDate: product.installDate,
                        installStation: product.installStation,
                        installPerson: product.installPerson || '',
                        warrantyDate: product.warrantyDate,
                        
                        // 维修信息
                        repairOrderNo: repair.repairOrderNo,
                        applyRepairTime: repair.applyRepairTime,
                        repairStation: repair.repairStation,
                        repairProductSerial: repair.repairProductSerial,
                        repairServiceProvider: repair.repairServiceProvider || '',
                        faultCategory: repair.faultCategory,
                        faultDescription: repair.faultDescription || '',
                        repairProgress: repair.repairProgress,
                        isReplacement: repair.isReplacement,
                        brokenPartReceiveTime: repair.brokenPartReceiveTime || ''
                    });
                });
            } else {
                // 如果没有维修记录，只显示产品和油站信息
                combinedData.push({
                    // 油站信息
                    stationId: station.stationId || '',
                    stationName: station.stationName || '',
                    region: station.region || '',
                    address: station.address || '',
                    company: station.company || '',
                    registerTime: station.registerTime || '',
                    
                    // 产品信息
                    productSerial: product.productSerial,
                    productTypeCode: product.productTypeCode,
                    productTypeDesc: product.productTypeDesc,
                    productLine: product.productLine,
                    installSupplier: product.installSupplier || '',
                    installDate: product.installDate,
                    installStation: product.installStation,
                    installPerson: product.installPerson || '',
                    warrantyDate: product.warrantyDate,
                    
                    // 维修信息（空值）
                    repairOrderNo: '',
                    applyRepairTime: '',
                    repairStation: '',
                    repairProductSerial: '',
                    repairServiceProvider: '',
                    faultCategory: '',
                    faultDescription: '',
                    repairProgress: '',
                    isReplacement: '',
                    brokenPartReceiveTime: ''
                });
            }
        });
        
        return combinedData;
    },
    
    // 获取统计数据
    getStatistics: function() {
        return {
            stationsCount: this.testData.stations.length,
            productsCount: this.testData.products.length,
            repairsCount: this.testData.repairs.length,
            pendingRepairs: this.testData.repairs.filter(r => r.repairProgress === '待处理').length,
            processingRepairs: this.testData.repairs.filter(r => r.repairProgress === '维修中').length,
            completedRepairs: this.testData.repairs.filter(r => r.repairProgress === '已完成').length
        };
    },
    
    // 筛选数据
    filterData: function(data, filters) {
        if (!filters || Object.keys(filters).length === 0) {
            return data;
        }
        
        return data.filter(item => {
            for (const [key, value] of Object.entries(filters)) {
                if (!value) continue; // 跳过空值筛选
                
                const itemValue = item[key];
                if (itemValue === undefined || itemValue === null) continue;
                
                // 根据数据类型进行不同的筛选逻辑
                const columnConfig = AppUtils.getColumnConfig(key);
                if (columnConfig) {
                    switch (columnConfig.type) {
                        case 'select':
                            if (itemValue !== value) return false;
                            break;
                        case 'date':
                        case 'datetime':
                            // 日期筛选支持范围
                            if (typeof value === 'object' && value.start && value.end) {
                                const itemDate = new Date(itemValue);
                                const startDate = new Date(value.start);
                                const endDate = new Date(value.end);
                                if (itemDate < startDate || itemDate > endDate) return false;
                            } else if (typeof value === 'string') {
                                if (!itemValue.includes(value)) return false;
                            }
                            break;
                        default:
                            // 文本筛选（模糊匹配）
                            if (!String(itemValue).toLowerCase().includes(String(value).toLowerCase())) {
                                return false;
                            }
                    }
                }
            }
            return true;
        });
    },
    
    // 排序数据
    sortData: function(data, sortField, sortOrder = 'asc') {
        if (!sortField) return data;
        
        return [...data].sort((a, b) => {
            let valueA = a[sortField];
            let valueB = b[sortField];
            
            // 处理空值
            if (valueA === null || valueA === undefined) valueA = '';
            if (valueB === null || valueB === undefined) valueB = '';
            
            // 根据列配置确定排序类型
            const columnConfig = AppUtils.getColumnConfig(sortField);
            if (columnConfig) {
                switch (columnConfig.type) {
                    case 'date':
                    case 'datetime':
                        valueA = new Date(valueA);
                        valueB = new Date(valueB);
                        break;
                    case 'number':
                        valueA = parseFloat(valueA) || 0;
                        valueB = parseFloat(valueB) || 0;
                        break;
                    default:
                        valueA = String(valueA).toLowerCase();
                        valueB = String(valueB).toLowerCase();
                }
            }
            
            let result = 0;
            if (valueA < valueB) result = -1;
            else if (valueA > valueB) result = 1;
            
            return sortOrder === 'desc' ? -result : result;
        });
    },
    
    // 分页数据
    paginateData: function(data, page = 1, pageSize = 10) {
        const totalItems = data.length;
        const totalPages = Math.ceil(totalItems / pageSize);
        const startIndex = (page - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        
        return {
            data: data.slice(startIndex, endIndex),
            pagination: {
                currentPage: page,
                pageSize: pageSize,
                totalItems: totalItems,
                totalPages: totalPages,
                hasNext: page < totalPages,
                hasPrev: page > 1
            }
        };
    }
};