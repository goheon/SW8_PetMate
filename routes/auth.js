import express from 'express';
import { User } from '../db/models/userModel.js';

export const authRouter = express.Router();

// 회원가입
authRouter.post('/', async (req, res) => {
    try {
    
        const { userId, username, email, password, phone, address, detailAddress } = req.body;

        const newUser = await User.create({
            userId,
            username,
            email,
            password,
            phone,
            address,
            detailAddress
        });

        res.status(201).json({message:"회원가입 성공!"});
    }catch(error){
        console.error("회원가입 중 오류 발생",error);
        res.status(500).json({message:"서버오류"});
    }
})

//로그인
//로그아웃