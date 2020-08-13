const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/cocina'
	, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false
})

.then(db => console.log('base de datos conectada'))
.catch(err => console.error(err));