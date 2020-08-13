const express = require('express');
const router = express.Router();
const Suggestion = require('../models/Suggestion');
const Note = require('../models/Note');
const Product = require('../models/Product');
const Users = require('../models/User');
const { isAuth, isAuthenticated } = require('../helpers/auth');
const User = require('../models/User');


//index----------
router.get('/', async (req, res) => {
	const products = await Product.find({}).sort({date_add: 'desc' }).limit(5);
	res.render('index', {products});
});
router.get('/comida-rapida', async (req, res) => {
	const products = await Product.find({category: 'comida_rapida'}).sort({date_add: 'desc' });
	res.render('comidas-rapidas',{products});
});
router.get('/postres', async (req, res) => {
	const products = await Product.find({category: 'postre'}).sort({date_add: 'desc' });
	res.render('postres', {products});
});
router.get('/bebidas', async (req, res) => {
	const products = await Product.find({category: 'bebida'}).sort({date_add: 'desc' });
	res.render('bebidas', {products});
});

router.get('/salsas', async (req, res) => {
	const products = await Product.find({category: 'salsa'}).sort({date_add: 'desc' });
	res.render('salsas', {products});
});
router.get('/about', async (req, res) => {
	res.render('about');
});
router.get('/facebook', async (req, res) => {
	res.render('facebook');
});
router.get('/users', isAuth, async (req, res) => {
	const users = await Users.find();
	res.render('users', { users });
});
//Mostrar las notas, solo administradores
router.get('/notes', isAuth, async (req, res) => {
	const notes = await Note.find({ user: req.user.id }).sort({ date: 'desc' });
	res.render('notes/all_notes', { notes });
});

//Mostrar Productos
router.get('/products', isAuthenticated, async (req, res) => {
	const products = await Product.find().sort({date_add: 'desc' });
	res.render('products/products', {products});
	console.log(products);
});
//Mostrar Adicionales
router.get('/aditionals', async (req, res) => {
	const products = await Product.find().sort({date_add: 'desc' });
	res.render('products/aditionals', {products});
	console.log(products);
});

//Crear nueva nota---------------
router.post('/notes/new_note', isAuth, async (req, res) => {
	const { title, description, url } = req.body;
	const errors = [];
	const newNote = new Note({ title, description });
	newNote.user = req.user.id;
	await newNote.save();
	req.flash('succes_msg', 'Nota agregada satisfactoriamente')
	res.redirect(url);



});

//Aviso legal-------------
router.get('/legal', (req, res) => {
	res.render('legal');
});

//Sugerencias-----------
router.get('/suggestions', async (req, res) => {
	const suggestions = await Suggestion.find({ state: { $ne: 'Accepted' } }).sort({ date_add: 'desc' });
	res.render('suggestions', { suggestions });
});

//Añadir sugerencias
router.post('/suggestion', async (req, res) => {
	const { name, email } = req.body;
	var { suggestion } = req.body;
	suggestion = suggestion.replace(/\n|\r/g, " ");
	const newSuggestion = new Suggestion({
		user: name,
		email: email,
		suggestion: suggestion
	});
	const newNotification = new Notification({
		action: 'new_suggestion',
		type: 'suggestion',
		suggestion: 'Hay una nueva sugerencia'
	});
	await newNotification.save();
	await newSuggestion.save();
	res.redirect('/');
});

//Aceptar sugerencia
router.get('/accept_sug/:id', async (req, res) => {
	const suggestion = await Suggestion.findByIdAndUpdate(req.params.id, { $push: { state: 'Accepted' } });
	req.flash('succes_msg', 'Sugerencia Aceptada');
	res.redirect('/suggestions');
});

//Rechazar sugerencia....
router.get('/decline_sug/:id', async (req, res) => {
	const suggestion = await Suggestion.findByIdAndDelete(req.params.id);
	req.flash('succes_msg', 'Sugerencia eliminada correctamente');
	res.redirect('/suggestions');
});

//Sugerencias aceptadas....
router.get('/suggestions/accepted', async (req, res) => {
	const suggestions = await Suggestion.find({ state: 'Accepted' }).sort({ date_add: 'desc' });
	res.render('suggestions_accepted', { suggestions });
});



//Buscador de peliculas---------


//Paginación.....
router.get('/page/:page', async (req, res) => {
	let perPage = 9;
	let page = req.params.page || 1;
	const dest = await Movie.find({ views: { $gte: 20 } }).sort({ views: 'desc' }).limit(12);
	const moviesp = await Movie.find().skip((perPage * page) - perPage).limit(perPage).sort({ year: 'desc', date_add: 'desc' });
	await Movie.count().then(function (count) {
		num_pages = parseInt((count / 9) + 1);
	});
	res.render('movies', { moviesp, num_pages, page, dest });
});


module.exports = router;