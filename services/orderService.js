const Order = require('../db/index.js');

class OrderService {
  constructor() {
    this.Order = Order;
  }

  // 주문 ID 확인
  async checkOrderId(orderId) {
    const checkOrder = await this.Order.findOne({ orderId: orderId });
    if (checkOrder) {
      return checkOrder;
    } else {
      const e = new Error('해당 주문식별 아이디의 주문이 없습니다.');
      e.status = 404;
      throw e;
    }
  }

  // 전체 주문 목록
  async getOrderList() {
    return await this.Order.find({});
  }

  // 특정 사용자의 주문 목록 조회
  async getOrderListOfUser(userId) {
    return await this.Order.find({ userId: userId });
  }

  // 주문 추가
  async addOrder(orderInfo) {
    const { orderId, userId, sitterId, pets, totalPrice, createdAt, state, detailInfo, start, end } = orderInfo;
    return await this.Order.create({
      orderId,
      userId,
      sitterId,
      pets,
      totalPrice,
      createdAt,
      state,
      detailInfo,
      start,
      end
    });
  }

  // 주문 수정
  async updateOrder(orderId, updatedInfo) {
    return await this.Order.findOneAndUpdate(
      { orderId: orderId },
      { $set: updatedInfo },
      { new: true }
    );
  }

  // 주문 취소
  async cancelOrder(orderId) {
    return await this.Order.deleteOne({ orderId: orderId });
  }
}

module.exports = new OrderService();