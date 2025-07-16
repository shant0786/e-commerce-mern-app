

### **Full-Stack E-Commerce Application (MERN Stack)**  
🚀 **Overview:**  
Developed a dynamic and fully functional **MERN Stack E-Commerce Application** that allows users to seamlessly browse, search, filter, and purchase products. The platform features a smooth user experience with authentication, cart management, wishlist functionality, and an integrated review system.  

🔹 **Key Features:**  
- 🔍 **Product Search & Filtering** – Search by **brand** and **category**; filter products by **price range, brand, and category**.  
- 🛍️ **Product Details & Cart** – View product details, **add to cart** or **wishlist**, and proceed to checkout.  
- ✅ **User Authentication & Authorization** – Secure **email verification via OTP**, login/logout, and profile updates.  
- 🚚 **Order & Delivery Management** – Users can add delivery addresses and place orders effortlessly.  
- ⭐ **Review & Rating System** – Customers can leave reviews after purchasing.  

💡 **Tech Stack:**  
- **Frontend:** React.js, React-Bootstrap, Zustand (State Management), SweetAlert, and other UI libraries.  
- **Backend:** Node.js, Express.js, JWT, Mongoose, MongoDB, and essential backend tools.  

🎯 **Outcome:**  
Successfully built a **scalable and responsive** e-commerce platform with **secure authentication, real-time updates**, and a **user-friendly shopping experience**.  

🔗 **Live Demo:** *[<img src="https://github.com/al-rasels/techo-fullstack-mern-app/blob/main/Techo.png" >](https://techo-on-live-app.onrender.com)*  




---

This version is polished, professional, and LinkedIn-ready. Let me know if you'd like to tweak anything! 🚀

## Getting Started

### Prerequisites

Ensure you have the following installed on your system:

- **Node.js**: [Download and install](https://nodejs.org/).
- **MongoDB**: [Download and install](https://www.mongodb.com/try/download/community).

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/shant0786/e-commerce-mern-app.git
   ```

2. **Navigate to the project directory**:

   ```bash
   cd e-commerce-mern-app
   ```

3. **Install dependencies**:

   ```bash
   npm install
   ```

### Configuration

1. **Environment Variables**:

   Create a `.env` file in the root directory and add the following variables:

   ```env
   PORT=8000
   MONGO_URI=mongodb://localhost:27017/ecommerce
   JWT_SECRET=your_jwt_secret
   ```

   Replace `your_jwt_secret` with a secure secret key of your choice.

### Seeding the Database

To populate the database with initial data, run:

```bash
npm run seed
```

This will add sample users, products, and other necessary data to your MongoDB database.

### Running the Application

Start the development server with:

```bash
npm run dev
```

The server will run on `http://localhost:8000`.

# **API Endpoints Overview**  

## **1. Products**  
- Retrieve product brands, categories, and featured items.  
- Search and filter products by brand, category, similarity, keyword, or remarks.  
- Get detailed product information.  

## **2. User Authentication & Profile**  
- OTP-based login and verification.  
- Profile creation, update, and retrieval.  
- User logout.  

## **3. Wishlist**  
- Add, remove, and view wishlist items.  

## **4. Cart**  
- Manage cart items: add, update, remove, and view.  

## **5. Orders & Invoices**  
- Generate invoices and view order history.  

## **6. Features & Legal**  
- Retrieve app features and legal details.  

## **7. Reviews**  
- Submit and view product reviews.
- This structured list provides clear descriptions of each endpoint. Let me know if you need any modifications.

For detailed information on request and response structures, refer to the API documentation or the source code.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any enhancements or bug fixes.

## License

