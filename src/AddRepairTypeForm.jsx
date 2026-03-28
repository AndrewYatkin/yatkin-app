import React, {useState} from 'react';
import {supabase} from './supabaseClient';

function AddRepairTypeForm({onRepairTypeAdded}) {
    const [repairCode, setRepairCode] = useState(0);
    const [name, setName] = useState('');
    const [duration, setDuration] = useState(0);
    const [price, setPrice] = useState(0.0);
    const [description, setDescription] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const {data, error} = await supabase
                .from('repair_type')
                .insert([{
                    repair_code: repairCode,
                    name: name,
                    duration: duration,
                    price: price,
                    description: description}]);
            if (error) {
                throw error;
            }
        // Передаем новую запись родительскому компоненту для обновления списка
            if (onRepairTypeAdded && data && data.length > 0) {
                onRepairTypeAdded(data[0]);
            }
            setRepairCode(0);
            setName('');
            setDuration(0);
            setPrice(0.0);
            setDescription('')
            alert('Тип ремонта успешно добавлен');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при добавлении типа ремонта:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Добавить новый тип ремонта</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="repairCode">Код типа ремонта</label>
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
                    <label htmlFor="name">Название ремонта</label>
                    <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="duration">Продолжительность ремонта</label>
                    <input
                        type="number"
                        id="duration"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="price">Стоимость ремонта</label>
                    <input
                        type="number"
                        id="price"
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
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
                        onChange={(e) => setDescription(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Добавление...' : 'Добавить тип ремонта'}
                </button>
                {error && <p className="error"> L85:4: {error}</p>}
            </form>
        </div>
    );
}

export default AddRepairTypeForm;