let Drugdb = require('../model/model');


// creates and saves a new drug
exports.create = (req, res) => {
    // validate incoming request
    if (!req.body) {// if content of request (form data) is empty
        res.status(400).send({ message: "Content cannot be emtpy!" });// respond with this
        return;
    }

    //create new drug
    const drug = new Drugdb({
        name: req.body.name,//take values from form and assign to schema
        card: req.body.card,
        pack: req.body.pack,
        perDay: req.body.perDay,
        dosage: req.body.dosage
    })

    //save created drug to database
    drug
        .save(drug)//use the save operation on drug
        .then(data => {
            console.log(`${data.name} added to the database`)
            res.redirect('/manage');
        })
        .catch(err => {
            res.status(500).send({//catch error
                message: err.message || "There was an error while adding the drug"
            });
        });

}


// can either retrieve all drugs from the database or retrieve a single user
exports.find = (req, res) => {

    if (req.query.id) {//if we are searching for drug using its ID
        const id = req.query.id;

        Drugdb.findById(id)
            .then(data => {
                if (!data) {
                    res.status(404).send({ message: "Can't find drug with id: " + id })
                } else {
                    res.send(data)
                }
            })
            .catch(err => {
                res.status(500).send({ message: "Error retrieving drug with id: " + id })
            })

    } else {
        Drugdb.find()
            .then(drug => {
                res.send(drug)
            })
            .catch(err => {
                res.status(500).send({ message: err.message || "An error occurred while retriving drug information" })
            })
    }
}


// edits a drug selected using its  ID
exports.update = (req, res) => {
    if (!req.body) {
        return res
            .status(400)
            .send({ message: "Cannot update an empty drug" })
    }

    const id = req.params.id;
    Drugdb.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Drug with id: ${id} cannot be updated` })
            } else {
                res.send(data);
                //res.redirect('/');
            }
        })
        .catch(err => {
            res.status(500).send({ message: "Error in updating drug information" })
        })

}


// deletes a drug using its drug ID
exports.delete = (req, res) => {
    const id = req.params.id;

    Drugdb.findByIdAndDelete(id)
        .then(data => {
            if (!data) {
                res.status(404).send({ message: `Cannot Delete drug with id: ${id}. Pls check id` })
            } else {
                res.send({
                    message: `${data.name} was deleted successfully!`
                })
            }
        })
        .catch(err => {
            res.status(500).send({
                message: "Could not delete Drug with id=" + id
            });
        });
}

// GET /api/purchase?days=30
exports.purchaseCalc = async (req, res) => {
    const days = parseInt(req.query.days || '30', 10);
    if (isNaN(days) || days <= 0 || days > 3650) {
        return res.status(400).json({ message: 'days must be a number between 1 and 3650' });
    }

    const drugs = await Drugdb.find();
    const items = drugs.map(d => {
        const pills = days * (d.perDay || 0);
        const cardsToBuy = Math.ceil(pills / d.card);
        const packsToBuy = Math.ceil(pills / d.pack);
        return {
            id: d._id, name: d.name, perDay: d.perDay,
            card: d.card, pack: d.pack, days,
            cardsToBuy, packsToBuy, ratioPerPack: d.pack / d.card
        };
    });

    return res.json({ days, items });
}