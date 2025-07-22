const express = require("express");
const ProductController = require("../controllers/ProductController");
const UserController = require("../controllers/UserController");
const WishlistController = require("../controllers/WishListController");
const AuthVerification = require("../middlewares/AuthVerification");
const CartListController = require("../controllers/CartListController");
const InvoiceController = require("../controllers/InvoiceController");
const FeaturesController = require("../controllers/FeaturesController");

const router = express.Router();

//  Product routes
router.get("/ProductBrandList", ProductController.ProductBrandList);
router.get("/ProductCategoryList", ProductController.ProductCategoryList);
router.get("/ProductSliderList", ProductController.ProductSliderList);
router.get(
    "/ProductListByBrand/:BrandID",
    ProductController.ProductListByBrand
);
router.get(
    "/ProductListByCategory/:CategoryID",
    ProductController.ProductListByCategory
);
router.get(
    "/ProductListBySimilar/:CategoryID",
    ProductController.ProductListBySimilar
);
router.get(
    "/ProductListByKeyword/:Keyword",
    ProductController.ProductListByKeyword
);
router.get(
    "/ProductListByRemark/:Remark",
    ProductController.ProductListByRemark
);

router.post(
    "/ProductListByFilter",
    ProductController.ProductListByFilter
);
router.get("/ProductDetails/:ProductID", ProductController.ProductDetails);
router.get(
    "/ProductReviewList/:ProductID",
    ProductController.ProductReviewList
);
router.get(
    "/ProductReviewList/:ProductID",
    ProductController.ProductReviewList
);

// User Routes

router.get("/UserOTP/:email", UserController.UserOTP);
router.get("/VerifyLogin/:email/:otp", UserController.VerifyLogin);
router.get(
    "/UserLogout",
    AuthVerification,
    UserController.UserLogout
);
router.post("/CreateProfile", AuthVerification, UserController.CreateProfile);
router.post("/UpdateProfile", AuthVerification, UserController.UpdateProfile);
router.get("/ReadProfile", AuthVerification, UserController.ReadProfile);

// wish list
router.post("/SaveWishList", AuthVerification, WishlistController.SaveWishList);
router.post(
    "/RemoveWishList",
    AuthVerification,
    WishlistController.RemoveWishList
);
router.get("/WishList", AuthVerification, WishlistController.WishList);
module.exports = router;

//Cart
router.post("/SaveCartList", AuthVerification, CartListController.SaveCartList);
router.post(
    "/RemoveCartList",
    AuthVerification,
    CartListController.RemoveCartList
);
router.post(
    "/UpdateCartList/:cartID",
    AuthVerification,
    CartListController.UpdateCartList
);
router.get("/CartList", AuthVerification, CartListController.CartList);

// Invoice & Payment

router.get("/CreateInvoice", AuthVerification, InvoiceController.CreateInvoice);
router.get("/InvoiceList", AuthVerification, InvoiceController.InvoiceList);
router.get(
    "/InvoiceProductList/:invoice_id", AuthVerification,
    InvoiceController.InvoiceProductList
);
router.get(
    "/PaymentSuccess/:trxID",
    AuthVerification,
    InvoiceController.PaymentSuccess
);
router.get(
    "/PaymentCancel/:trxID",
    AuthVerification,
    InvoiceController.PaymentCancel
);
router.get(
    "/PaymentFail/:trxID",
    AuthVerification,
    InvoiceController.PaymentFail
);
router.get(
    "/PaymentIPN/:trxID",
    AuthVerification,
    InvoiceController.PaymentIPN
);

// Features
router.get("/FeaturesList", FeaturesController.FeaturesList);
router.get('/LegalDetails/:type', FeaturesController.LegalDetails)

//Create Review
router.post("/CreateReview", AuthVerification, ProductController.CreateReview);
// order page hotfix


module.exports = router;
