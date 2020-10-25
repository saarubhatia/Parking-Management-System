const mongoose = require("mongoose");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');

const API_PORT = 3005;
const app = express();

//Models 
const vehicle_parking = require('./models/vehicle_parking');
const parking_space = require('./models/parking_space');
const parking_zone = require('./models/parking_zone');

//false mangoose pluralize
mongoose.pluralize(null);

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
const router = express.Router();

//it includes username , password and databse name.
const dbUri = process.env.DATABASEURL || " mongodb://localhost/pmsdb"
mongoose.connect(dbUri, { useFindAndModify: false, useNewUrlParser: true, useUnifiedTopology: true });
let db = mongoose.connection;

// connect through mongo client this is optional 
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient(dbUri, { useNewUrlParser: true });

db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

db.once('open', function () {
    console.log("MongoDB database connection established successfully");
})

router.get("/", (req, res) => {
    res.json({ message: "HELLOW WORLDUUHHHH" });
});


router.get("/getDashboard", (req, res) => {
    console.log('req ', req.body);
    parking_space.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log(data)
        let dashboard = [];
        for (var i = 0; i < data.length; i++) {
            dashboard[i] = {
                title: data[i].parking_space_title,
                is_available: data[i].is_available,
                name: data[i].name || "",
                zone_id: data[i].parking_zone_id,
                vehicle_transaction_id: data[i].vehicle_transaction_id || ''
            }
        }

        return res.json({ success: true, dashboard });
    });
});

router.get("/getReport", (req, res) => {
    console.log('req ', req.body);
    vehicle_parking.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log(data);
        let report = [];
        for (let d of data) {
            report.push({
                parking_zone_id: d.parking_zone_id,
                parking_space_id: d.parking_space_id,
                booking_date_time: d.booking_date_time,
                release_date_time: d.release_date_time,
                name: d.name
            })
        }
        return res.json({ success: true, report });
    });
});

router.get("/getZone", (req, res) => {
    console.log('req ', req.body);
    parking_zone.find({}, (err, data) => {
        if (err || !data) return res.status(400).json({
            success: false,
            message: "No Data Exist"
        });
        console.log("get zone: ", data);
        return res.json({ success: true, data });
    });
});
router.get("/createZone", (req, res) => {
    console.log('req ', req.body);
    function nextChar(c) {
        return String.fromCharCode(c.charCodeAt(0) + 1);
    }
    parking_zone.find({}, {}, {}, function (err, zone) {
        
        console.log("zone", zone);
        console.log(zone.length);

        if (err || !zone) return console.error(err);

        let block = String.fromCharCode(65 + zone.length);
        console.log('block', block);

        new parking_zone({
            parking_zone_id: block, 
            parking_zone_title: block
        })
            .save((err, data) => {
                if (err) return console.error(err);
                console.log(data.parking_zone_title + " saved to parking_zone collection.");

                for (let i = 1; i <= 10; i++) {
                    let par = new parking_space({
                        is_available: true, parking_space_id: `${block}${i == 10 ? i : '0' + i}`, parking_space_title: `${block}${i == 10 ? i : '0' + i}`,
                        parking_zone_id: block, name: '', vehicle_transaction_id: ''
                    });
                    par.save((err, data) => {
                        if (err) return console.error(err);
                        console.log(data.parking_space_title + " saved to parking_space collection.");
                    });
                }

                return res.json({ success: true, data })
            });
    });

});

router.get("/deleteZone", (req, res) => {
    console.log('req ', req.body);
    parking_zone.find({}, {}, {}, function (err, zone) {
        console.log("zone", zone);
        console.log(zone.length);

        if (err || !zone) return console.error(err);

        let block = String.fromCharCode(65 + (zone.length - 1));
        console.log('delete block', block);

        parking_space.deleteMany({ parking_zone_id: block }, function (err) { });
        parking_zone.deleteOne({ parking_zone_id: block }, function (err, data) {
            if (err) return console.error(err);
            console.log(data + " delete parking_zone from parking_zone collection.");
            return res.json({ success: true, data })
        })
    })
});

router.post("/bookParking", (req, res) => {
    console.log('req ', req.body);

    const { title, is_available, name, zone_id } = req.body;

    let update = {
        is_available: false,
        name: name,
    },
        vehicle = {
            parking_zone_id: zone_id,
            parking_space_id: title,
            booking_date_time: new Date(),
            release_date_time: null,
            name: name
        };

    new vehicle_parking(vehicle).save((err, veh) => {
        console.log("veh ", veh);
        console.log("data error", err);
        if (err || !veh) return res.status(400).json({
            success: false,
            message: "Unable to update"
        });

        update.vehicle_transaction_id = veh._id;

        console.log("update ", update)
        parking_space.findOneAndUpdate({ parking_space_title: title }, update, { new: true, upsert: true, returnNewDocument: true }, (err, data) => {
            console.log("data ", data)
            if (err || !data) return res.status(400).json({
                success: false,
                message: "Unable to update"
            });

            return res.json({ success: true, data });
        });
    });
});
router.post("/releaseParking", (req, res) => {
    const { title, vehicle_transaction_id, is_available, name, zone_id } = req.body;
    let update = {
        is_available: true,
        name: '',
        vehicle_transaction_id: ''
    },
        vehicle = {
            release_date_time: new Date(),
        };

    vehicle_parking.findOneAndUpdate({ _id: mongoose.Types.ObjectId(vehicle_transaction_id) }, vehicle, (err, veh) => {
        if (err || !veh) return res.status(400).json({
            success: false,
            message: "Unable to update"
        });

        parking_space.findOneAndUpdate({ parking_space_title: title }, update, { new: true, upsert: true, returnNewDocument: true }, (err, data) => {
            console.log("data ", data)
            if (err || !data) return res.status(400).json({
                success: false,
                message: "Unable to update"
            });

            return res.json({ success: true, data });
        });
    });
});
app.use("/api", router);

app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));