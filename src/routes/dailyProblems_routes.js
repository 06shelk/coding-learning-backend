// src/routes/dailyProblems_routes.js
const express = require('express');
const router = express.Router();
const fs = require('fs'); // 파일 시스템 모듈

// 문제를 가져오는 API
router.get('/', (req, res) => {
    // JSON 파일 경로 (프로젝트 구조에 맞게 수정)
    const problemsPath = './src/data/problems.json';
  
    fs.readFile(problemsPath, 'utf8', (err, data) => {
      if (err) {
        console.error('파일을 읽는 데 오류가 발생했습니다:', err);
        return res.status(500).json({ message: '문제를 가져오는 데 오류가 발생했습니다.' });
      }
  
      try {
        const problems = JSON.parse(data);
        res.json(problems);
      } catch (parseError) {
        console.error('JSON 파싱 오류:', parseError);
        res.status(500).json({ message: '문제를 가져오는 데 오류가 발생했습니다.' });
      }
    });
  });

  
module.exports = router;
