const express = require('express');
const bodyParser = require('body-parser');
// const userRoutes = require('./src/routes/user_routes');
const dailyProblemsRoutes = require('./src/routes/dailyProblems_routes'); // 수정된 라우트

const app = express();

// 미들웨어 설정
app.use(bodyParser.json());

// 라우터 설정
// app.use('/api/users', userRoutes);
app.use('/api/daily-problems', dailyProblemsRoutes);

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
