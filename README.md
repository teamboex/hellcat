# 🎮 Hellcat Store - Premium Gaming Accounts

A modern, mobile-first e-commerce platform for premium Hellcat gaming accounts built with React. Features secure payment processing, comprehensive admin dashboard, and real-time inventory management.

![React](https://img.shields.io/badge/React-18.2.0-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.2.7-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

## ✨ Features

### 🛍️ **Store Experience**

- **Product Catalog**: Browse premium Hellcat accounts with detailed information
- **Advanced Filtering**: Filter by rank, price, mythic weapons, and more
- **Product Details Modal**: Full-screen responsive modal with complete account details
- **Secure Checkout**: Integrated Razorpay payment processing
- **Real-time Updates**: Live inventory and pricing updates

### 📱 **Mobile-First Design**

- **Responsive Layout**: Optimized for all screen sizes
- **Touch-Friendly**: Intuitive mobile navigation and interactions
- **Card-Based UI**: Clean, modern card layouts for products and orders
- **Smooth Animations**: Professional transitions and hover effects

### 🔧 **Admin Dashboard**

- **Order Management**: Complete order tracking and status updates
- **Product Inventory**: Add, edit, and manage product listings
- **Analytics**: Sales reports and performance metrics
- **Mobile Admin**: Fully responsive admin interface

### 🎯 **Account Features**

- **Detailed Profiles**: Level, rank, K/D ratio, win rate
- **Mythic Weapons**: Complete weapon inventory
- **Vehicles & Pets**: Special items and companions
- **Login Types**: Facebook, Google, Twitter support
- **Badges**: Hot, Exclusive, Limited Offer indicators

## 🚀 Tech Stack

- **Frontend**: React 18, React Router v6
- **Styling**: Tailwind CSS with custom animations
- **State Management**: React Context API
- **Payment**: Razorpay integration
- **Icons**: Lucide React
- **Notifications**: React Hot Toast
- **Build Tool**: Create React App

## 📦 Installation

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Quick Start

1. **Clone the repository**

```bash
git clone https://github.com/teamboex/bgmistore.git
cd bgmistore
```

2. **Install dependencies**

```bash
npm install
```

3. **Start development server**

```bash
npm start
```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
bgmistore/
├── public/
│   └── index.html
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── AdminDashboard.jsx
│   │   ├── ProductCard.jsx
│   │   ├── ProductDetailsModal.jsx
│   │   ├── CheckoutModal.jsx
│   │   └── ...
│   ├── context/            # Global state management
│   │   └── AppContext.jsx
│   ├── pages/              # Main application pages
│   │   └── StorePage.jsx
│   ├── services/           # API services and mock data
│   │   └── api.js
│   ├── styles/             # Global styles and themes
│   │   ├── globals.css
│   │   └── theme.js
│   └── utils/              # Utility functions
│       └── helpers.js
├── package.json
├── tailwind.config.js
└── README.md
```

## 🎨 Key Components

### Store Page

- **Product Grid**: Responsive grid layout with desktop/mobile views
- **Filter Bar**: Advanced filtering and search functionality
- **Product Cards**: Detailed product information with action buttons
- **Pagination**: Smooth navigation through product pages

### Admin Dashboard

- **Orders Management**: Complete order lifecycle management
- **Product Management**: Inventory control and product editing
- **Analytics**: Sales metrics and performance tracking
- **Mobile Responsive**: Touch-friendly admin interface

### Product Details Modal

- **Full-Screen Experience**: Immersive product viewing
- **Complete Information**: All account details in one place
- **Smooth Animations**: Professional open/close transitions
- **Mobile Optimized**: Perfect for mobile viewing

## 📱 Mobile Features

- **Responsive Cards**: Product and order information in mobile-friendly cards
- **Touch Navigation**: Swipe and tap interactions
- **Action Buttons**: Clearly visible and accessible action buttons
- **Optimized Layouts**: Content that fits perfectly on small screens

## 🔧 Available Scripts

```bash
# Development
npm start          # Start development server
npm run build      # Create production build
npm test           # Run test suite

# Production
npm run build      # Build for production
serve -s build     # Serve production build locally
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to GitHub Pages

```bash
npm install -g gh-pages
npm run build
gh-pages -d build
```

### Deploy to Netlify/Vercel

1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set publish directory: `build`
4. Deploy!

## 🎯 Features in Detail

### Product Management

- Add new products with detailed information
- Edit existing product details
- Delete products from inventory
- Real-time inventory updates

### Order Processing

- Secure payment processing
- Order status tracking
- Customer information management
- Delivery confirmation

### Analytics Dashboard

- Sales performance metrics
- Order statistics
- Revenue tracking
- Customer insights

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **React Team** for the amazing framework
- **Tailwind CSS** for the utility-first CSS framework
- **Lucide** for the beautiful icon set
- **Razorpay** for secure payment processing

---

**Built with ❤️ for the Hellcat gaming community**

_Ready to take your gaming to the next level? Browse our premium accounts today!_