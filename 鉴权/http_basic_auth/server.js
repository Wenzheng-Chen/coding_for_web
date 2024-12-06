const http = require("http");

const vaildUsername = "admin";
const vaildPassword = "password";

const server = http.createServer((req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Authorization, Content-Type");

  if (req.method === "OPTIONS") {
    // 预检请求
    // 确保跨域请求在安全范围内执行
    // 防止潜在的恶意攻击
    // 提供灵活的配置，允许服务器明确声明跨域策略
    res.writeHead(204);
    res.end();
    return;
  }

  const authHeader = req.headers["authorization"];
  if (!authHeader) {
    res.writeHead(401, { "WWW-Authenticate": 'Basic realm="Secure Area' });
    // WWW-Authenticate: Basic realm="Secure Area" Basic: 基本认证方式， realm="Secure Area"：表示认证领域，用于向用户提示为什么需要认证，仅仅是一个标识符
    res.end("Authentication required");
    return;
  }

  const base64Credentials = authHeader.split(" ")[1];
  const credentials = Buffer.from(base64Credentials, "base64").toString(
    "utf-8"
  );
  const [username, password] = credentials.split(":");

  if (username === vaildUsername && password === vaildPassword) {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.end("Welcome to the protected resource!");
  } else {
    res.writeHead(403);
    res.end("Access denied");
  }
});

const PORT = 3000;
server.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
