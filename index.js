/*
 * @Author: v-zhuxianliang v-zhuxianliang@360.cn
 * @Date: 2026-02-14 14:33:01
 * @LastEditors: v-zhuxianliang v-zhuxianliang@360.cn
 * @LastEditTime: 2026-02-14 14:50:20
 * @FilePath: \capacitor-h5\server.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const express = require('express');
const Pusher = require('pusher');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();

// 配置 CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// 配置 body-parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// 请求日志中间件
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  next();
});

// Pusher 配置
const pusher = new Pusher({
  appId: "2115335",
  key: "ae5e88ff94caa759135e",
  secret: "c3e9fc222bfe80044dc4",
  cluster: "us2",
  useTLS: true
});

// 认证端点
app.post('/pusher/auth', (req, res) => {
  const socketId = req.body.socket_id;
  const channel = req.body.channel_name;
  
  console.log('认证请求:', { socketId, channel });
  console.log('请求体:', req.body);
  
  try {
    // 检查必需参数
    if (!socketId || !channel) {
      console.error('缺少必需参数:', { socketId, channel });
      return res.status(400).json({ error: '缺少 socket_id 或 channel_name' });
    }
    
    // 使用 Pusher 的 authenticate 方法进行认证
    // 对于私有频道，只需要 socketId 和 channel
    const auth = pusher.authenticate(socketId, channel);
    
    console.log('认证成功:', auth);
    res.json(auth);
  } catch (error) {
    console.error('认证错误详情:', error);
    console.error('错误堆栈:', error.stack);
    res.status(500).json({
      error: '认证失败',
      details: error.message
    });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`认证服务器运行在 http://localhost:${PORT}`);
  console.log('请确保在 Pusher 控制面板启用了客户端事件功能');
});