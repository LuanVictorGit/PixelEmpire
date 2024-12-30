import express from "express";
import cors from "cors";
import fs from "fs/promises";
import path from "path";

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

app.listen(port, () => {
    console.log(`API pixelempire rodando na porta ${port}`);
});