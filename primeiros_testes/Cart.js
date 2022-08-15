export default class Cart {
  items = [];
  add(item) {
    this.items.push(item);
  }

  getTotal() {
    return this.items.reduce((acc, curr) => {
      return acc + curr.quantity * curr.product.price;
    }, 0);
  }
}
