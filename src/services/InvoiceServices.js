const mongoose = require('mongoose');
const FormData = require('form-data');
const axios = require('axios');

const CartModel = require('../models/CartModel');
const ProfileModel = require('../models/ProfileModel');
const InvoiceModel = require('../models/InvoiceModel');
const InvoiceProductModel = require('../models/InvoiceProductModel');
const PaymentSettingModel = require('../models/PaymentSettingModel');

const UserModel = require("../models/UserModel");


const ObjectID = mongoose.Types.ObjectId;

const CreateInvoiceService = async (req) => {
    try {
        const user_id = new ObjectID(req.headers.user_id);
        const cus_email = req.headers.email
        // Step-1: Calculate Total Payable & Vat
        const matchStage = {$match: {userID: user_id}}
        const JoinProductStage = {$lookup: {from: 'products', localField: 'productID', foreignField: '_id', as: 'product'}}
        const UnwindProductStage = {$unwind: '$product'}
        // Finding Product from user Cart
        const CartProducts = await CartModel.aggregate([matchStage, JoinProductStage, UnwindProductStage])

        let totalAmount = 0;
        CartProducts.forEach((element) => {
            let price;
            if (element.product.discount) {
                price = parseFloat(element.product.discountPrice)
            } else {
                price = parseFloat(element.product.price)
            }

            totalAmount = element.qty * price
        })

        const vat = totalAmount * 0.05;// 5% VAT
        const payable = totalAmount + vat;

        // Step-2: Prepare Customer Details & Shipping Details
        const Profile = await ProfileModel.aggregate([matchStage])
        const cus_details = `Name:${Profile[0]['cus_name']},Email:${cus_email},Address:${Profile[0]['cus_add']},Phone:${Profile[0]['cus_phone']}`
        const ship_details = `Name:${Profile[0]['ship_name']},City:${Profile[0]['ship_city']},Address:${Profile[0]['ship_add']},Phone:${Profile[0]['ship_phone']}`

        // Step-3: Transaction & Other's ID
        let trans_id = Math.floor(10000000 + Math.random() * 90000000)
        let val_id = 0;
        let delivery_status = 'pending'
        let payment_status = 'pending'


        // Step-4: Create Invoice
        const CreateInvoice = await InvoiceModel.create({
            userID: user_id,
            payable: payable,
            cus_details: cus_details,
            ship_details: ship_details,
            trans_id: trans_id,
            val_id: val_id,
            delivery_status: delivery_status,
            payment_status: payment_status,
            total: totalAmount,
            vat: vat
        })

        // Step-5: Create Invoice Product
        const invoice_id = CreateInvoice['_id']

        CartProducts.forEach(async (element) => {
            await InvoiceProductModel.create({
                    userID: user_id,
                    productID: element.productID,
                    invoiceID: invoice_id,
                    qty: element.qty,
                    price: element.product.discount ? parseFloat(element.product.discountPrice) : parseFloat(element.product.price),
                    color: element.color,
                    size: element.size,
                }
            )
        })
        // Step-6: Remove Carts
        await CartModel.deleteMany({userID: user_id})

        // Step-7: Prepare SSL Payment
        let PaymentSettings = await PaymentSettingModel.find();


        const form = new FormData();
        form.append('store_id', PaymentSettings[0]['store_id'])
        form.append('store_passwd', PaymentSettings[0]['store_passwd'])
        form.append('total_amount', payable.toString())
        form.append('currency', PaymentSettings[0]['currency'])
        form.append('tran_id', trans_id)

        // form.append('success_url', `${PaymentSettings[0]['success_url']}/${trans_id}`)
        form.append('success_url', `${PaymentSettings[0]['success_url']}`)
        // form.append('fail_url', `${PaymentSettings[0]['fail_url']}/${trans_id}`)
        form.append('fail_url', `${PaymentSettings[0]['fail_url']}`)
        // form.append('cancel_url', `${PaymentSettings[0]['cancel_url']}/${trans_id}`)
        form.append('cancel_url', `${PaymentSettings[0]['cancel_url']}`)
        form.append('ipn_url', `${PaymentSettings[0]['ipn_url']}/${trans_id}`)

        form.append('cus_name', Profile[0]['cus_name'])
        form.append('cus_email', cus_email)
        form.append('cus_add1', Profile[0]['cus_add'])
        form.append('cus_add2', Profile[0]['cus_add'])
        form.append('cus_city', Profile[0]['cus_city'])
        form.append('cus_state', Profile[0]['cus_state'])
        form.append('cus_postcode', Profile[0]['cus_postcode'])
        form.append('cus_country', Profile[0]['cus_country'])
        form.append('cus_phone', Profile[0]['cus_phone'])
        form.append('cus_fax', Profile[0]['cus_phone'])

        form.append('shipping_method', "YES")
        form.append('ship_name', Profile[0]['ship_name'])
        form.append('ship_add1', Profile[0]['ship_add'])
        form.append('ship_add2', Profile[0]['ship_add'])
        form.append('ship_city', Profile[0]['ship_city'])
        form.append('ship_state', Profile[0]['ship_state'])
        form.append('ship_country', Profile[0]['ship_country'])
        form.append('ship_postcode', Profile[0]['ship_postcode'])

        form.append('product_name', 'According Invoice')
        form.append('product_category', 'According Invoice')
        form.append('product_profile', 'According Invoice')
        form.append('product_amount', 'According Invoice')

        const SSLRes = await axios.post(PaymentSettings[0]['init_url'], form);


        return {status: "success", data: SSLRes.data}
    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}


const PaymentCanceledService = async (req) => {
    try {
        const trxID = req.params.trxID
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "cancel"})
        return {status: 'success'}
    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}

const PaymentIPNService = async (req) => {
    try {
        const trxID = req.params.trxID
        let status = req.body['status']
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: status})
        return {status: 'success'}
    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}


const PaymentSuccessService = async (req) => {
    try {
      const trxID = req.params.trxID;
      await InvoiceModel.updateOne(
        { tran_id: trxID },
        { payment_status: "success" }
      );

      return { status: "success" };
    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}

const PaymentFailedService = async (req) => {
    try {
        const trxID = req.params.trxID
        await InvoiceModel.updateOne({tran_id: trxID}, {payment_status: "fail"})
        return {status: 'success',}

    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}
const InvoiceListService = async (req) => {
    try {
        const user_id = req.headers.user_id
        const invoice = await InvoiceModel.find({userID: user_id})
        return {status: 'success', data: invoice}
    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}
const InvoiceProductListService = async (req) => {
    try {
        // const user_id = new ObjectID(req.headers.user_id);
        const invoice_id = new ObjectID(req.params.invoice_id)
        const matchStage = {$match: {invoiceID: invoice_id}}
        // const matchStage = {$match: {userID: user_id, invoiceID: invoice_id}}
        const JoinProductStage = {$lookup: {from: 'products', localField: 'productID', foreignField: '_id', as: 'product'}}
        const UnwindProductStage = {$unwind: '$product'}
        // Finding Product from user Cart
        const products = await InvoiceProductModel.aggregate([matchStage, JoinProductStage, UnwindProductStage])
        return {status: 'success', data: products}
    } catch (err) {
        return {status: 'fail', message: 'Something Went Wrong' + err.message}
    }
}

module.exports = {
    CreateInvoiceService,
    PaymentFailedService,
    PaymentCanceledService,
    PaymentIPNService,
    PaymentSuccessService,
    InvoiceListService,
    InvoiceProductListService
}