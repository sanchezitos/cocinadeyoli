const path = require('path');
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const Product = require('../models/Product');
const fs = require('fs-extra');
const {unlink} = require('fs-extra');
const { isAuthenticated } = require('../helpers/auth');

const cloudinary = require('cloudinary');
cloudinary.config({
	cloud_name: 'la-cocina-de-yoli',
	api_key: '968295357187844',
	api_secret: 'Ns3lIyYWMztXATOhxHwkupP6H94'
});



router.post('/product/add', isAuthenticated, async (req, res) =>{
	const {name, category, description, price, user, user_id} = req.body;
	const user_a = User.findById(user);
		const ext = path.extname(req.file.originalname).toLowerCase();
		const imageTempPath = req.file.path;
		//const img = title.replace(/ /g,"%");
		const targetPath = path.resolve('src/public/upload/' + name + ext);
		const result = await cloudinary.v2.uploader.upload(req.file.path);
		if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
			await fs.rename(imageTempPath, targetPath);
			
			const newProduct = new Product({
				name,
				category,
				description,
				price,
				user,
				user_id,
				imageURL: result.url,
				image_id: result.public_id
			
			});
			
			const productSaved = await newProduct.save();
			await fs.unlink('src/public/upload/' + name + ext);
			console.log(productSaved);

		} else {
			await fs.unlink(imageTempPath);
			req.flash('error', 'Solo se permite subir imagenes');
			res.redirect('/products')
		}
		req.flash('succes_msg', 'Producto añadido correctamente');
			res.redirect('/products');
			
	

});

router.put('/product/edit/:id', async (req, res) => {
	const { name, description, category, price, url } = req.body;
	await Product.findByIdAndUpdate(req.params.id, { name, description, category, price });
		req.flash('succes_msg', 'Datos actualizados satisfactoriamente');
		res.redirect(url);
	
});

router.put('/product/edit_img/:id',  async (req, res) => {
		const {url} = req.body;
		const ext = path.extname(req.file.originalname).toLowerCase();
		const imageTempPath = req.file.path;
		const targetPath = path.resolve('src/public/upload/' + req.params.id + ext);
		const result = await cloudinary.v2.uploader.upload(req.file.path);
		var imageURL = result.secure_url;
		var image_id = result.public_id
		console.log(imageURL, image_id);
		if (ext === '.png' || ext === '.jpg' || ext === '.jpeg' || ext === '.gif') {
			await fs.rename(imageTempPath, targetPath);
			const res = await Product.findByIdAndUpdate(req.params.id, {imageURL, image_id});
			await fs.unlink('src/public/upload/' + req.params.id + ext);
			await cloudinary.v2.uploader.destroy(res.image_id);
			await res.save();
			console.log(res);
		} else {
			await fs.unlink(imageTempPath);
			req.flash('error', 'Solo se permite subir imagenes');
			res.redirect(url);
		}
		req.flash('succes_msg', 'Imagen cambiada correctamente');
			res.redirect(url);
	
});

router.delete('/product/delete/:id', async (req, res) =>{
	const {url} = req.body;
	product = await Product.findByIdAndDelete(req.params.id);
	await cloudinary.v2.uploader.destroy(product.image_id);
	req.flash('succes_msg', 'Producto eliminado');
	res.redirect(url);
});
router.get('/product/search', isAuthenticated, async (req, res) => {
	const product = req.query.product;
	const a = "Lo sentimos";
	const searchproduct = await Product.find({name: {$regex:product, $options: 'iu'}});
	if(searchproduct.length>0){
		res.render('Products/products', {searchproduct});
	}else{
		res.render('Products/products', {a, product});
		console.log(a)
	}
		
});

module.exports = router;