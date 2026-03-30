import React, { useEffect, useState } from 'react';
import { supabase } from './supabaseClient';
import AddIndustrialMachineForm from "./AddIndustrialMachineForm.jsx";

function IndustrialMachineList() {
    const [industrialMachines, setIndustrialMachines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchIndustrialMachines = async () => {
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
        fetchIndustrialMachines();
    }, []);

    const handleIndustrialMachineAdded = () => {
        fetchIndustrialMachines(); // Автоматическое обновление списка
    };

    const handleDeleteIndustrialMachine = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот станок?')) return;
        try {
            const { error } = await supabase
                .from('industrial_machine')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchIndustrialMachines()
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
            <AddIndustrialMachineForm onIndustrialMachineAdded={handleIndustrialMachineAdded}/>

            {industrialMachines.length === 0 ? (
                <p>У вас пока нет станков</p>
            ) : (
                <table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Тип станка</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Страна</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Год выпуска</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Бренд</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {industrialMachines.map((industrialMachine) => (
                        <tr key={industrialMachine.id}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{industrialMachine.id}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{industrialMachine.machine_type_code}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{industrialMachine.country}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{industrialMachine.year_of_manufacture}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{industrialMachine.brand}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button onClick={() => handleDeleteIndustrialMachine(industrialMachine.id)}>
                                    Удалить
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    );
}
export default IndustrialMachineList;