import React, {useState} from 'react';
import {supabase} from './supabaseClient';

function AddIndustrialMachineForm({onIndustrialMachineAdded}) {
    const [machineTypeCode, setMachineTypeCode] = useState(0);
    const [country, setCountry] = useState('');
    const [yearOfManufacture, setYearOfManufacture] = useState(0);
    const [brand, setBrand] = useState('');

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const {data, error} = await supabase
                .from('industrial_machine')
                .insert([{
                    machineTypeCode: machineTypeCode,
                    country: country,
                    yearOfManufacture: yearOfManufacture,
                    brand: brand
                }]);
            if (error) {
                throw error;
            }
            // Передаем новую запись родительскому компоненту для обновления списка
            if (onIndustrialMachineAdded && data && data.length > 0) {
                onIndustrialMachineAdded(data[0]);
            }
            setMachineTypeCode('');
            setCountry('');
            setYearOfManufacture('');
            setBrand('');
            alert('Станок успешно добавлен');
        } catch (error) {
            setError(error.message);
            console.error('Ошибка при добавлении станка:', error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <h2>Добавить станок</h2>
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
                    <label htmlFor="country">Страна производитель</label>
                    <input
                        type="text"
                        id="country"
                        value={country}
                        onChange={(e) => setMachineTypeCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="yearOfManufacture">Имя</label>
                    <input
                        type="number"
                        id="yearOfManufacture"
                        value={yearOfManufacture}
                        onChange={(e) => setMachineTypeCode(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="brand">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={brand}
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <button type="submit" disabled={loading}>
                    {loading ? 'Добавление...' : 'Добавить станок'}
                </button>
                {error && <p className="error">Ошибка: {error}</p>}
            </form>
        </div>
    );
}

export default AddIndustrialMachineForm;