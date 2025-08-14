import express from 'express';
import connectDB from './config/db.js';
import cors from 'cors';
import 'dotenv/config';
import authRoutes from './routes/authRoutes.js';
import transactionRoutes from './routes/transactionRoutes.js';
import budgetRoutes from './routes/budgetRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import reportRoutes from "./routes/reportRoutes.js"
import debtRoutes from './routes/debtRoutes.js';

const app = express();

// Connect Database
connectDB();

// Init Middleware
const allowedOrigins = [
    'http://localhost:5173', // Your local frontend
    process.env.FRONTEND_URL  // Your live frontend on Render
];
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    }
}));

app.use(express.json({ extended: false }));

app.get('/', (req, res) => res.send('API Running'));

// Define Routes
app.use('/api/users', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/debts', debtRoutes);


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));