const request = require('supertest');
const express = require('express');

const app = express();
app.use(express.json());

app.post('/api/payments', (req, res) => {
    const { booking_id, user_id, amount } = req.body;
    if (!booking_id || !user_id || !amount) {
        return res.status(400).json({ error: "Missing fields" });
    }
    res.status(201).json({ message: "Payment successful", payment_id: 999 });
});

describe('Payment API Endpoints', () => {
    it('should process payment successfully with valid data', async () => {
        const res = await request(app)
            .post('/api/payments')
            .send({ booking_id: 1, user_id: 1, amount: 50.00 });
        
        expect(res.statusCode).toEqual(201);
        expect(res.body).toHaveProperty('payment_id');
    });

    it('should fail when amount is missing', async () => {
        const res = await request(app)
            .post('/api/payments')
            .send({ booking_id: 1, user_id: 1 });
        
        expect(res.statusCode).toEqual(400);
        expect(res.body).toHaveProperty('error');
    });
});

