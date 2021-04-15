module.exports = app => {
    const invoices = require("../../controller/invoice");

    let router = require("express").Router();

    //Create a new invoice status
    router.post("/add", invoices.create);

    //Retrieve all invoices
    router.get('/', invoices.findAll);

    // Retrieve invoice by id; 
    router.get('/:id', invoices.findInvoiceById);

    // Delete invoice by id;
    router.delete('/:id', invoices.delete);

    // Update invoice by id;
    router.put('/:id', invoices.update);
    
    //api url route
    app.use('/api/invoices', router);

}