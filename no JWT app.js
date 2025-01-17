const express = require('express');
const Minio = require('minio');
const app = express();

const bucketName = 'hctcoding';
const objectName = 'IAPPC21_1_1.mp4';

const minioClient = new Minio.Client({
  endPoint: '192.168.18.100',
  port: 32000,
  useSSL: false,
  accessKey: 'jarvis',
  secretKey: 'jarvis!@#$'
});

app.get('/video', async (req, res) => {
  try {
    // 從 MinIO 取得影片檔案資訊
    const stat = await minioClient.statObject(bucketName, objectName);

    const range = req.headers.range;
    if (!range) {
      return res.status(400).send('Requires Range header');
    }

    const videoSize = stat.size;
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

    // 從 MinIO 讀取影片部分內容
    const stream = await minioClient.getPartialObject(bucketName, objectName, start, contentLength);
    stream.pipe(res);

  } catch (err) {
    console.error('Error streaming video:', err);
    res.sendStatus(500);
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
