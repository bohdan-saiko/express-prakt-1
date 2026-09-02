import dotenv from 'dotenv';
import app from './app.js';

dotenv.config();

const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

app.listen(Number(PORT), () => {
    console.log(`Server is running on http://localhost:${PORT} in [${NODE_ENV}] mode`);
});