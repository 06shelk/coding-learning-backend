const bcrypt = require('bcrypt');
const userService = require('../services/user_service');  // 사용자 서비스

// 회원가입 처리
exports.createUser = async (req, res) => {
    const { email, password, name } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await userService.createUser(email, hashedPassword, name);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: '회원가입 실패', error: error.message });
    }
};
