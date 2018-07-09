const endpoint   = 'https://api.organizze.com.br/rest/v2'

const helpers = {
    buildUrl: (method) => {
        return endpoint + '/' + method
    }
}

module.exports = helpers