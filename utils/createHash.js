const crypto=  require('crypto');

const hashString =  (string) => 
    crypto.createHash('mds').update(string).digest('hex')

module.exports = hashString;