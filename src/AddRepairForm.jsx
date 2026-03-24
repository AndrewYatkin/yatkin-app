import React, {useState} from 'react';
import {supabase} from './supabaseClient';

function AddRepairForm({onRepairAdded}) {
    const [machineTypeCode, setMachineTypeCode] = useState('');
    const [repairCode, setRepairCode] = useState('');
    const [startDate, setStartDate] = useState(false);
    const [error, setError] = useState(null);
    const handleSubmit = async (event) => {
        event.preventDefault();
        setStartDate(true);
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
            setMachineTypeCode('');
            setRepairCode('');
            alert(' >=B4:B CA?5L=> 4>546;5=!');
        } catch (error) {
            setError(error.message);
            console.error(' L85:4 ?@8 4>546;5=88 :>=B4:B4:', error.message);
        } finally {
            setStartDate(false);
        }
    };

    return (
        <div>
            <h2>Добавить новый ремонт</h2>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Имя</label>
                    <input
                        type="text"
                        id="name"
                        value={machineTypeCode}
                        onChange={(e) => setMachineTypeCode(e.target.value)}
                        required
                        disabled={startDate}
                    />
                </div>
                <div>
                    <label htmlFor="email">Email:</label>
                    <input
                        type="email"
                        id="email"
                        value={repairCode}
                        onChange={(e) => setRepairCode(e.target.value)}
                        required
                        disabled={startDate}
                    />
                </div>
                <button type="submit" disabled={startDate}>
                    {startDate ? ' >546;5=85...' : ' >5468BP :>=B4:B'}
                </button>
                {error && <p className="error"> L85:4: {error}</p>}
            </form>
        </div>
    );
}

export default AddRepairForm;