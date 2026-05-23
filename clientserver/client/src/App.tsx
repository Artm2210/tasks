import React, { useState, useEffect } from 'react';

interface Ship {
    id: string;
    name: string;
    type: string;
    captain: string;
    crew: number;
    year: number;
    addedOn: string;
}

export default function App() {
    const [ships, setShips] = useState<Ship[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingShip, setEditingShip] = useState<Ship | null>(null);
    const [form, setForm] = useState({ id: '', name: '', type: '', captain: '', crew: 0, year: new Date().getFullYear() });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('');

    const fetchShips = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/api/ships?page=${page}&take=10&filter=${filter}`);
            const data = await res.json();
            setShips(data.data);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchShips();
    }, [page, filter]);

    const handleSubmit = async () => {
        const url = editingShip 
            ? `http://localhost:3001/api/ships/${editingShip.id}`
            : 'http://localhost:3001/api/ships';
        const method = editingShip ? 'PATCH' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        
        if (res.ok) {
            setShowModal(false);
            setEditingShip(null);
            setForm({ id: '', name: '', type: '', captain: '', crew: 0, year: new Date().getFullYear() });
            fetchShips();
        } else {
            const error = await res.json();
            alert(error.message || 'Ошибка при сохранении');
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm('Удалить корабль?')) {
            const res = await fetch(`http://localhost:3001/api/ships/${id}`, { method: 'DELETE' });
            if (res.ok) {
                fetchShips();
            }
        }
    };

    const openEdit = (ship: Ship) => {
        setEditingShip(ship);
        setForm({ id: ship.id, name: ship.name, type: ship.type, captain: ship.captain, crew: ship.crew, year: ship.year });
        setShowModal(true);
    };

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h1>Корабли</h1>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input 
                    placeholder="Поиск по названию, типу, капитану..." 
                    value={filter} 
                    onChange={e => { setFilter(e.target.value); setPage(1); }}
                    style={{ padding: 8, flex: 1, border: '1px solid #ddd', borderRadius: 5 }}
                />
                <button 
                    onClick={() => { setEditingShip(null); setForm({ id: '', name: '', type: '', captain: '', crew: 0, year: new Date().getFullYear() }); setShowModal(true); }}
                    style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                >
                    + Добавить корабль
                </button>
            </div>
            
            {loading && <div>Загрузка...</div>}
            
            {!loading && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: 10, textAlign: 'left' }}>ID</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Название</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Тип</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Капитан</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Команда</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Год</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ships.map(ship => (
                            <tr key={ship.id} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: 10 }}>{ship.id}</td>
                                <td style={{ padding: 10 }}>{ship.name}</td>
                                <td style={{ padding: 10 }}>{ship.type}</td>
                                <td style={{ padding: 10 }}>{ship.captain}</td>
                                <td style={{ padding: 10 }}>{ship.crew}</td>
                                <td style={{ padding: 10 }}>{ship.year}</td>
                                <td style={{ padding: 10 }}>
                                    <button 
                                        onClick={() => openEdit(ship)} 
                                        style={{ marginRight: 8, padding: '4px 8px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(ship.id)} 
                                        style={{ padding: '4px 8px', background: '#f44336', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                                    >
                                        🗑️
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            
            {totalPages > 1 && (
                <div style={{ marginTop: 20, display: 'flex', gap: 10, justifyContent: 'center' }}>
                    <button 
                        onClick={() => setPage(p => Math.max(1, p - 1))} 
                        disabled={page === 1}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        ◀
                    </button>
                    <span style={{ padding: '8px 16px' }}>{page} / {totalPages}</span>
                    <button 
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))} 
                        disabled={page === totalPages}
                        style={{ padding: '8px 16px', cursor: 'pointer' }}
                    >
                        ▶
                    </button>
                </div>
            )}
            
            {showModal && (
                <div style={{ 
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, 
                    background: 'rgba(0,0,0,0.5)', display: 'flex', 
                    alignItems: 'center', justifyContent: 'center', zIndex: 1000 
                }}>
                    <div style={{ background: 'white', padding: 30, borderRadius: 10, width: 450 }}>
                        <h2 style={{ marginBottom: 20 }}>{editingShip ? '✏️ Редактировать корабль' : '⛵ Добавить корабль'}</h2>
                        
                        {!editingShip && (
                            <div style={{ marginBottom: 15 }}>
                                <input 
                                    placeholder="ID корабля (например SHIP-001)" 
                                    value={form.id} 
                                    onChange={e => setForm({...form, id: e.target.value})}
                                    style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                                />
                            </div>
                        )}
                        
                        <div style={{ marginBottom: 15 }}>
                            <input 
                                placeholder="Название" 
                                value={form.name} 
                                onChange={e => setForm({...form, name: e.target.value})}
                                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: 15 }}>
                            <input 
                                placeholder="Тип судна" 
                                value={form.type} 
                                onChange={e => setForm({...form, type: e.target.value})}
                                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                        </div>
                        
                        <div style={{ marginBottom: 15 }}>
                            <input 
                                placeholder="Капитан" 
                                value={form.captain} 
                                onChange={e => setForm({...form, captain: e.target.value})}
                                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <input 
                                type="number"
                                placeholder="Команда (человек)" 
                                value={form.crew} 
                                onChange={e => setForm({...form, crew: parseInt(e.target.value)})}
                                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                            <input 
                                type="number"
                                placeholder="Год спуска на воду" 
                                value={form.year} 
                                onChange={e => setForm({...form, year: parseInt(e.target.value)})}
                                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => { setShowModal(false); setEditingShip(null); }}
                                style={{ padding: '8px 16px', background: '#999', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                            >
                                Отмена
                            </button>
                            <button 
                                onClick={handleSubmit}
                                style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                            >
                                Сохранить
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}