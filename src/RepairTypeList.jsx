import React, {useEffect, useState} from 'react';
import {supabase} from './supabaseClient';
import AddRepairTypeForm from './AddRepairTypeForm.jsx';

function RepairTypeList() {
    const [repairTypes, setRepairTypes] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchRepairTypes = async () => {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('repair_type')
                .select('*')
                .order('id', { ascending: false });
            if (error) throw error;
            setRepairTypes(data);
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при получении типов ремонтов:', error.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRepairTypes();
    }, []);

    const handleRepairTypeAdded = () => {
        fetchRepairTypes();
    };

    const handleDeleteRepairType = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот тип ремонта?')) return;
        try {
            const { error } = await supabase
                .from('repair_type')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchRepairTypes();
            alert('Тип ремонта успешно удален');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при удалении типа ремонта', error.message);
        }
    };
    if (loading) return <p>Загрузка типов ремонтов...</p>;
    if (error) return <p className="error">Ошибка: {error}</p>;
    return (
        <div>
            <h2>Ваши типы ремонтов</h2>
            <AddRepairTypeForm onRepairTypeAdded={handleRepairTypeAdded}/>

            {repairTypes.length === 0 ? (
                <p>У вас пока нет типов ремонтов</p>
            ) : (
                <table style={{borderCollapse: 'collapse', width: '100%'}}>
                    <thead>
                    <tr>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>ID</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Код ремонта</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Название</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Длительность</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Цена</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Описание</th>
                        <th style={{border: '1px solid #ddd', padding: '8px', textAlign: 'center'}}>Действия</th>
                    </tr>
                    </thead>
                    <tbody>
                    {repairTypes.map((repairType) => (
                        <tr key={repairType.id}>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repairType.id}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repairType.repair_code}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repairType.name}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repairType.duration}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repairType.price}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>{repairType.description}</td>
                            <td style={{border: '1px solid #ddd', padding: '8px'}}>
                                <button onClick={() => handleDeleteRepairType(repairType.id)}
                                        style={{marginLeft: '10px'}}>
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

export default RepairTypeList;