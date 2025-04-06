const { Types } = require("mongoose");
const { AddressModel } = require("../models/address.models.js");
const { UserModel } = require("../models/users.model.js");

async function getAllAddressByUID(req, res) {
    try {

        const { uid } = req.params;
        const { limit = 5, page = 1 } = req.query;

        if (!Types.ObjectId.isValid(uid)) throw new Error("Invalid user ID!");

        const addressData = await AddressModel.find({
            uid
        }).limit(limit).skip(Math.max(Math.min(limit, 10) * (page - 1), 0)).lean()

        if (!addressData.length) throw new Error("No Address found for this user!")

        return res.send({
            data: addressData,
            error: null
        })
    } catch (error) {
        console.error(error)
        res.send({
            data: null,
            error: error.message
        })
    }
}

async function getSingleAddressByID(req, res) {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Address ID!");

        const addressData = await AddressModel.findById(id).lean()

        if (!addressData) throw new Error("No Address found for this id!")

        return res.send({
            data: addressData,
            error: null
        })
    } catch (error) {
        console.error(error)
        res.send({
            data: null,
            error: error.message
        })
    }
}

async function updateAddressByID(req, res) {
    try {
        const { id } = req.params;
        const { name,
            phone,
            address1,
            address2,
            city,
            state,
            zipcode, } = req.body;

        if (!Types.ObjectId.isValid(id)) throw new Error("Invalid Address ID!");

        const addressData = await AddressModel.findByIdAndUpdate(id, {
            $set: {
                name,
                phone,
                address1,
                address2,
                city,
                state,
                zipcode,
            }
        }, { new: true }).lean()

        if (!addressData) {
            return res.status(404).json({ error: "Address not found!" });
        }

        return res.send({
            data: addressData,
            error: null
        })
    } catch (error) {
        console.error(error)
        res.send({
            data: null,
            error: error.message
        })
    }
}

async function addAddressByUID(req, res) {
    try {
        const { name,
            phone,
            address1,
            address2,
            city,
            state,
            zipcode,
            uid } = req.body;

        if (!name ||
            !phone ||
            !address1 ||
            !address2 ||
            !city ||
            !state ||
            !zipcode ||
            !uid) {
            throw new Error(
                "all required fields are not provided. name, phone, address1, address2, city, state, zipcode, uid",
            )
        }

        if (!Types.ObjectId.isValid(uid)) throw new Error("Invalid user ID!");

        const isUserExist = await UserModel.exists({ _id: uid });
        if (!isUserExist) throw new Error("User Doesn't Exist!");

        const addressData = await AddressModel.insertOne({
            name,
            phone,
            address1,
            address2,
            city,
            state,
            zipcode,
            uid,
        })

        console.log({ addressData });

        return res.send({
            data: addressData,
            error: null
        })

    } catch (error) {
        res.send({
            data: null,
            error: error.message
        })
    }
}

async function deleteAddressByID(req, res) {
    try {
        const { id } = req.params;

        if (!Types.ObjectId.isValid(id)) throw new Error("Invalid address!");

        const addressData = await AddressModel.deleteOne({ _id: id }).exec()

        if (addressData.deletedCount) {
            return res.send({
                data: null,
                error: null,
                message: "Address Deleted Successfully!"
            })
        } else {
            throw new Error("Address not deleted!")
        }

    } catch (error) {
        res.send({
            data: null,
            error: error.message
        })
    }
}

module.exports = {
    getAllAddressByUID,
    getSingleAddressByID,
    updateAddressByID,
    addAddressByUID,
    deleteAddressByID
}