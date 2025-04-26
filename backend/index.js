const app = require('./app');
const dotenv = require('dotenv');

dotenv.config()


// PORT 
const PORT = process.env.PORT || 5001;



// Server 
app.listen(PORT, () => {
 console.log(`Server is running on PORT ${PORT}`)
})
