import express from "express";

interface Ship {
    id: string;
    name: string;
    type: string;
    captain: string;
    crew: number;
    year: number;
    addedOn: string;
    deleted?: boolean;
}

const ships: Record<string, Ship> = {};

const sampleShips: Omit<Ship, "addedOn">[] = [
    { id: "SHIP-001", name: "Титаник", type: "Пассажирский", captain: "Эдвард Смит", crew: 892, year: 1912 },
    { id: "SHIP-002", name: "Мэри Роуз", type: "Военный", captain: "Джордж Кэрью", crew: 400, year: 1511 },
    { id: "SHIP-003", name: "Санта-Мария", type: "Каравелла", captain: "Христофор Колумб", crew: 90, year: 1460 },
    { id: "SHIP-004", name: "Виктория", type: "Фрегат", captain: "Фернан Магеллан", crew: 55, year: 1519 },
    { id: "SHIP-005", name: "Королева Анна", type: "Пиратский", captain: "Эдвард Тич", crew: 300, year: 1710 },
];

sampleShips.forEach(ship => {
    ships[ship.id] = { ...ship, addedOn: new Date().toISOString() };
});

export function createApp() {
    const app = express();
    
    app.use((_req, res, next) => {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET, POST, PATCH, DELETE, OPTIONS");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        
        if (_req.method === "OPTIONS") {
            res.sendStatus(200);
            return;
        }
        next();
    });
    
    app.use(express.json());

    app.get("/api/ships", (req, res) => {
        const page = parseInt(req.query.page as string) || 1;
        const take = parseInt(req.query.take as string) || 10;
        const sort = (req.query.sort as string) || "addedOn";
        const filter = ((req.query.filter as string) || "").toLowerCase();
        
        let items = Object.values(ships).filter(s => !s.deleted);
        
        if (filter) {
            items = items.filter(s => 
                s.name.toLowerCase().includes(filter) || 
                s.type.toLowerCase().includes(filter) ||
                s.captain.toLowerCase().includes(filter) ||
                s.id.toLowerCase().includes(filter)
            );
        }
        
        const reverse = sort.startsWith("-");
        const sortField = reverse ? sort.slice(1) : sort;
        items.sort((a, b) => {
            const aVal = a[sortField as keyof Ship];
            const bVal = b[sortField as keyof Ship];
            if (typeof aVal === "string" && typeof bVal === "string") {
                return reverse ? bVal.localeCompare(aVal) : aVal.localeCompare(bVal);
            }
            if (typeof aVal === "number" && typeof bVal === "number") {
                return reverse ? bVal - aVal : aVal - bVal;
            }
            return 0;
        });
        
        const total = items.length;
        const start = (page - 1) * take;
        const data = items.slice(start, start + take);
        
        res.json({
            data,
            total,
            page,
            take,
            total_pages: Math.ceil(total / take)
        });
    });

    app.post("/api/ships", (req, res) => {
        const { id, name, type, captain, crew, year } = req.body;
        
        if (!id || !name || !type || !captain) {
            res.status(400).json({ type: "ValidationError", message: "ID, name, type and captain are required" });
            return;
        }
        
        if (ships[id] && !ships[id].deleted) {
            res.status(400).json({ type: "ValidationError", message: "Ship with this ID already exists" });
            return;
        }
        
        const ship: Ship = {
            id,
            name,
            type,
            captain,
            crew: parseInt(crew) || 0,
            year: parseInt(year) || 0,
            addedOn: new Date().toISOString()
        };
        
        ships[id] = ship;
        res.status(201).json(ship);
    });

    app.get("/api/ships/:id", (req, res) => {
        const ship = ships[req.params.id];
        
        if (!ship || ship.deleted) {
            res.status(404).json({ type: "NotFound", message: "Ship not found" });
            return;
        }
        
        res.json(ship);
    });

    app.patch("/api/ships/:id", (req, res) => {
        const ship = ships[req.params.id];
        
        if (!ship || ship.deleted) {
            res.status(404).json({ type: "NotFound", message: "Ship not found" });
            return;
        }
        
        const { name, type, captain, crew, year } = req.body;
        if (name) ship.name = name;
        if (type) ship.type = type;
        if (captain) ship.captain = captain;
        if (crew) ship.crew = parseInt(crew);
        if (year) ship.year = parseInt(year);
        
        res.json(ship);
    });

    app.delete("/api/ships/:id", (req, res) => {
        const ship = ships[req.params.id];
        
        if (!ship || ship.deleted) {
            res.status(404).json({ type: "NotFound", message: "Ship not found" });
            return;
        }
        
        ship.deleted = true;
        res.json({ message: "Ship deleted successfully" });
    });

    app.get("/api/ships/:id/status", (req, res) => {
        const ship = ships[req.params.id];
        
        if (!ship || ship.deleted) {
            res.status(404).json({ type: "NotFound", message: "Ship not found" });
            return;
        }
        
        res.json({
            total: 1,
            available: 1,
            popularity: 0
        });
    });

    return app;
}