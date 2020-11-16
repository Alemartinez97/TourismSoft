const routes = require('express').Router();
const { knex } = require('../db');
const { success, error } = require('../response');
const withUser = require('../middleware/auth');
const mercadopago = require('mercadopago');

const testUsers = {
  buyer: {
    id: 488149271,
    nickname: 'TESTP19L3Z0P',
    password: 'qatest8624',
    site_status: 'active',
    email: 'test_user_25670293@testuser.com',
  },
  seller: {
    token:
      'APP_USR-946909429091738-111023-823b4eeed84cc52d19963c10b9549085-488147552',
    id: 488147552,
    nickname: 'TESTBJXQF0EY',
    password: 'qatest7102',
    site_status: 'active',
    email: 'test_user_55352615@testuser.com',
  },
};

mercadopago.configure({
  access_token: testUsers.seller.token,
  // access_token: 'TEST-5369137670636004-111021-ff9ab05f4c92a9c440c970b35e57d0cd-488124272',
  // access_token: 'APP_USR-5369137670636004-111021-51720a1487d4a0e2f1f5f9035d9efa8f-488124272',
});

routes.post('/', withUser, async (req, res) => {
  const userId = req.user.id;
  const cartItems = await knex('user_cart')
    .leftJoin('product_variant', 'product_variant.id', 'user_cart.variant_id')
    .leftJoin('product', 'product.id', 'product_variant.product_id')
    .select(
      'product_variant.*',
      'user_cart.*',
      knex.raw('product.name as product_name'),
    )
    .where('user_cart.user_id', '=', userId);
  const userPackages = await knex('user_package')
    .leftJoin('package', 'package.id', 'user_package.package_id')
    .where('user_package.user_id', '=', userId);
  const userCards = await knex('user_card')
    .leftJoin('card', 'card.id', 'user_card.card_id')
    .where('user_card.user_id', '=', userId);
  const backUrl = req.body.backUrl;
  const items = [
    ...cartItems.map((it) => ({
      id: `p${it.id}`,
      title: `${it.product_name} - ${it.name}`,
      unit_price: it.price,
      quantity: 1,
      currency_id: 'ARS',
    })),
    ...userPackages.map((it) => ({
      id: `b${it.id}`,
      title: it.name,
      unit_price: it.price,
      quantity: 1,
      currency_id: 'ARS',
    })),
    ...userCards.map((it) => ({
      id: `c${it.id}`,
      title: it.name,
      unit_price: it.price,
      quantity: 1,
      currency_id: 'ARS',
    })),
  ];
  const total = items.reduce((acc, item) => acc + item.unit_price, 0);
  const preference = {
    items,
    back_urls: {
      success: `${backUrl}/success`,
      failure: `${backUrl}/failure`,
      pending: `${backUrl}/pending`,
    },
    auto_return: 'all',
    external_reference: 'testttt',
  };
  try {
    const response = await mercadopago.preferences.create(preference);
    await knex('order').insert({
      user_id: userId,
      json: JSON.stringify(items),
      date: new Date(),
      order_status_id: 1, // placed
      external_id: response.body.id,
      total,
    });
    // clear cart, packages and cards
    await knex('user_cart')
      .where('user_cart.user_id', '=', userId)
      .del();
    await knex('user_package')
      .where('user_package.user_id', '=', userId)
      .del();
    await knex('user_card')
      .where('user_card.user_id', '=', userId)
      .del();
    success(res, response.body);
  } catch (e) {
    console.error(e);
    error(res, 'Cart checkout');
  }
});

routes.post('/notification', async (req, res) => {
  const { topic, id } = req.query;
  if (topic === 'payment') {
    const payment = await mercadopago.payment.findById(id);
    const merchantOrder = await mercadopago.merchant_orders.findById(
      payment.body.order.id,
    );
    await knex('order')
      .update({
        external_payment_id: id,
        order_status_id: getStatus(merchantOrder.body),
      })
      .where('order.external_id', '=', merchantOrder.body.preference_id);
  }
  res.sendStatus(201);
});

const getStatus = (order) => {
  const totalPaid = order.payments.reduce((acc, p) => {
    if (p.status === 'approved') {
      return p.transaction_amount + acc;
    }
    return acc;
  }, 0);
  if (order.order_status === 'payment_in_process') {
    return 2; // payment_in_process
  }
  if (totalPaid >= order.total_amount) {
    return 4; // paid
  } else {
    return 5; // partially paid
  }
};

module.exports = routes;
