import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AddRepairForm from './AddRepairForm.jsx';

function RepairList() {
    const [contacts, setContacts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchContacts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('repair')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            setContacts(data);
        } catch (error) {
            setError(error.message);
            console.error(' H85>4 CD8 CB?GG9A88 >BAF4>FB6:', error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchContacts();
    }, []);
    /*
    Вместо этой строчки (внизу) вставить fetchContacts() для автоматического обновления
    списка при добавлении нового контакта.
    И необходимо удалить передающуюся переменную newContact
     */
    const handleContactAdded = (newContact) => {
        setContacts((prevContacts) => [newContact, ...prevContacts]);
    };
    const handleDeleteContact = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот контакт?')) return;
        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
            alert('Контакт успешно удален');
        } catch (error) {
            setError(error.message);
            console.error('ошибка при удалении контакта', error.message);
        }
    };
    if (loading) return <p>Загрузка контактов...</p>;
    if (error) return <p className="error">Ошибка: {error}</p>;
    return (
        <div>
            <h2>Ваши контакты</h2>
            <AddContactForm onContactAdded={handleContactAdded} /> {/* форма добавления */}
            {contacts.length === 0 ? (
                <p>У вас пока нет контактов</p>
            ) : (
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.id}>
                            {contact.name} - {contact.email}
                            <button onClick={() => handleDeleteContact(contact.id)} style={{ marginLeft: '10px' }}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default RepairList;