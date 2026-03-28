import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AddRepairForm from './AddRepairForm.jsx';

function RepairList() {
    const [repairs, setRepairs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRepairs = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('repair')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            setRepairs(data);
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при получении ремонтов:', error.message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchRepairs();
    }, []);
    /*
    Вместо этой строчки (внизу) вставить fetchContacts() для автоматического обновления
    списка при добавлении нового контакта.
    И необходимо удалить передающуюся переменную newContact
     */
    const handleRepairAdded = (newRepair) => {
        setRepairs((prevRepairs) => [newRepair, ...prevRepairs]);
    };
    const handleDeleteRepair = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот ремонт?')) return;
        try {
            const { error } = await supabase
                .from('repair')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setRepairs((prevRepairs) => prevRepairs.filter((repair) => repair.id !== id));
            alert('Ремонт успешно удален');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при удалении ремонта', error.message);
        }
    };
    if (loading) return <p>Загрузка ремонтов...</p>;
    if (error) return <p className="error">Ошибка: {error}</p>;
    return (
        <div>
            <h2>Ваши ремонты</h2>
            <AddRepairForm onRepairAdded={handleRepairAdded}/> {/* форма добавления */}
            {repairs.length === 0 ? (
                <p>У вас пока нет ремонтов</p>
            ) : (
                <ul>
                    {repairs.map((repair) => (
                        <li key={repair.id}>
                            {repair.id} - {repair.machine_type_code} - {repair.repair_code} - {repair.start_date} - {repair.description}
                            <button onClick={() => handleDeleteRepair(repair.id)} style={{ marginLeft: '10px' }}>
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