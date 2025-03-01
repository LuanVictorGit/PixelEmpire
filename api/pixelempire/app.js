import express from "express";
import "dotenv/config";
import cors from "cors";
import fs from "fs/promises";
import mysql from "mysql2";
import { MercadoPagoConfig, Payment } from 'mercadopago';

const client = new MercadoPagoConfig({
    accessToken: process.env.accessToken,
    options: {
        timeout: 5000
    }
});
const payment = new Payment(client);

const app = express();
const port = 3000;

app.use(express.json());
app.use(cors({ origin: '*' }));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/config", async (req, res) => {
    try {
        const config = await getFileConfiguration();
        res.status(200).json(config);
    } catch (err) {
        res.status(500).json({ error: 'Erro ao ler a configuração' });
        console.error(err);
    }
});

async function getFileConfiguration() {
    try {
        const data = await fs.readFile("./config/config.json", 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Erro ao ler o arquivo de configuração:', err);
    }
}

app.post("/payment", async (req, res) => {
    try {
        const price = Number(req.body.unit_price) * Number(req.body.quantity);
        const body = {
            transaction_amount: Number(price),
            description: req.body.title,
            payment_method_id: 'pix',
            payer: {
                email: 'luanvictorchagas2015@gmail.com'
            },
        };
        try {
            const response = await payment.create({ body });
            const nick = req.body.nick;
            const id = response.id;
            await checkTables();
            const connection = await getDbConnection();
            const query = 'INSERT INTO payments (nick, payment_id) VALUES (?, ?)';
            await connection.execute(query, [nick, id]);
            await connection.end();
            console.log(response);
            res.status(200).json({ response });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Erro ao processar o pagamento', details: error.message });
        }
    } catch (e) {
        console.log(e);
        res.status(500).json({ error: 'Erro ao gerar o link de pagamento.' });
    }

});

app.post('/checkpayment', async (req, res) => {
    const { id } = req.body;
    if (!id) {
        return res.status(400).json({ message: "O ID do pagamento é obrigatório!" });
    }
    try {
        const response = await fetch(`https://api.mercadopago.com/v1/payments/${id}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${process.env.accessToken}`,
            },
        });
        if (response.ok) {
            const paymentData = await response.json();
            return res.status(200).json(paymentData);
        }
        const errorData = await response.json();
        return res.status(response.status).json({
            message: "Não foi possível encontrar o pagamento com o ID fornecido.",
            error: errorData,
        });
    } catch (error) {
        return res.status(500).json({
            message: "Ocorreu um erro ao verificar o pagamento.",
            error: error.message,
        });
    }
});

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    charset: 'utf8mb4',
};
async function getDbConnection() {
    try {
        const connection = mysql.createConnection(dbConfig);
        console.log('Conexão com o banco de dados estabelecida.');
        return connection;
    } catch (error) {
        console.error('Erro ao conectar ao banco de dados:', error.message);
        throw error;
    }
}

async function checkTables() {
    const connection = await getDbConnection();
    const tables = `
      CREATE TABLE IF NOT EXISTS payments (nick VARCHAR(255), payment_id INT);
    `;
    await connection.execute(tables);
    await connection.end();
}

app.listen(port, async () => {
    console.log(`API pixelempire rodando na porta ${port}`);
    checkTables();
});