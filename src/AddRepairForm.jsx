import { useState, useEffect } from 'react';
import { supabase } from './supabaseClient';

function AddRepairForm({ onRepairAdded }) {
    const [machineTypes, setMachineTypes] = useState([]);
    const [repairTypes, setRepairTypes] = useState([]);
    const [selectedMachineType, setSelectedMachineType] = useState('');
    const [selectedRepairType, setSelectedRepairType] = useState('');
    const [startDate, setStartDate] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [fetchingData, setFetchingData] = useState(true);

    // Загрузка списка типов станков
    useEffect(() => {
        const fetchMachineTypes = async () => {
            try {
                const { data, error } = await supabase
                    .from('industrial_machine')
                    .select('id, machine_type_code, brand')
                    .order('machine_type_code');

                if (error) throw error;
                setMachineTypes(data || []);
            } catch (error) {
                console.error('Ошибка при загрузке типов станков:', error.message);
                setError('Не удалось загрузить список типов станков');
            }
        };

        fetchMachineTypes();
    }, []);

    // Загрузка списка типов ремонтов
    useEffect(() => {
        const fetchRepairTypes = async () => {
            try {
                const { data, error } = await supabase
                    .from('repair_type')
                    .select('id, repair_code, name')
                    .order('repair_code');

                if (error) throw error;
                setRepairTypes(data || []);
            } catch (error) {
                console.error('Ошибка при загрузке типов ремонтов:', error.message);
                setError('Не удалось загрузить список типов ремонтов');
            } finally {
                setFetchingData(false);
            }
        };

        fetchRepairTypes();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        if (!selectedMachineType) {
            setError('Выберите тип станка');
            return;
        }

        if (!selectedRepairType) {
            setError('Выберите тип ремонта');
            return;
        }

        setLoading(true);

        try {
            const { data, error } = await supabase
                .from('repair')
                .insert([
                    {
                        machine_type_code: selectedMachineType,
                        repair_code: selectedRepairType,
                        start_date: startDate,
                        description: description
                    }
                ])
                .select();

            if (error) throw error;

            // Очищаем форму
            setSelectedMachineType('');
            setSelectedRepairType('');
            setStartDate('');
            setDescription('');

            if (onRepairAdded) {
                onRepairAdded(data[0]);
            }

        } catch (error) {
            setError(error.message);
            console.error('Ошибка при добавлении ремонта:', error.message);
        } finally {
            setLoading(false);
        }
    };

    if (fetchingData) {
        return <p>Загрузка данных...</p>;
    }

    return (
        <div>
            <h2>Добавить новый ремонт</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="machineType" style={{ display: 'block', marginBottom: '5px' }}>
                        Тип станка
                    </label>
                    <select
                        id="machineType"
                        value={selectedMachineType}
                        onChange={(e) => setSelectedMachineType(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Выберите тип станка</option>
                        {machineTypes.map((type) => (
                            <option key={type.id} value={type.machine_type_code}>
                                {type.machine_type_code} - {type.brand}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="repairType" style={{ display: 'block', marginBottom: '5px' }}>
                        Тип ремонта
                    </label>
                    <select
                        id="repairType"
                        value={selectedRepairType}
                        onChange={(e) => setSelectedRepairType(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    >
                        <option value="">Выберите тип ремонта</option>
                        {repairTypes.map((type) => (
                            <option key={type.id} value={type.repair_code}>
                                {type.repair_code} - {type.name}
                            </option>
                        ))}
                    </select>
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="startDate" style={{ display: 'block', marginBottom: '5px' }}>
                        Дата начала
                    </label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        required
                        disabled={loading}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                    />
                </div>

                <div style={{ marginBottom: '15px' }}>
                    <label htmlFor="description" style={{ display: 'block', marginBottom: '5px' }}>
                        Примечания
                    </label>
                    <textarea
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading}
                        rows="3"
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            resize: 'vertical'
                        }}
                    />
                </div>

                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                    }}
                >
                    {loading ? 'Добавление...' : 'Добавить ремонт'}
                </button>

                {error && (
                    <p className="error" style={{ color: 'red', marginTop: '10px' }}>
                        {error}
                    </p>
                )}
            </form>
        </div>
    );
}

export default AddRepairForm;