# Transaction Management Interface

## 概述

Transaction界面是一个完整的交易管理系统，支持查看、创建、编辑、删除交易记录，以及通过ID搜索特定交易。

## 功能特性

### 1. 交易列表展示
- **分页显示**: 支持分页浏览交易记录
- **完整信息**: 显示交易的所有字段，包括：
  - ID
  - 交易类型 (Type)
  - 金额 (Amount)
  - 发起方名称 (Name Orig)
  - 发起方旧余额 (Old Balance Orig)
  - 发起方新余额 (New Balance Orig)
  - 接收方名称 (Name Dest)
  - 接收方旧余额 (Old Balance Dest)
  - 接收方新余额 (New Balance Dest)
  - 欺诈状态 (Is Fraud)
  - 欺诈概率 (Fraud Probability)
  - 创建时间 (Created At)
  - 更新时间 (Updated At)

### 2. ID搜索功能
- **精确搜索**: 只能通过交易ID进行搜索
- **实时反馈**: 搜索结果显示加载状态和错误信息
- **清除功能**: 可以清除搜索条件，返回完整列表

### 3. 交易管理操作
- **创建交易**: 通过弹窗表单创建新的交易记录
- **编辑交易**: 修改现有交易的详细信息
- **删除交易**: 删除不需要的交易记录

### 4. 数据导入
- **CSV导入**: 支持批量导入CSV格式的交易数据
- **进度显示**: 导入过程中显示状态信息

## 界面布局

### 顶部区域
```
┌─────────────────────────────────────────────────────────────┐
│ Transaction Management    [Search by ID] [Search] [Clear]  │
└─────────────────────────────────────────────────────────────┘
```

### 表格区域
```
┌─────────────────────────────────────────────────────────────┐
│ ID │ Type │ Amount │ Name Orig │ Old Bal │ New Bal │ ... │
├────┼──────┼────────┼───────────┼─────────┼─────────┼─────┤
│ 1  │ TRANS│ $1,000 │ C1234567  │ $5,000  │ $4,000  │ ... │
│ 2  │ PAYM │ $500   │ C0987654  │ $2,000  │ $1,500  │ ... │
└────┴──────┴────────┴───────────┴─────────┴─────────┴─────┘
```

### 分页控制
```
┌─────────────────────────────────────────────────────────────┐
│ [Previous] Page 1 of 5 Total: 50 transactions [Next]      │
└─────────────────────────────────────────────────────────────┘
```

### 操作按钮
```
┌─────────────────────────────────────────────────────────────┐
│ [New Transaction] [Import CSV]                             │
└─────────────────────────────────────────────────────────────┘
```

## 创建/编辑交易弹窗

### 表单字段
- **Type**: 交易类型 (CASH_IN, CASH_OUT, TRANSFER, PAYMENT)
- **Amount**: 交易金额
- **Name Orig**: 发起方名称
- **Old Balance Orig**: 发起方旧余额
- **New Balance Orig**: 发起方新余额
- **Name Dest**: 接收方名称
- **Old Balance Dest**: 接收方旧余额
- **New Balance Dest**: 接收方新余额

### 表单验证
- 所有字段都是必填的
- 金额字段必须是正数
- 余额字段可以是负数（表示透支）

## API接口

### 获取交易列表
```
GET /api/transactions?page=1&size=10
```

### 获取单个交易
```
GET /api/transactions/{id}
```

### 创建交易
```
POST /api/transactions
Content-Type: application/json

{
  "type": "TRANSFER",
  "amount": 1000.00,
  "nameOrig": "C1234567890",
  "oldBalanceOrig": 5000.00,
  "newBalanceOrig": 4000.00,
  "nameDest": "C0987654321",
  "oldBalanceDest": 2000.00,
  "newBalanceDest": 3000.00
}
```

### 更新交易
```
PUT /api/transactions/{id}
Content-Type: application/json

{
  "type": "PAYMENT",
  "amount": 1500.00,
  "nameOrig": "C1234567890",
  "oldBalanceOrig": 5000.00,
  "newBalanceOrig": 3500.00,
  "nameDest": "C0987654321",
  "oldBalanceDest": 2000.00,
  "newBalanceDest": 3500.00
}
```

### 删除交易
```
DELETE /api/transactions/{id}
```

### 导入CSV
```
POST /api/transactions/import
Content-Type: multipart/form-data

file: [CSV file]
```

## 响应格式

### 交易列表响应
```json
{
  "total": 50,
  "page": 1,
  "size": 10,
  "transactions": [
    {
      "id": 1,
      "type": "TRANSFER",
      "amount": 1000.00,
      "nameOrig": "C1234567890",
      "oldBalanceOrig": 5000.00,
      "newBalanceOrig": 4000.00,
      "nameDest": "C0987654321",
      "oldBalanceDest": 2000.00,
      "newBalanceDest": 3000.00,
      "isFraud": false,
      "fraudProbability": 0.05,
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ]
}
```

### 单个交易响应
```json
{
  "id": 1,
  "type": "TRANSFER",
  "amount": 1000.00,
  "nameOrig": "C1234567890",
  "oldBalanceOrig": 5000.00,
  "newBalanceOrig": 4000.00,
  "nameDest": "C0987654321",
  "oldBalanceDest": 2000.00,
  "newBalanceDest": 3000.00,
  "isFraud": false,
  "fraudProbability": 0.05,
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-01T10:00:00Z"
}
```

## 错误处理

### 常见错误
- **400 Bad Request**: 请求参数错误
- **401 Unauthorized**: 未授权访问
- **404 Not Found**: 交易不存在
- **500 Internal Server Error**: 服务器内部错误

### 错误响应格式
```json
{
  "code": 400,
  "message": "Bad Request",
  "details": "Invalid transaction data"
}
```

## 使用说明

### 1. 查看交易列表
1. 页面加载时自动显示第一页的交易记录
2. 使用分页按钮浏览更多记录
3. 每页显示10条记录

### 2. 搜索交易
1. 在搜索框中输入交易ID
2. 点击"Search"按钮或按回车键
3. 点击"Clear"按钮清除搜索条件

### 3. 创建新交易
1. 点击"New Transaction"按钮
2. 在弹出的表单中填写交易信息
3. 点击"Save"按钮保存

### 4. 编辑交易
1. 在交易列表中点击"Edit"按钮
2. 在弹出的表单中修改交易信息
3. 点击"Save"按钮保存更改

### 5. 删除交易
1. 在交易列表中点击"Delete"按钮
2. 确认删除操作

### 6. 导入CSV
1. 点击"Import CSV"按钮
2. 选择CSV文件
3. 等待导入完成

## 技术实现

### 前端技术栈
- React 18
- CSS3 (响应式设计)
- Fetch API (HTTP请求)

### 后端技术栈
- Go (Hertz框架)
- GORM (数据库ORM)
- JWT (身份验证)

### 数据库字段
根据`model/transaction.go`中的Transaction结构体定义：
- `id`: 主键
- `type`: 交易类型
- `amount`: 交易金额
- `nameOrig`: 发起方名称
- `oldBalanceOrig`: 发起方旧余额
- `newBalanceOrig`: 发起方新余额
- `nameDest`: 接收方名称
- `oldBalanceDest`: 接收方旧余额
- `newBalanceDest`: 接收方新余额
- `isFraud`: 欺诈标记
- `fraudProbability`: 欺诈概率
- `isDeleted`: 软删除标记
- `createdAt`: 创建时间
- `updatedAt`: 更新时间
- `deletedAt`: 删除时间

## 注意事项

1. **权限要求**: 所有操作都需要有效的JWT令牌
2. **数据验证**: 前端和后端都会进行数据验证
3. **错误处理**: 网络错误和服务器错误都会显示给用户
4. **响应式设计**: 界面适配不同屏幕尺寸
5. **性能优化**: 使用分页减少数据传输量 