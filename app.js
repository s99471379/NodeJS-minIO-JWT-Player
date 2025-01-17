const express = require('express');
const Minio = require('minio');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

// 設定 JWT 的密鑰
const JWT_SECRET = 'your_jwt_secret_key'; // 這裡請換成你自己的密鑰

// 預設的帳號密碼列表
const users = [
  { username: 'user1', password: bcrypt.hashSync('password1', 10) },
  { username: 'user2', password: bcrypt.hashSync('password2', 10) }
];

// MinIO 設定
const bucketName = 'hctcoding';
const objectName = 'IAPPC21_1_1.mp4';

const minioClient = new Minio.Client({
  endPoint: 'ip',
  port: 32000,
  useSSL: false,
  accessKey: 'acc',
  secretKey: 'pwd'
});

// 登入路由
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  const user = users.find(u => u.username === username);
  if (user && bcrypt.compareSync(password, user.password)) {
    // 成功驗證，簽發 JWT Token
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '1h' });
    return res.json({ token });
  }

  // 驗證失敗
  res.status(401).json({ message: 'Invalid username or password' });
});

// JWT 驗證中介層
const authenticateToken = (req, res, next) => {
  const token = req.query.token || req.headers['authorization']?.split(' ')[1];

  if (!token) {
    console.log('Authorization Token is missing');
    return res.sendStatus(401);
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      console.log('Token verification failed:', err);
      return res.sendStatus(403);
    }
    req.user = user;
    next();
  });
};




app.get('/video', authenticateToken, async (req, res) => {
  try {
    const stat = await minioClient.statObject(bucketName, objectName);
    const videoSize = stat.size;

    const range = req.headers.range;
    if (!range) {
      console.log('Missing range header');
      return res.sendStatus(403);
    }

    // console.log(`Received Range header: ${range}`);

    const CHUNK_SIZE = 10 ** 6; // 1MB
    const start = Number(range.replace(/\D/g, ""));
    const end = Math.min(start + CHUNK_SIZE, videoSize - 1);

    const contentLength = end - start + 1;
    const headers = {
      "Content-Range": `bytes ${start}-${end}/${videoSize}`,
      "Accept-Ranges": "bytes",
      "Content-Length": contentLength,
      "Content-Type": "video/mp4",
    };

    res.writeHead(206, headers);

    // console.log(`Streaming video bytes ${start} - ${end}`);

    const stream = await minioClient.getPartialObject(bucketName, objectName, start, contentLength);
    stream.pipe(res);

    stream.on('error', (err) => {
      console.error('Error during streaming:', err);
      res.sendStatus(500);
    });

  } catch (err) {
    console.error('Error streaming video:', err);
    res.sendStatus(500);
  }
});




const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
