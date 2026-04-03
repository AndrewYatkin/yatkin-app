import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient.js';
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

    const handleRepairAdded = () => {
        fetchRepairs();
    };
    const handleDeleteRepair = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот ремонт?')) return;
        try {
            const { error } = await supabase
                .from('repair')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchRepairs();
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
            <AddRepairForm onRepairAdded={handleRepairAdded}/>

            {repairs.length === 0 ? (
                <p>У вас пока нет ремонтов</p>
            ) : (
                <table style={{borderCollapse: 'collapse', width: '100%'}}>
                    <thead>
                    <tr>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>ID</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Тип станка</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Код ремонта</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Дата начала</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Описание</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {repairs.map((repair) => (
                        <tr key={repair.id}>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repair.id}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repair.machine_type_code}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repair.repair_code}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repair.start_date}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repair.description}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>
                                <button onClick={() => handleDeleteRepair(repair.id)} style={{marginLeft: '10px'}}>
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

export default RepairList;