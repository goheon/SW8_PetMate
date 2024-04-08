import { User } from "./db/index.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

class UserService {
  constructor() {
    this.User = User;
  }

  // 회원정보 조회
  async getUserInfo(userId) {
    const userInfo = await this.User.findOne({ userId: userId });
    if (userInfo) {
      return userInfo;
    } else {
      const e = new Error('존재하지 않는 사용자 아이디입니다.');
      e.status = 404;
      throw e;
    }
  }

  // 회원가입
  async createUser(info) {
    const { username, email, password, phone, address, detailAddress, isRole } = info;
    const hashedPassword = await bcrypt.hash(password, 10);

    await User.create({
      userId: username,
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      detailAddress,
      isRole,
    });
  }

  //회원정보 수정
  async updateUserInfo(userId, updatedInfo) {
    if (updatedInfo.password) {
      updatedInfo.password = await bcrypt.hash(updatedInfo.password, 10);
    }
    return await User.findOneAndUpdate(
      { userId: userId },
      { $set: updatedInfo },
      { new: true }
    );
  }

  //회원탈퇴
  async deleteUser(userId) {
    return await User.findOneAndDelete({ userId: userId });
  }

  // 로그인 시 이메일로 사용자 데이터 조회
  async getUserToken(userId, userPw) {
    const userData = await User.findOne({ userId: userId });

    if (!userData) {
      const e = new Error('올바르지 않은 ID');
      e.status = 404;
      throw e;
    }

    const comparePassword = await this.comparePasswords(
      userPw,
      userData.password
    );

    if (!comparePassword) {
      const e = new Error('올바르지 않은 비밀번호');
      e.status = 404;
      throw e;
    }

    const secretKey = process.env.JWT_SECRET_KEY;
    return jwt.sign({
      userId: userData.userId,
      isRole: userData.isRole,
    }, secretKey);
  }

  async comparePasswords(inputPassword, hashedPassword) {
    return bcrypt.compare(inputPassword, hashedPassword);
  }
}

export default new UserService();