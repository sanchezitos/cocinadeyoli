const mongoose = require('mongoose');

mongoose.connect('mongodb+srv://david:Sistemas8@cluster0-drc9a.mongodb.net/<dbname>?retryWrites=true&w=majority'
	, {
	useCreateIndex: true,
	useNewUrlParser: true,
	useFindAndModify: false
})

.then(db => console.log('base de datos conectada'))
.catch(err => console.error(err));