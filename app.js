const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); 
const bcrypt = require('bcrypt'); // 비밀번호 해시화 모듈 추가

const dailyProblemsRoutes = require('./src/routes/dailyProblems_routes'); // 수정된 라우트
const app = express();
app.use(cors());

const db = require('./src/config/database');

// 미들웨어 설정
app.use(bodyParser.json());

app.get('/', (req, res) => {
    db.query('SELECT * FROM users', function (err, results, fields) {
        if (err) throw err;
        res.send(results);
    });
});

// 라우터 설정
app.use('/api/daily-problems', dailyProblemsRoutes);

app.post('/api/signup', async (req, res) => {
    const { userid, password, username } = req.body;

    // 유효성 검사
    if (!userid || !password || !username) {
        return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
    }

    try {
        // 아이디 중복 확인
        db.query('SELECT * FROM users WHERE userid = ?', [userid], async (error, results) => {
            if (error) {
                console.error('데이터베이스 오류:', error);
                return res.status(500).json({ message: '서버 오류' });
            }

            if (results.length > 0) {
                return res.status(400).json({ message: '중복된 아이디입니다.' });
            }

            // 비밀번호 해싱
            const hashedPassword = await bcrypt.hash(password, 10);

            // 데이터베이스에 사용자 정보 저장
            db.query('INSERT INTO users (userid, username, password, is_first_login, created_at) VALUES (?, ?, ?, ?, NOW())', 
                [userid, username, hashedPassword], (insertError, insertResults) => {
                    if (insertError) {
                        console.error('데이터베이스 오류:', insertError);
                        return res.status(500).json({ message: '서버 오류' });
                    }
                    res.status(201).json({ message: '회원가입 성공', id: insertResults.insertId }); // 생성된 id 반환
                });
        });
        
    } catch (error) {
        console.error('회원가입 중 오류:', error);
        res.status(500).json({ message: '서버 오류' });
    }
});

app.post('/api/login', async (req, res) => {
    const { userid, password } = req.body;

    // 유효성 검사
    if (!userid || !password) {
        return res.status(400).json({ message: '모든 필드를 입력해야 합니다.' });
    }

  // 사용자 조회
  db.query('SELECT * FROM users WHERE userid = ?', [userid], async (error, results) => {
    if (error) {
        return res.status(500).json({ message: '서버 오류' });
    }
    if (results.length === 0) {
        return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    const user = results[0]; // 첫 번째 결과가 해당 사용자

    // 비밀번호 확인
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: '아이디 또는 비밀번호가 올바르지 않습니다.' });
    }

    // 첫 로그인 여부 확인
    const isFirstLogin = user.is_first_login; // 여기서 user.is_first_login을 확인

    // 첫 로그인 후 is_first_login 값을 false로 변경
    if (isFirstLogin) {
        db.query('UPDATE users SET is_first_login = ? WHERE userid = ?', [false, userid], (updateError) => {
            if (updateError) {
                console.error('첫 로그인 업데이트 오류:', updateError);
            }
        });
    }

    // 성공적으로 로그인 시
    res.json({ success: true, isFirstLogin }); // isFirstLogin 값을 클라이언트에 반환
    });
});

// 서버 실행
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
