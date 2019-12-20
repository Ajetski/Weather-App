const request = require('request')

const forecast = (latitude, longitude, callback) => {
    const weatherUrl = 'https://api.darksky.net/forecast/f0af3fe5e73ec0684720ab5b69832ba1/' + latitude + ',' + longitude
    request({url: weatherUrl, json: true}, (err, {body}) => {

        if(err)
            callback('Unable to connect to weather service!', undefined)
        else if (body.error)
            callback('Unable to connect to weather service!', undefined)
        else
            callback(undefined, {
                forecast: body.daily.data[0].summary,
                temperature: String(body.currently.temperature),
                precipProbability: String(Math.round( body.currently.precipProbability * 100)),
                precipType: body.currently.precipType

            })
    })
}

module.exports = forecast