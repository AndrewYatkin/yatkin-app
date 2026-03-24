import React, {useState} from 'react';
import {supabase} from './supabaseClient';

function AddRepairForm({onRepairAdded}) {
    const [machineTypeCode, setMachineTypeCode] = useState(0);
    const [repairCode, setRepairCode] = useState(0);
    const [startDate, setStartDate] = useState(Date.parse('12-12-1999'));
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const {data, error} = await supabase
                .from('contacts')
                .insert([{name: machineTypeCode, email: repairCode}]);
            if (error) {
                throw error;
            }
        // Передаем новую запись родительскому компоненту для обновления списка
            if (onRepairAdded && data && data.length > 0) {
                onRepairAdded(data[0]);
            }
            setMachineTypeCode(0);
            setRepairCode(0);
            setStartDate(Date.parse('12-12-1999'));
            setDescription('')
            alert('Ремонт успешно добавлен');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при добавлении ремонта:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Добавить новый ремонт</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="machineTypeCode">Код типа станка</label>
                    <input
                        type="number"
                        id="machineTypeCode"
                        value={machineTypeCode}
                        onChange={(e) => setMachineTypeCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="repairCode">Код ремонта</label>
                    <input
                        type="number"
                        id="repairCode"
                        value={repairCode}
                        onChange={(e) => setRepairCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="startDate">Дата начала</label>
                    <input
                        type="date"
                        id="startDate"
                        value={startDate}
                        onChange={(e) => setRepairCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="description">Примечания</label>
                    <input
                        type="text"
                        id="description"
                        value={description}
                        onChange={(e) => setRepairCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={startDate}>
                    {loading ? 'Добавление...' : 'Добавить ремонт'}
                </button>
                {error && <p className="error"> L85:4: {error}</p>}
            </form>
        </div>
    );
}

export default AddRepairForm;