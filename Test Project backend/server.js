const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());
const users = [
        { username: 'Admin', password: 'admin123' },
        { username: 'Phoenix', password: 'phoenix123' }
];

let phones = [
    { id: 1, brand: 'Oppo',    model: 'Model1', colour: 'Red', price: 10000 },
    { id: 2, brand: 'Vivo',    model: 'Model2', colour: 'Blue', price: 15000 },
    { id: 3, brand: 'OnePlus', model: 'Model3', colour: 'Black', price: 20000 },
    { id: 4, brand: 'Samsung', model: 'Model4', colour: 'white', price: 25000 },
    { id: 5, brand: 'Apple',   model: 'Model5', colour: 'grey', price: 50000 },
    { id: 6, brand: 'Micromax',model: 'Model6', colour: 'silver', price: 30000 },

];

app.post('/api/login', (req, res) => {
    console.log('Login API get Called');
    const { username, password } = req.body;
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.json({ message: 'Login successful' });
    } else {
        res.status(401).json({ message: 'Invalid username or password' });
    }
});

function authenticate(req, res, next) {
    console.log('in auth')
    const authHeader = req.headers['authorization'];

    if (authHeader) {
        const auth = authHeader.split(' ');
        const username = auth[0];
        const password = auth[1];
        console.log('in auth original', username, password);
        const user = users.find(u => u.username === username && u.password === password);
        if (user) {
            next();
        } else {
            res.status(401).json({ error: 'Authentication failed' });
        }
    }
}
//Add Phone
    app.post('/api/addPhones', authenticate, (req, res) => {
        const { id, brand, model, colour, price } = req.body;
        const newDevice = { id, brand, model, colour, price };
        phones.push(newDevice);
        res.json(phones);
    });

    // API to delete mobile devices (only for Authenticated User)
    app.delete('/api/deletePhones/:id', authenticate, (req, res) => {
        console.log('in delete', req.params.id);
        const deviceId = req.params.id;
        const deletedDevice = deleteDevice(deviceId);

        if (deletedDevice) {
            console.log(phones)
            res.status(200).json(phones);
        } else {
            res.status(404).json({ error: 'Device not found' });
        }
    });


    function deleteDevice(deviceId) {
        console.log('in delete method1', deviceId);
        var index = phones.findIndex(phone => phone.id == deviceId);

        console.log('in delete method', index)
        if (index !== -1) {
            const deletedDevice = phones[index];
            phones.splice(index, 1);
            return deletedDevice;
        }
        return null;
    }

    // API to list all phones
    app.get('/api/phones', (req, res) => {
        res.json(phones);
    });

    //Update phone list 
    app.put('/api/updatePhones/:id', (req, res) => {
        const id = parseInt(req.params.id);
        const { brand, model, colour, price } = req.body;
        // Find the phone with the matching ID
        const phoneIndex = phones.findIndex(phone => phone.id === id);
        // If the phone is found, update its details
        if (phoneIndex !== -1) {
          phones[phoneIndex] = { id, brand, model, colour, price };
          res.status(200).send(phones);
        } else {
          res.status(404).json({ message: 'Phone not found' });
        }
      });

    app.get('/api/phones/filter', (req, res) => {
        console.log('in filter at server', req.query);

        const { brand, model, colour } = req.query;

        let filteredPhones = phones;

        if (brand) {
            filteredPhones = filteredPhones.filter(phone => phone.brand.toLowerCase() === brand.toLowerCase());
        }

        if (model) {
            filteredPhones = filteredPhones.filter(phone => phone.model.toLowerCase() === model.toLowerCase());
        }

        if (colour) {
            filteredPhones = filteredPhones.filter(phone => phone.colour.toLowerCase() === colour.toLowerCase());
        }

        console.log(filteredPhones);
        res.send(filteredPhones);
    });

    app.get('/api/phones/price-range', (req, res) => {
        const { minPrice, maxPrice } = req.query;

        let filteredPhones = phones;

        if (minPrice && maxPrice) {
            filteredPhones = filteredPhones.filter(phone => phone.price >= minPrice && phone.price <= maxPrice);
        } else if (minPrice) {
            filteredPhones = filteredPhones.filter(phone => phone.price >= minPrice);
        } else if (maxPrice) {
            filteredPhones = filteredPhones.filter(phone => phone.price <= maxPrice);
        }

        res.json(filteredPhones);
    });


    // API to list all phones in ascending or descending order based on user input
    app.get('/api/phones/sort', (req, res) => {
        const { sortBy, sortOrder } = req.query;
      
        let sortedPhones = phones;
      
        if (sortBy && sortOrder) {
          switch (sortBy) {
            case 'model':
              sortedPhones.sort((a, b) => a.model.localeCompare(b.model));
              break;
            case 'price':
              sortedPhones.sort((a, b) => a.price - b.price);
              break;
            case 'brand':
              sortedPhones.sort((a, b) => a.brand.localeCompare(b.brand));
              break;
            case 'color':
              sortedPhones.sort((a, b) => a.color.localeCompare(b.color));
              break;
            default:
              break;
          }
      
          if (sortOrder === 'desc') {
            sortedPhones.reverse();
          }
        }
      
        res.json(sortedPhones);
      });
      
    // Start the server
    app.listen(3000, () => {
        console.log('Navigate to http://localhost:3000 in your browser.');

    });
