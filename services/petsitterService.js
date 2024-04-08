const PetSitter = require('../db/index.js');

class PetSitterService {
  constructor() {
    this.PetSitter = PetSitter;
  }

  // 펫시터 등록
  async registerPetSitter(sitterId, userId, experience, introduction, hourlyRate, image, type) {
    return await this.PetSitter.create({
      sitterId: sitterId,
      userId: userId,
      experience: experience,
      introduction: introduction,
      hourlyRate: hourlyRate,
      image: image,
      type: type
    });
  }

  // 모든 펫시터 목록 조회
  async getAllPetSitters() {
    return await this.PetSitter.find({});
  }

  // 특정 펫시터 조회
  async getPetSitterById(sitterId) {
    return await this.PetSitter.findOne({ sitterId: sitterId });
  }

  // 특정 사용자의 펫시터 조회
  async getPetSitterByUserId(userId) {
    return await this.PetSitter.findOne({ userId: userId });
  }

  // 펫시터 정보 업데이트
  async updatePetSitter(sitterId, updatedInfo) {
    return await this.PetSitter.findOneAndUpdate(
      { sitterId: sitterId },
      { $set: updatedInfo },
      { new: true }
    );
  }

  // 펫시터 삭제
  async deletePetSitter(sitterId) {
    return await this.PetSitter.deleteOne({ sitterId: sitterId });
  }
}

module.exports = new PetSitterService();