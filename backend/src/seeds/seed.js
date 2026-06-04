const dotenv = require('dotenv');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

dotenv.config({ path: require('path').join(__dirname, '../../.env') });

const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Coupon = require('../models/Coupon');
const Banner = require('../models/Banner');

const connectDB = require('../config/db');

const DUMMYJSON_API = 'https://dummyjson.com';

const CATEGORY_MAP = {
  'beauty': 'Beauty',
  'fragrances': 'Beauty',
  'skin-care': 'Beauty',
  'furniture': 'Home & Kitchen',
  'home-decoration': 'Home & Kitchen',
  'kitchen-accessories': 'Home & Kitchen',
  'groceries': 'Home & Kitchen',
  'laptops': 'Electronics',
  'smartphones': 'Electronics',
  'tablets': 'Electronics',
  'mobile-accessories': 'Electronics',
  'mens-shirts': 'Fashion',
  'mens-shoes': 'Fashion',
  'mens-watches': 'Fashion',
  'womens-dresses': 'Fashion',
  'womens-shoes': 'Fashion',
  'womens-bags': 'Fashion',
  'womens-jewellery': 'Fashion',
  'womens-watches': 'Fashion',
  'tops': 'Fashion',
  'sunglasses': 'Fashion',
  'sports-accessories': 'Sports',
  'motorcycle': 'Sports',
  'vehicle': 'Sports',
};

const SEED_CATEGORIES = [
  { name: 'Electronics', description: 'Latest gadgets and electronic devices', slug: 'electronics', image: { url: 'https://cdn.dummyjson.com/products/images/electronics/apple-watch/1.png', publicId: 'electronics' } },
  { name: 'Fashion', description: 'Trendy clothing and accessories', slug: 'fashion', image: { url: 'https://cdn.dummyjson.com/products/images/womens-dresses/black-women-suits/1.png', publicId: 'fashion' } },
  { name: 'Home & Kitchen', description: 'Everything for your home', slug: 'home-kitchen', image: { url: 'https://cdn.dummyjson.com/products/images/home-decoration/decoration-swing/1.png', publicId: 'home-kitchen' } },
  { name: 'Sports', description: 'Sports equipment and gear', slug: 'sports', image: { url: 'https://cdn.dummyjson.com/products/images/sports-accessories/baseball-bat/1.png', publicId: 'sports' } },
  { name: 'Beauty', description: 'Beauty and personal care products', slug: 'beauty', image: { url: 'https://cdn.dummyjson.com/products/images/beauty/essence-mascara-lash-princess/1.png', publicId: 'beauty' } },
];

const seedData = async () => {
  try {
    await connectDB();

    console.log('Clearing existing data...');
    await Promise.all([
      User.deleteMany({}),
      Product.deleteMany({}),
      Category.deleteMany({}),
      Coupon.deleteMany({}),
      Banner.deleteMany({}),
    ]);

    console.log('Creating admin user...');
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@example.com',
      password: 'password123',
      role: 'admin',
      isEmailVerified: true,
      phone: '+91-9876543210',
    });
    console.log(`Admin created: ${admin.email}`);

    console.log('Creating categories...');
    const categories = await Promise.all(SEED_CATEGORIES.map(d => new Category(d).save()));
    console.log(`${categories.length} categories created`);

    const catByName = {};
    categories.forEach((cat) => {
      catByName[cat.name] = cat._id;
    });

    console.log('Fetching products from DummyJSON...');
    const res = await fetch(`${DUMMYJSON_API}/products?limit=200`);
    if (!res.ok) throw new Error(`DummyJSON fetch failed: ${res.status}`);
    const { products: dummyProducts } = await res.json();
    console.log(`Fetched ${dummyProducts.length} products from DummyJSON`);

    const productsData = dummyProducts.map((dp) => {
      const targetCategory = CATEGORY_MAP[dp.category] || 'Electronics';
      const categoryId = catByName[targetCategory];

      let discountPrice;
      if (dp.discountPercentage && dp.discountPercentage > 0) {
        discountPrice = Math.round(dp.price * (1 - dp.discountPercentage / 100) * 100) / 100;
        if (discountPrice >= dp.price) discountPrice = undefined;
      }

      const images = (dp.images && dp.images.length > 0 ? dp.images : [dp.thumbnail])
        .filter(Boolean)
        .map((url, idx) => ({
          url,
          publicId: `dummyjson/${dp.id}-${idx}`,
        }));

      return {
        name: dp.title,
        description: dp.description,
        price: dp.price,
        discountPrice,
        category: categoryId,
        brand: dp.brand || targetCategory,
        stock: dp.stock || 50,
        images,
        tags: dp.tags || [],
        featured: dp.rating >= 4.3,
        averageRating: dp.rating,
        numReviews: dp.reviews ? dp.reviews.length : 0,
      };
    });

    const products = await Promise.all(productsData.map(d => new Product(d).save()));
    console.log(`${products.length} products created`);

    console.log('Creating coupons...');
    const couponsData = [
      {
        code: 'WELCOME10',
        description: '10% off on your first order',
        discountType: 'percentage',
        discountValue: 10,
        minPurchase: 500,
        maxDiscount: 500,
        validFrom: new Date(),
        validTill: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000),
        usageLimit: 1000,
        usedCount: 0,
        isActive: true,
      },
      {
        code: 'SAVE50',
        description: 'Flat ₹50 off on orders above ₹999',
        discountType: 'fixed',
        discountValue: 50,
        minPurchase: 999,
        maxDiscount: 50,
        validFrom: new Date(),
        validTill: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000),
        usageLimit: 500,
        usedCount: 0,
        isActive: true,
      },
    ];

    const coupons = await Coupon.insertMany(couponsData);
    console.log(`${coupons.length} coupons created`);

    console.log('Creating banners...');
    const bannersData = [
      {
        title: 'Summer Sale Extravaganza',
        subtitle: 'Up to 60% off on fashion and electronics',
        image: { url: 'https://res.cloudinary.com/demo/image/upload/v1/ecommerce/banners/summer-sale.jpg', publicId: 'ecommerce/banners/summer-sale' },
        link: '/products?category=Fashion',
        position: 'home-top',
        isActive: true,
        order: 1,
      },
      {
        title: 'New Arrivals',
        subtitle: 'Check out the latest products in our store',
        image: { url: 'https://res.cloudinary.com/demo/image/upload/v1/ecommerce/banners/new-arrivals.jpg', publicId: 'ecommerce/banners/new-arrivals' },
        link: '/products?sort=newest',
        position: 'home-middle',
        isActive: true,
        order: 1,
      },
      {
        title: 'Free Shipping',
        subtitle: 'On orders above ₹500. Shop now!',
        image: { url: 'https://res.cloudinary.com/demo/image/upload/v1/ecommerce/banners/free-shipping.jpg', publicId: 'ecommerce/banners/free-shipping' },
        link: '/products',
        position: 'home-bottom',
        isActive: true,
        order: 1,
      },
    ];

    const banners = await Banner.insertMany(bannersData);
    console.log(`${banners.length} banners created`);

    console.log('\n✓ Seed completed successfully!');
    console.log('  Admin credentials:');
    console.log('  Email: admin@example.com');
    console.log('  Password: password123');
    console.log(`  ${categories.length} categories`);
    console.log(`  ${products.length} products`);
    console.log(`  ${coupons.length} coupons`);
    console.log(`  ${banners.length} banners`);

    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedData();
