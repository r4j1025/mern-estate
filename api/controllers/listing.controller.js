import Listing from "../models/listing.model.js";
import { errorHandler } from "../utils/error.js";

export const createListing = async (req,res,next)=>{
    try {
        const listing = await Listing.create(req.body);
        return res.status(201).json(listing);
    } catch (error) {
        next(error)
    }
}

export const deleteListing = async (req,res,next)=>{
    const listing = await Listing.findById(req.params.id);

    if (!listing){
        return next(errorHandler(404,'Listing not found!'));
    }

    if (req.user.id !== listing.userRef){
        return next(errorHandler(401,'forbidden'));
    }

    try {
        await Listing.findByIdAndDelete(req.params.id);
        res.status(200).json('Listing had been deleted');
    } catch (error) {
        next(error);
    }
}

export const updateListing = async (req, res, next) => {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return next(errorHandler(404, 'Listing not found!'));
    }
    if (req.user.id !== listing.userRef) {
      return next(errorHandler(401, 'You can only update your own listings!'));
    }
  
    try {
      const updatedListing = await Listing.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.status(200).json(updatedListing);
    } catch (error) {
      next(error);
    }
  };

  export const getListing = async (req,res,next)=>{
    try {
      const listing = await Listing.findById(req.params.id);
      if (!listing) {
        return next(errorHandler(404, 'Listing not found!'));
      }
      res.status(200).json(listing);
    } catch (error) {
      next(error);
    }
  }

  export const getListings = async (req,res,next)=>{
    try {
      const limit = parseInt(req.query.limit) || 9;   //http://localhost:3000/api/listing/get?limit=2  <-- this is the 'req.query.limit'
      // this line says if there is a limit then parse it into limit variable or assign 9.
      const startIndex = parseInt(req.query.startIndex) || 0;

      let offer = req.query.offer; //true or false, if not mentioned in query then it is 'undefined'.
      if (offer === undefined || offer === 'false'){
        offer = {$in:[false,true]}; //if we not checked offer option then search 'in' db for both true and false values of offer.
      }

      let furnished = req.query.furnished; 
      if (furnished === undefined || furnished === 'false'){
        furnished = {$in:[false,true]}; 
      }

      let parking = req.query.parking; 
      if (parking === undefined || parking === 'false'){
        parking = {$in:[false,true]}; 
      }

      let type = req.query.type; 
      if (type === undefined || type === 'all'){
        type = {$in:['sale','rent']}; 
      }

      const searchTerm = req.query.searchTerm || '';

      const sort = req.query.sort || 'createdAt';

      const order = req.query.order || 'desc';

      const listings = await Listing.find({  //regex is the builtin search func, it search for all possibilities
        name: {$regex:searchTerm, $options:'i'}, // 'i' means search is both upper and lower case.
        offer,
        furnished,
        parking,
        type,
      }).sort({[sort]:order}).limit(limit).skip(startIndex);  //use descending order for any type of sort , default: createdAt in desc order.

      return res.status(200).json(listings);

    } catch (error) {
      next(error);
    }
  }