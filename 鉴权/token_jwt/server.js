const http = require("http");
const jwt = require("jsonwebtoken");
const querystring = require("querystring");

// 密钥
const SECRET_KEY = "your_secret_key";
const REFRESH_SECRET_KEY = "your_refresh_secret_key";

// 模拟用户数据
const users = {
  admin: "password123",
  user: "userpassword",
};

// 模拟Refresh Token存储（实际可用数据库）
let refreshTokens = {};

// 签发Access Token的函数
function generateAccessToken(username) {
  return jwt.sign({ username }, SECRET_KEY, { expiresIn: "1h" });
}

// 签发Refresh Token的函数
function generateRefreshToken(username) {
  const refreshToken = jwt.sign({ username }, REFRESH_SECRET_KEY, {
    expiresIn: "7d",
  });
  refreshTokens[refreshToken] = username; // 存储Refresh Token
  return refreshToken;
}

// 解析请求体的函数
function parseBody(req, callback) {
  let body = "";
  req.on("data", (chunk) => {
    body += chunk.toString();
  });
  req.on("end", () => {
    callback(querystring.parse(body));
  });
}

// 创建 HTTP 服务器
const server = http.createServer((req, res) => {
  res.setHeader("Content-Type", "application/json");

  if (req.method === "POST" && req.url === "/login") {
    // 登录接口
    parseBody(req, (body) => {
      const { username, password } = body;
      if (users[username] && users[username] === password) {
        const accessToken = generateAccessToken(username);
        const refreshToken = generateRefreshToken(username);
        res.writeHead(200);
        res.end(
          JSON.stringify({
            message: "Login successful",
            accessToken,
            refreshToken,
          })
        );
      } else {
        res.writeHead(401);
        res.end(JSON.stringify({ message: "Invalid username or password" }));
      }
    });
  } else if (req.method === "POST" && req.url === "/refresh") {
    // 刷新Token接口
    parseBody(req, (body) => {
      const { refreshToken } = body;
      if (!refreshToken || !refreshTokens[refreshToken]) {
        res.writeHead(403);
        res.end(JSON.stringify({ message: "Invalid Refresh Token" }));
        return;
      }
      try {
        const decoded = jwt.verify(refreshToken, REFRESH_SECRET_KEY);
        const newAccessToken = generateAccessToken(decoded.username);
        res.writeHead(200);
        res.end(JSON.stringify({ accessToken: newAccessToken }));
      } catch (err) {
        res.writeHead(403);
        res.end(
          JSON.stringify({ message: "Invalid or expired Refresh Token" })
        );
      }
    });
  } else if (req.method === "GET" && req.url === "/protected") {
    // 受保护接口
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.writeHead(401);
      res.end(JSON.stringify({ message: "Token missing or malformed" }));
      return;
    }

    const token = authHeader.split(" ")[1];
    try {
      const decoded = jwt.verify(token, SECRET_KEY);
      res.writeHead(200);
      res.end(
        JSON.stringify({ message: "Access granted", user: decoded.username })
      );
    } catch (err) {
      res.writeHead(403);
      res.end(JSON.stringify({ message: "Invalid or expired Token" }));
    }
  } else {
    res.writeHead(404);
    res.end(JSON.stringify({ message: "Not found" }));
  }
});

// 启动服务器
server.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
