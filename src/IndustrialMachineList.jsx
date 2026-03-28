import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AddIndustrialMachineForm from "./AddIndustrialMachineForm.jsx";

function IndustrialMachineList() {
    const [industrialMachines, setIndustrialMachines] = useState([]);


    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchContacts = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('industrial_machine')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            setIndustrialMachines(data);
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при получении станков:', error.message);
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
    const handleIndustrialMachineAdded = (newIndustrialMachine) => {
        setIndustrialMachines((prevIndustrialMachines) => [newIndustrialMachine, ...prevIndustrialMachines]);
    };

    const handleDeleteIndustrialMachine = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот станок?')) return;
        try {
            const { error } = await supabase
                .from('industrial_machine')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setIndustrialMachines((prevIndustrialMachines) =>
                prevIndustrialMachines.filter((industrialMachine) => industrialMachine.id !== id));
            alert('Станок успешно удален');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при удалении станка', error.message);
        }
    };
    if (loading) return <p>Загрузка станков...</p>;
    if (error) return <p className="error">Ошибка: {error}</p>;
    return (
        <div>
            <h2>Станки</h2>
            <AddIndustrialMachineForm onIndustrialMachineAdded={handleIndustrialMachineAdded}/> {/* форма добавления */}
            {industrialMachines.length === 0 ? (
                <p>У вас пока нет станков</p>
            ) : (
                <ul>
                    {industrialMachines.map((industrialMachine) => (
                        <li key={industrialMachine.id}>
                            {industrialMachine.id} - {industrialMachine.machine_type_code} - {industrialMachine.country} - {industrialMachine.year_of_manufacture} - {industrialMachine.brand}
                            <button onClick={() => handleDeleteIndustrialMachine(industrialMachine.id)} style={{ marginLeft: '10px' }}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
export default IndustrialMachineList;