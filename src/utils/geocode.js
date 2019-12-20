const request = require('request')

const geocode = (city, callback) => {
    const coordinatesURL = 'https://api.mapbox.com/geocoding/v5/mapbox.places/' + city  + '.json?access_token=pk.eyJ1IjoiYWRhbWplbmlza2kiLCJhIjoiY2s0N3NjdDl4MHZrdjNkc2U5Y2xqZmNxZyJ9.B9xOVR3Y591Sb9y0atf4UQ&limit=1'
    request({url: coordinatesURL, json: true}, (err, {body}) => {
        if(err){
            callback('Unable to connect to geocoding service!', undefined)
        }
        else if (body.features.length === 0) {
            callback('Unable to find location: \'' + city + '\'. Try another search.', undefined)
        }
        else {
            callback(undefined, {
                location: body.features[0].place_name,
                longitude: String(body.features[0].center[0]),
                latitude: String(body.features[0].center[1])
            })
        }
    })
}

module.exports = geocode