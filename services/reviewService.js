// 불러오기
const Review = require('../db/index.js');

class ReviewService {
  constructor() {
    this.Review = Review;
  }

  // 이용후기 작성
  async writeReview(userId, sitterId, comment, images) {
    return await this.Review.create({
      user_id: userId,
      sitter_id: sitterId,
      comment: comment,
      images: images,
    });
  }

  // 전체 이용후기 목록 조회
  async getReviewList() {
    return await this.Review.find({});
  }

  // 이용후기에 댓글 추가
  async addCommentToReview(reviewId, sitterId, comment) {
    return await this.Review.findOneAndUpdate(
      { _id: reviewId },
      { $push: { comments: { sitter_id: sitterId, comment: comment } } },
      { new: true }
    );
  }

  // 이용후기 삭제
  async deleteReview(reviewId) {
    return await this.Review.deleteOne({ _id: reviewId });
  }
}

module.exports = new ReviewService();