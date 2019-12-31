const express = require('express')
let cartObj =require('./js/cartconstant');
let cart =require('./js/cart1');
var path =require('path')
var exphbs = require('express-handlebars'); 
var bodyParser = require('body-parser');
const app = express()
const port = 3000
let categoryId,prevId; 
app.set('views', path.join(__dirname,'views'));
app.use( express.static( 'src'));
app.use(express.static('server'));
app.use(express.static('js'));
app.use(express.static('./'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('hbs',exphbs({extname:'hbs',defaultLayout:'main',
	 partialsDir: __dirname+'/views/partials/',
    layoutDir: __dirname+'/views/layouts/',
	helpers:{
		ifEven:function(value , options){
			if(value%2=== 0 ){
				 return options.fn(this);
	       } else {
	            return options.inverse(this);
	        }
		},
		ifNewRow:function(value,options) {
			return value.map(function(item,index){
				 item.$first = (index+1)%4 === 0;
			});

		},
		foreach:function(arr, options) {
		    return arr.map(function(item,index) {
		        item.$first = (index+1)%4 === 0;
		        item.$last  = index === arr.length-1;
		        return options.fn(item);
		    }).join('');
		}
	}

}));

app.set('view engine', 'hbs');

var fs = require("fs"),
    json;

function readJsonFileSync(filepath, encoding){

    if (typeof (encoding) == 'undefined'){
        encoding = 'utf8';
    }
    var file = fs.readFileSync(filepath, encoding);
    return JSON.parse(file);
}

function getConfig(file){

    var filepath = __dirname + '/' + file;
    return readJsonFileSync(filepath);
}

//assume that config.json is in application root

categories = getConfig('server/categories/index.get.json');
banners = getConfig('server/banners/index.get.json');
products = getConfig('server/products/index.get.json');


app.get('/', (req, res) =>{
	console.log(cartObj.cartItems);
	res.render('home',{categories:categories, banners:banners,cartItems:cartObj.cartItems})
});
app.get('/login', (req, res) =>{
	res.render('login')
});
app.get('/register', (req, res) => res.render('register'));

app.get('/plp', (req, res) =>{
	console.log(cartObj.cartItems);
	res.render('plp',{categories:categories, products:products,cartItems:cartObj.cartItems});
});
app.get('/plp/:id', function (req, res) {
    let categoryId = req.params.id;
	let product_cat = products.filter((product) => product.category === categoryId);
	res.render('plp', { products: product_cat, categories:categories});
    
});

app.use('/cart', cart)


app.listen(port, () => console.log(`Example app listening on port ${port}!`))