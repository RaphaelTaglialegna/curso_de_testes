import Cart from './Cart';

describe('Cart', () => {
  let cart;
  const product = {
    title: 'Adidas running shoes - men',
    price: 35388, // 353.88 | R$ 353,88
  };

  const product2 = {
    title: 'Adidas running shoes - women',
    price: 41872,
  };

  beforeEach(() => {
    cart = new Cart();
  });

  describe('getTotal()', () => {
    it('Should return 0 when getTotal() is executed in a newly created a new instance', () => {
      expect(cart.getTotal().getAmount()).toEqual(0);
    });

    it('Should multiply quantity and price and receive the total amount', () => {
      const item = {
        product,
        quantity: 2,
      };
      cart.add(item);
      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('Should ensure no more than on product exists at a time', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product,
        quantity: 1,
      });
      expect(cart.getTotal().getAmount()).toEqual(35388);
    });

    it('Should update total when a product get included and then removed', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 1,
      });

      cart.remove(product);
      expect(cart.getTotal().getAmount()).toEqual(41872);
    });
  });

  describe('checkout()', () => {
    it('Should return an object with the total and the list of items', () => {
      cart.add({
        product,
        quantity: 2,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(196392);
      expect(cart.checkout()).toMatchSnapshot();
    });

    it('Should reset the cart whem checkout() is called', () => {
      cart.add({
        product: product2,
        quantity: 3,
      });
      cart.checkout();

      expect(cart.getTotal().getAmount()).toEqual(0);
    });

    it('Should return an object with the total and the list of items when summary() is called', () => {
      cart.add({
        product,
        quantity: 5,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.summary()).toMatchSnapshot();
      expect(cart.getTotal().getAmount()).toBeGreaterThan(0);
    });

    it('should include formatted amount in the summary', () => {
      cart.add({
        product,
        quantity: 5,
      });

      cart.add({
        product: product2,
        quantity: 3,
      });

      expect(cart.summary().formatted).toEqual('$3,025.56');
    });
  });

  describe('special conditions()', () => {
    it('Should apply percentage discont quantity above minimum is passed', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 3,
      });

      expect(cart.getTotal().getAmount()).toEqual(74315);
    });

    it('Should NOT apply percentage discont quantity is below or equal minimum.', () => {
      const condition = {
        percentage: 30,
        minimum: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 2,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('Should apply quantity discont for even quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 4,
      });

      expect(cart.getTotal().getAmount()).toEqual(70776);
    });

    it('Should NOT apply quantity discont for even quantities when condidion is not equal', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 1,
      });

      expect(cart.getTotal().getAmount()).toEqual(35388);
    });

    it('Should apply quantity discont for odd quantities', () => {
      const condition = {
        quantity: 2,
      };

      cart.add({
        product,
        condition,
        quantity: 5,
      });

      expect(cart.getTotal().getAmount()).toEqual(106164);
    });
    it('shoul recieve two or more conditions and determinate/apply the best discont. First Case', () => {
      const condition1 = {
        percentage: 30,
        minimum: 2,
      };
      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5,
      });
      expect(cart.getTotal().getAmount()).toEqual(106164);
    });

    it('shoul recieve two or more conditions and determinate/apply the best discont. Second Case', () => {
      const condition1 = {
        percentage: 80,
        minimum: 2,
      };
      const condition2 = {
        quantity: 2,
      };

      cart.add({
        product,
        condition: [condition1, condition2],
        quantity: 5,
      });
      expect(cart.getTotal().getAmount()).toEqual(35388);
    });
  });
});
