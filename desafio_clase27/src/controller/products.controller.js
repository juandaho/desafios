import Product from "../dao/dbManagers/products.js";

const pm = new Product();

export default class ProductController {
  get = async (req, res) => {
    try {
      let { limit = 10, page = 1, query = "none", sort } = req.query;
      limit = parseInt(limit);
      page = parseInt(page);
      let products;
      if (query !== "none") {
        query = query.replace(/'/g, '"');
        try {
          JSON.parse(query);
        } catch {
          return res.status(400).send("Query must be sent in the format query={'property':'condition'} with single or double marks");
        }
        products = await pm.getSome(limit, page, query, sort);
      } else {
        products = await pm.getSome(limit, page, undefined, sort);
      }

      const constructLink = (page) => `http://localhost:8080/api/products/?limit=${limit}&page=${page}&query=${encodeURIComponent(query)}`;
      const nextLink = products.hasNextPage ? constructLink(page + 1) : null;
      const prevLink = products.hasPrevPage ? constructLink(page - 1) : null;

      if (!products) {
        return res.status(500).send({ status: "Error", error: "No info available" });
      }

      res.send({
        status: "Ok",
        payload: products.docs,
        totalPages: products.totalPages,
        prevPage: products.prevPage,
        nextPage: products.nextPage,
        page: products.page,
        hasPrevPage: products.hasPrevPage,
        hasNextPage: products.hasNextPage,
        nextLink: nextLink,
        prevLink: prevLink,
      });
    } catch (error) {
      console.error(error);
      res.status(500).send("Internal server error");
    }
  };

  post = async (req, res) => {
    try {
      const { title, description, code, price, stock, thumbnails } = req.body;
      let newProduct = {
        title,
        description,
        code,
        price,
        stock,
        thumbnails,
      };

      if (!title || !description || !code || !price || !stock) {
        res.send({ status: 404, payload: "Some data is missing" });
      } else {
        const result = await pm.saveProduct(newProduct);
        res.send({ status: "Ok", payload: result });
      }
    } catch {
      res.send(
        "This method only allows to create one product and the code must be not used"
      );
    }
  };

  put = async (req, res) => {
    try {
      const id = req.params.pid;

      const { title, description, code, price, stock, thumbnails } = req.body;
      let newProduct = {
        title,
        description,
        code,
        price,
        stock,
        thumbnails,
      };

      let result = await pm.put(id, newProduct);
      res.send({ status: "Ok", payload: result });
    } catch {
      res.send("The pid doesnt exist");
    }
  };

  delete = async (req, res) => {
    try {
      const id = req.params.pid;

      let result = await pm.delete(id);
      res.send({ status: "Ok", payload: result });
    } catch {
      res.send("The pid doesnt exist");
    }
  };
}
