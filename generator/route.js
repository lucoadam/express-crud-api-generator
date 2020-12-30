const express = require('express');

const router = express.Router();


module.exports = (modal)=>{
    router.get('/index', (req, res) => {
        modal.find()
            .sort({ createdAt: -1 })
            .then(data => res.json(data))
    });

    router.get('/paginate/index', async (req, res) => {
        let { page = 1, limit = 10 } = req.query;

        try {
            page = parseInt(page)
            limit = parseInt(limit)
            // execute query with page and limit values
            const items = await modal.find()
                .limit(parseInt(limit))
                .sort({ createdAt: -1})
                .skip((parseInt(page )- 1) *parseInt(limit))
                .exec();

            // get total documents in the Posts collection
            let count = await modal.find();
            count = count.length

            // return response with posts, total pages, and current page
            res.json({
                items,
                totalItems: count,
                totalPages: Math.ceil(count / limit),
                currentPage: page
            });
        } catch (err) {
            console.error(err.message);
        }
    });

//Create Modal Item
    router.post('/create', (req, res) => {
        const newData = new modal({ ...req.body });
        newData.save().then(data => res.json(data))
            .catch(err => res.status(400).json({
                status: false
            }));
    });

//Find Modal Item
    router.get('/:id/', (req, res) => {
        modal.findById(req.params.id)
            .then(data => {
                res.json(data)
            })
            .catch(err => res.status(404).json({ success: false }))
    });

//Edit Modal Item
    router.put('/:id/edit', (req, res) => {
        console.log(req.body)
        let newvalues = { $set: req.body };
        modal.updateOne({ _id: req.params.id }, newvalues)
            .then(data => res.json(data))
            .catch(err => res.status(404).json({ success: false }))
    });


//Delete a Modal item
    router.delete('/:id/delete', (req, res) => {
        modal.findById(req.params.id)
            .then(item => item.remove().then(() => res.json({ success: true })))
            .catch(err => res.status(404).json({ success: false }))
    });
    
    return router
};