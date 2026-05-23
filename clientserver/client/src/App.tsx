import React, { useState, useEffect } from 'react';

interface Book {
    isbn: string;
    name: string;
    author: string;
    pages: number;
    year: number;
    addedOn: string;
}

export default function App() {
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [form, setForm] = useState({ isbn: '', name: '', author: '', pages: 0, year: new Date().getFullYear() });
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filter, setFilter] = useState('');

    const fetchBooks = async () => {
        setLoading(true);
        try {
            const res = await fetch(`http://localhost:3001/api/books?page=${page}&take=10&filter=${filter}`);
            const data = await res.json();
            setBooks(data.data);
            setTotalPages(data.total_pages);
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBooks();
    }, [page, filter]);

    const handleSubmit = async () => {
        const url = editingBook 
            ? `http://localhost:3001/api/books/${editingBook.isbn}`
            : 'http://localhost:3001/api/books';
        const method = editingBook ? 'PATCH' : 'POST';
        
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(form)
        });
        
        if (res.ok) {
            setShowModal(false);
            setEditingBook(null);
            setForm({ isbn: '', name: '', author: '', pages: 0, year: new Date().getFullYear() });
            fetchBooks();
        }
    };

    const handleDelete = async (isbn: string) => {
        if (confirm('Удалить книгу?')) {
            await fetch(`http://localhost:3001/api/books/${isbn}`, { method: 'DELETE' });
            fetchBooks();
        }
    };

    const openEdit = (book: Book) => {
        setEditingBook(book);
        setForm({ isbn: book.isbn, name: book.name, author: book.author, pages: book.pages, year: book.year });
        setShowModal(true);
    };

    return (
        <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
            <h1>Библиотека</h1>
            
            <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                <input 
                    placeholder="Поиск..." 
                    value={filter} 
                    onChange={e => { setFilter(e.target.value); setPage(1); }}
                    style={{ padding: 8, flex: 1, border: '1px solid #ddd', borderRadius: 5 }}
                />
                <button 
                    onClick={() => { setEditingBook(null); setForm({ isbn: '', name: '', author: '', pages: 0, year: new Date().getFullYear() }); setShowModal(true); }}
                    style={{ padding: '8px 16px', background: '#4CAF50', color: 'white', border: 'none', borderRadius: 5, cursor: 'pointer' }}
                >
                    + Добавить
                </button>
            </div>
            
            {loading && <div>Загрузка...</div>}
            
            {!loading && (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ background: '#f0f0f0' }}>
                            <th style={{ padding: 10, textAlign: 'left' }}>ISBN</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Название</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Автор</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Год</th>
                            <th style={{ padding: 10, textAlign: 'left' }}>Действия</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.isbn} style={{ borderBottom: '1px solid #ddd' }}>
                                <td style={{ padding: 10 }}>{book.isbn}</td>
                                <td style={{ padding: 10 }}>{book.name}</td>
                                <td style={{ padding: 10 }}>{book.author}</td>
                                <td style={{ padding: 10 }}>{book.year}</td>
                                <td style={{ padding: 10 }}>
                                    <button 
                                        onClick={() => openEdit(book)} 
                                        style={{ marginRight: 8, padding: '4px 8px', background: '#2196F3', color: 'white', border: 'none', borderRadius: 3, cursor: 'pointer' }}
                                    >
                                        ✏️
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(book.isbn)} 
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
                        style={{ padding: '8px 16px', cursor: 'pointer', disabled: { opacity: 0.5 } }}
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
                    <div style={{ background: 'white', padding: 30, borderRadius: 10, width: 400 }}>
                        <h2 style={{ marginBottom: 20 }}>{editingBook ? 'Редактировать' : 'Добавить книгу'}</h2>
                        
                        {!editingBook && (
                            <div style={{ marginBottom: 15 }}>
                                <input 
                                    placeholder="ISBN" 
                                    value={form.isbn} 
                                    onChange={e => setForm({...form, isbn: e.target.value})}
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
                                placeholder="Автор" 
                                value={form.author} 
                                onChange={e => setForm({...form, author: e.target.value})}
                                style={{ width: '100%', padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: 10, marginBottom: 20 }}>
                            <input 
                                type="number"
                                placeholder="Год" 
                                value={form.year} 
                                onChange={e => setForm({...form, year: parseInt(e.target.value)})}
                                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                            <input 
                                type="number"
                                placeholder="Страниц" 
                                value={form.pages} 
                                onChange={e => setForm({...form, pages: parseInt(e.target.value)})}
                                style={{ flex: 1, padding: 8, border: '1px solid #ddd', borderRadius: 5 }}
                            />
                        </div>
                        
                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button 
                                onClick={() => { setShowModal(false); setEditingBook(null); }}
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