import { faker } from "@faker-js/faker";
import { factory, manyOf, oneOf, primaryKey } from "@mswjs/data";

export const db = factory({
  category: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.department,
    products: manyOf("product"),
  },
  product: {
    id: primaryKey(faker.number.int),
    name: faker.commerce.productName,
    price: () => faker.number.int({ min: 1, max: 100 }),
    categoryId: faker.number.int,
    category: oneOf("category"),
  },
});

export const getProductsByCategory = (categoryId: number) =>
  db.product.findMany({ where: { categoryId: { equals: categoryId } } });
