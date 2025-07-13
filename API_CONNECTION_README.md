# API 连接说明

## 概述
前端应用 (mcfsapp) 已成功连接到后端API (finsys)。前端运行在 `localhost:3000`，后端运行在 `localhost:8080`。

## 已实现的API连接

### 认证API (`/api/auth`)
- **POST /api/auth/register** - 用户注册
- **POST /api/auth/login** - 用户登录

### 用户API (`/api/user`)
- **GET /api/user/info** - 获取用户信息（需要JWT认证）

### 交易API (`/api/transactions`)
- **GET /api/transactions** - 获取交易列表
- **POST /api/transactions** - 创建交易
- **PUT /api/transactions/:id** - 更新交易
- **DELETE /api/transactions/:id** - 删除交易

### 欺诈报告API (`/api/fraud-reports`)
- **GET /api/fraud-reports** - 获取欺诈报告列表
- **POST /api/fraud-reports** - 创建欺诈报告

## 前端更新内容

### 1. API服务 (`src/services/api.js`)
- 更新API基础URL为 `http://localhost:8080/api`
- 添加axios拦截器处理JWT token
- 添加自动token过期处理
- 更新所有API端点路径

### 2. 认证服务 (`src/services/auth.js`)
- 实现真实的API调用
- 添加用户注册功能
- 改进错误处理

### 3. 认证上下文 (`src/context/AuthContext.jsx`)
- 实现真实的登录/登出逻辑
- 添加本地存储管理
- 改进用户状态管理

### 4. 新增组件
- **RegisterForm.jsx** - 用户注册表单
- **Register.jsx** - 注册页面

### 5. 路由更新
- 添加 `/register` 路由
- 在登录页面添加注册链接
- 在注册页面添加登录链接

### 6. 样式更新
- 更新 `Login.css` 以支持登录和注册页面
- 添加现代化的UI设计

## 后端更新内容

### 1. CORS中间件 (`finsys/middleware/cors.go`)
- 允许前端跨域访问
- 支持所有必要的HTTP方法
- 处理预检请求

### 2. 主程序更新 (`finsys/cmd/main.go`)
- 添加CORS中间件

## 运行说明

### 启动后端
```bash
cd finsys
go run cmd/main.go
```
后端将在 `localhost:8080` 启动

### 启动前端
```bash
cd mcfsapp
npm start
```
前端将在 `localhost:3000` 启动

### 测试API连接
```bash
cd mcfsapp
node test-api.js
```

## 功能特性

1. **用户注册**: 支持用户名、密码、邮箱注册
2. **用户登录**: 支持用户名密码登录，返回JWT token
3. **自动认证**: 前端自动在请求头中添加JWT token
4. **Token过期处理**: 自动处理token过期，重定向到登录页
5. **错误处理**: 完善的错误提示和处理机制
6. **响应式设计**: 现代化的UI设计，支持移动端

## 安全特性

1. **JWT认证**: 使用JWT token进行用户认证
2. **密码验证**: 后端验证密码正确性
3. **输入验证**: 前端和后端都有输入验证
4. **CORS配置**: 安全的跨域访问配置

## 注意事项

1. 确保后端数据库已正确配置
2. 确保MongoDB服务正在运行
3. 前端需要安装axios依赖：`npm install axios`
4. 如果后端端口不是8080，请更新 `src/services/api.js` 中的 `API_URL` 