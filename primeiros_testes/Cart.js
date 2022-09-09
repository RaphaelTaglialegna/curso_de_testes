import find from 'lodash/find';
import remove from 'lodash/remove';
import Dinero from 'dinero.js';

const Money = Dinero; // Alias para deixar o nome mais atraente.
Money.defaultCurrency = 'BRL';
Money.defaultPrecision = 2;
export default class Cart {
  items = [];
  add(item) {
    if (find(this.items, { product: item.product })) {
      remove(this.items, { product: item.product });
    }
    this.items.push(item);
  }

  remove(product) {
    remove(this.items, { product });
  }

  getTotal() {
    return this.items.reduce((acc, curr) => {
      const amount = Money({ amount: curr.quantity * curr.product.price });
      let discount = Money({ amount: 0 });
      if (
        curr.condition &&
        curr.condition.percentage &&
        curr.quantity > curr.condition.minimum
      ) {
        discount = amount.percentage(curr.condition.percentage);
      }
      return acc.add(amount).subtract(discount);
    }, Money({ amount: 0 }));
  }
  summary() {
    const total = this.getTotal().getAmount();
    const items = this.items;

    return {
      total,
      items,
    };
  }
  checkout() {
    const { total, items } = this.summary();
    this.items = [];

    return {
      total,
      items,
    };
  }
}
