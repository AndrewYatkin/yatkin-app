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
    /*
    Вместо этой строчки (внизу) вставить fetchContacts() для автоматического обновления
    списка при добавлении нового контакта.
    И необходимо удалить передающуюся переменную newContact
     */
    const handleRepairTypeAdded = (newRepairType) => {
        setRepairTypes((prevRepairTypes) => [newRepairType, ...prevRepairTypes]);
    };
    const handleDeleteRepairType = async (id) => {
        if (!window.confirm('Вы уверены что хотите удалить этот тип ремонта?')) return;
        try {
            const { error } = await supabase
                .from('repair_type')
                .delete()
                .eq('id', id);
            if (error) throw error;
            setRepairTypes((prevRepairTypes) => prevRepairTypes.filter((repairType) => repairType.id !== id));
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
            <AddRepairTypeForm onRepairTypeAdded={handleRepairTypeAdded}/> {/* форма добавления */}
            {repairTypes.length === 0 ? (
                <p>У вас пока нет типов ремонтов</p>
            ) : (
                <ul>
                    {repairTypes.map((repairType) => (
                        <li key={repairType.id}>
                            {repairType.id} - {repairType.repair_code} - {repairType.name} - {repairType.duration} - {repairType.price} - {repairType.description}
                            <button onClick={() => handleDeleteRepairType(repairType.id)} style={{ marginLeft: '10px' }}>
                                Удалить
                            </button>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

export default RepairTypeList;