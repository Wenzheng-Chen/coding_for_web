const http = require('http');
const crypto = require('crypto');

// 模拟用户数据库
const users = [{ username: 'testUser', password: '12345' }];

// 模拟存储会话的数据库 (使用内存存储)
const sessions = {};

// 解析 Cookie 工具函数
function parseCookies(cookieHeader) {
  return cookieHeader
    ? Object.fromEntries(cookieHeader.split('; ').map((c) => c.split('=')))
    : {};
}

// 生成随机 sessionID
function generateSessionID() {
  return crypto.randomBytes(16).toString('hex');
}

// 设置 CORS 头的工具函数
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:5500'); // 替换为你的前端地址
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // 允许发送 Cookie
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

const server = http.createServer((req, res) => {
  // 处理 OPTIONS 请求（CORS 预检请求）
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204); // No Content
    res.end();
    return;
  }

  // 解析 Cookies
  const cookies = parseCookies(req.headers.cookie);

  // 设置 CORS 头
  setCorsHeaders(res);

  if (req.url === '/login' && req.method === 'POST') {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk.toString();
    });

    req.on('end', () => {
      const { username, password } = JSON.parse(body);

      // 验证用户
      const user = users.find((u) => u.username === username && u.password === password);
      if (user) {
        // 创建新 session
        const sessionID = generateSessionID();
        sessions[sessionID] = { username: user.username };

        // 设置 Cookie
        res.setHeader('Set-Cookie', `sessionID=${sessionID}; HttpOnly`);  // Set-Cookie sessionID=a772a7620e3438e45dfc8d7e368ff90e; HttpOnly
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Login successful' }));
      } else {
        res.writeHead(401, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ message: 'Invalid credentials' }));
      }
    });
  } else if (req.url === '/logout' && req.method === 'POST') {
    if (cookies.sessionID && sessions[cookies.sessionID]) {
      delete sessions[cookies.sessionID]; // 删除 session
      res.setHeader('Set-Cookie', 'sessionID=; HttpOnly; Max-Age=0');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Logout successful' }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Not logged in' }));
    }
  } else if (req.url === '/protected' && req.method === 'GET') {
    if (cookies.sessionID && sessions[cookies.sessionID]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Protected resource', user: sessions[cookies.sessionID] }));
    } else {
      res.writeHead(401, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'Unauthorized' }));
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ message: 'Not found' }));
  }
});

server.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});
