import express from 'express';
import { faker } from '@faker-js/faker'
import cors from 'cors'

const app = express();

app.use(express.json());
app.use(cors({
        origin: 'http://localhost:3000',
    }))

const PORT = process.env.PORT || 3001;
const TOTAL_ITEMS = 150000;
const PAGE_SIZE = 50;

const generateItems = (startIndex: number, endIndex: number) => {

    return Array.from({ length: endIndex - startIndex + 1 }, () => ({
        id: faker.string.uuid(),
        avatar: faker.image.avatar(),
        name: faker.person.fullName(),
        website: faker.internet.url(),
        views: faker.datatype.number({ min: 0, max: 5000 }),
    }))
}

app.get('/api/items', (req, res) => {

    let page = req.query.page ? req.query.page : 1
    const prev = req.query.prev ? req.query.prev : false

    faker.seed(Number(page))
    // const page = 1
    const startIndex = (Number(page) - 1) * PAGE_SIZE;
    const endIndex = Math.min(startIndex + PAGE_SIZE - 1, TOTAL_ITEMS - 1);

    const items = generateItems(prev ? 0 : startIndex, endIndex)

    res.status(200).json({
        items,
        hasMore: endIndex < TOTAL_ITEMS - 1
    });
});

app.listen(PORT, () => {
    console.log(`Mock backend running on http://localhost:${PORT}`);
});
