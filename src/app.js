const path = require('path')

const express = require('express')

const app = express()
const hbs = require('express-handlebars')

const geocode = require('./utils/geocode.js')
const forecast = require('./utils/forecast.js')

// Define paths for Express config-
const publicDirectoryPath = path.join(__dirname, 'public')
const viewsDirectoryPath = path.join(__dirname, 'views')

// Setup handlebars engine
//app.engine('handlebars', hbs());
app.engine('.hbs', hbs({extname: '.hbs'}));
app.set('view engine', 'handlebars');

// Setup directories to files
app.use(express.static(publicDirectoryPath))
app.set('views', viewsDirectoryPath)

app.get('', (req, res) => {
    if (!req.query.location) {
        return res.render('index.hbs', {
            layout: 'layout.hbs'
        })
    }

    geocode(req.query.location, (gecodeErr, {location, latitude, longitude}) => {
        if(gecodeErr)
            return res.send(gecodeErr)
        forecast(latitude, longitude, (forecastErr, {forecast, temperature, precipProbability, precipType = 'rain'}) => {
            if(forecastErr)
                return res.send(forecastErr)

            res.render('index.hbs', {
                layout: 'layout.hbs',
                location: 'Location: ' + location + '; Latitude: ' + latitude + ' Longitude:' + longitude,
                forecast: 'Forecast: ' + forecast + ' It is currently ' + temperature +
                    ' degrees out. There is a ' +  precipProbability + '% chance of ' + precipType + '.'
            })
        })
    })
})

app.get('/about', (req, res) => {
    res.render('about.hbs', {
        layout: 'layout.hbs'
    })
})

app.get('/help', (req, res) => {
    res.render('help.hbs', {
        layout: 'layout.hbs'
    })
})


app.get('/weather', (req, res) => {
    if (!req.query.location) {
        return res.send(
            'Error'
        )
    }

    geocode(req.query.location, (gecodeErr, locationData) => {
        if(gecodeErr)
            return res.send(gecodeErr)
        forecast(locationData.latitude, locationData.longitude, (forecastErr, forecastData) => {
            if(forecastErr)
                return res.send(forecastErr)

            res.send({
                location: locationData,
                forecast: forecastData
            })
        })
    })
})

app.get('*', (req, res) => {
    res.render('index.hbs', {
        layout: 'layout.hbs',
        title: 'Error 404',
        name: 'Adam Jeniski'
    })
})

app.listen(3000, () => {
    console.log('Server is listening on port 3000...')
})
