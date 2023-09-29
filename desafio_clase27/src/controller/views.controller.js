import Product from "../dao/dbManagers/products.js";
import Cart from "../dao/dbManagers/carts.js";
const pm = new Product();
const cm = new Cart();

export default class ViewController {
    get = async(req, res) => {
        const isLogin = req.user.user ? true : false;
        const user = req.user.user;
    
        try {
            let { limit = 10, page = 1, query = 'none', sort } = req.query;
            limit = parseInt(limit, 10);
            page = parseInt(page, 10);
            
            if (isNaN(limit) || isNaN(page)) {
                throw new Error('Invalid limit or page number');
            }
        
            let products;
            if (query !== "none") {
                try {
                    JSON.parse(query);
                } catch (error) {
                    throw new Error('Invalid query format');
                }
                products = await pm.getSome(limit, page, query, sort);
            } else {
                products = await pm.getSome(limit, page, undefined, sort);
            }
        
            const constructLink = (page) => `http://localhost:8080/?limit=${limit}&page=${page}&query=${encodeURIComponent(query)}`;
            const nextLink = products.hasNextPage ? constructLink(page + 1) : null;
            const prevLink = products.hasPrevPage ? constructLink(page - 1) : null;
        
            const { hasNextPage, hasPrevPage, docs: productsDocs } = products;
        
            res.render('home', { products: productsDocs, hasNextPage, hasPrevPage, nextLink, prevLink, page, isLogin, user });
        } catch (error) {
            console.error(error);
            res.render('error', { error: error.message });
        }
    }

    getCart = async(req, res) => {
        let {cid} = req.params.cid;
        try {
            const isLogin = req.user.user ? true : false;
            const user = req.user.user;
            let cart = await cm.getOne(cid);
            res.render('carts', {cart, isLogin, user});
        } catch {
            res.render('error');
        }
    }

    getProduct = async(req, res) => {
        try {
            const isLogin = req.user.user ? true : false;
            const user = req.user.user;
            let pid = req.params.pid;
            let product = await pm.getOne(pid);
            let cartId = user.cart[0];
            res.render('product', {product, isLogin, user, cartId});
        } catch {
            res.render('error');
        }
    }

    getLogin = (req, res) => {
        res.render('login');
    }

    getRegister = (req, res) => {
        res.render('register');
    }

    getUser = async(req, res) => {
        const isLogin = req.user.user ? true : false;
        if (isLogin == false) {
            return res.render('login');
        }
        const user = req.user.user;
    
        let isAdmin = false;
        if (user.role == "admin") {
            isAdmin = true;
        }
    
        res.render('user', {user, isAdmin})
    }

    getAll = (req, res) => {
        res.render('NotFound');

    }
}