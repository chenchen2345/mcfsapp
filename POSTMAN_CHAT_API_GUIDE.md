# Postman 测试 /chat API 完整指南

## API 信息
- **端点**: `POST /api/chat`
- **认证**: 需要 JWT Bearer Token
- **Content-Type**: `application/json`

## 测试步骤

### 1. 登录获取 Token

#### 请求设置
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/auth/login`
- **Headers**:
  ```
  Content-Type: application/json
  ```
- **Body** (raw JSON):
  ```json
  {
    "username": "your_username",
    "password": "your_password"
  }
  ```

#### 预期响应
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 测试 /chat API

#### 请求设置
- **Method**: `POST`
- **URL**: `http://localhost:8080/api/chat`
- **Headers**:
  ```
  Content-Type: application/json
  Authorization: Bearer YOUR_TOKEN_HERE
  ```
- **Body** (raw JSON):
  ```json
  {
    "prompt": "你好，请介绍一下你自己",
    "model": "qwen-turbo"
  }
  ```

#### 预期响应
```json
{
  "reply": "你好！我是通义千问，一个AI助手..."
}
```

## Postman 环境变量设置

### 1. 创建环境变量
在 Postman 中创建环境变量：
- `base_url`: `http://localhost:8080`
- `auth_token`: (登录后自动设置)

### 2. 使用环境变量
- **登录 URL**: `{{base_url}}/api/auth/login`
- **Chat URL**: `{{base_url}}/api/chat`
- **Authorization Header**: `Bearer {{auth_token}}`

## 自动化测试脚本

### 登录后自动设置 Token
在登录请求的 **Tests** 标签页添加：
```javascript
if (pm.response.code === 200) {
    const response = pm.response.json();
    pm.environment.set("auth_token", response.token);
    console.log("Token saved:", response.token);
}
```

### 验证 Chat 响应
在 Chat 请求的 **Tests** 标签页添加：
```javascript
pm.test("Status code is 200", function () {
    pm.response.to.have.status(200);
});

pm.test("Response has reply", function () {
    const response = pm.response.json();
    pm.expect(response).to.have.property('reply');
    pm.expect(response.reply).to.be.a('string');
    pm.expect(response.reply.length).to.be.greaterThan(0);
});
```

## 常见错误及解决方案

### 1. 401 Unauthorized
**原因**: Token 无效或过期
**解决**: 重新登录获取新的 token

### 2. 400 Bad Request
**原因**: 请求格式错误
**检查项**:
- Content-Type 是否正确
- JSON 格式是否正确
- prompt 字段是否存在

### 3. 500 Internal Server Error
**原因**: 后端服务错误
**检查项**:
- 后端服务是否运行
- LLM API Key 是否配置正确

## 测试用例示例

### 用例 1: 基本对话
```json
{
  "prompt": "你好",
  "model": "qwen-turbo"
}
```

### 用例 2: 金融相关问题
```json
{
  "prompt": "什么是金融风险管理？",
  "model": "qwen-turbo"
}
```

### 用例 3: 不指定模型（使用默认）
```json
{
  "prompt": "请解释一下区块链技术"
}
```

## 调试技巧

### 1. 检查 Token
在 Headers 中确认 Authorization 格式：
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2. 查看响应详情
在 Postman 的 Console 中查看详细的请求和响应信息。

### 3. 环境变量调试
在 Tests 中添加：
```javascript
console.log("Current token:", pm.environment.get("auth_token"));
console.log("Base URL:", pm.environment.get("base_url"));
```

## 完整测试流程

1. **启动后端服务**
2. **在 Postman 中创建环境**
3. **执行登录请求**
4. **验证 token 已保存**
5. **执行 chat 请求**
6. **验证响应格式和内容** 