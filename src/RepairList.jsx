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
    const handleContactAdded = (newContact) => {
        setContacts((prevContacts) => [newContact, ...prevContacts]);
    };
    const handleDeleteContact = async (id) => {
        if (!window.confirm(' O G69D9AO, GFB IBF8F9 G84?8FP QFBF >BAF4>F?')) return;
        try {
            const { error } = await supabase
                .from('contacts')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setContacts((prevContacts) => prevContacts.filter((contact) => contact.id !== id));
            alert(' BAF4>F GEC9HAB G84?9A!');
        } catch (error) {
            setError(error.message);
            console.error(' H85>4 CD8 G84?9A88 >BAF4>F4:', error.message);
        }
    };
    if (loading) return <p> 47DG7>4 >BAF4>FB6...</p>;
    if (error) return <p className="error"> H85>4: {error}</p>;
    return (
        <div>
            <h2> 4H8 >BAF4>FO</h2>
            <AddContactForm onContactAdded={handleContactAdded} /> {/* (BD@4 8B546?9A8O */}
            {contacts.length === 0 ? (
                <p>' 64E CB>4 A9F >BAF4>FB6.</p>
            ) : (
                <ul>
                    {contacts.map((contact) => (
                        <li key={contact.id}>
                            {contact.name} - {contact.email}
                            <button onClick={() => handleDeleteContact(contact.id)} style={{ marginLeft: '10px' }}>
                                '84?8FP
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default RepairList;