import React, {useState} from 'react';
import {supabase} from '../supabaseClient.js';

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
                    machine_type_code: machineTypeCode,
                    country: country,
                    year_of_manufacture: yearOfManufacture,
                    brand: brand
                }])
                .select();
            if (error) {
                throw error;
            }
            // Передаем новую запись родительскому компоненту для обновления списка
            if (onIndustrialMachineAdded && data && data.length > 0) {
                onIndustrialMachineAdded(data[0]);
            }
            setMachineTypeCode(0);
            setCountry('');
            setYearOfManufacture(0);
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
                        onChange={(e) => setCountry(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="yearOfManufacture">Год производства</label>
                    <input
                        type="number"
                        id="yearOfManufacture"
                        value={yearOfManufacture}
                        onChange={(e) => setYearOfManufacture(e.target.value)}
                        required
                        disabled={loading}
                    />
                </div>
                <div>
                    <label htmlFor="brand">Производитель</label>
                    <input
                        type="text"
                        id="brand"
                        value={brand}
                        onChange={(e) => setBrand(e.target.value)}
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