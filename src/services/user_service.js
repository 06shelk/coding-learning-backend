// const db = require('../config/database');  // DB 연결 파일

// // 사용자 생성 서비스
// exports.createUser = async (email, password, name) => {
//     const query = `INSERT INTO users (email, password, name) VALUES (?, ?, ?)`;
//     const [result] = await db.execute(query, [email, password, name]);
//     return {
//         id: result.insertId,
//         email,
//         name
//     };
// };