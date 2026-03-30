import React, {useState, useEffect} from 'react';
import {BrowserRouter, Routes, Route, Navigate, Link} from 'react-router-dom';
import {supabase} from './supabaseClient';
import Auth from './Auth';
import RepairList from './RepairList';
import AddRepairForm from './AddRepairForm';
import IndustrialMachineList from "./IndustrialMachineList.jsx";
import AddIndustrialMachineForm from "./AddIndustrialMachineForm.jsx";
import RepairTypeList from "./RepairTypeList.jsx";
import AddRepairTypeForm from "./AddRepairTypeForm.jsx";

function App() {
    const [session, setSession] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Проверяем текущую сессию
        supabase.auth.getSession().then(({data: {session}}) => {
            setSession(session);
            setLoading(false);
        });

        // Слушаем изменения авторизации
        const {data: {subscription}} = supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) {
        return (
            <div className="loading-container">
                <p>Загрузка...</p>
            </div>
        );
    }

    return (
        <BrowserRouter>
            <div className="App">
                {session && (
                    <nav style={{
                        display: 'flex',
                        gap: '20px',
                        padding: '10px 20px',
                        backgroundColor: '#a0bcd0',
                        alignItems: 'center'
                    }}>
                        <Link to="/repairs" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s'
                        }}>
                            Список ремонтов
                        </Link>
                        <Link to="/industrial-machines" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s'
                        }}>
                            Список станков
                        </Link>
                        <Link to="/repair-types" style={{
                            color: 'white',
                            textDecoration: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            transition: 'background-color 0.3s'
                        }}>
                            Список типов ремонтов
                        </Link>
                        <button onClick={() => supabase.auth.signOut()} style={{
                            color: 'white',
                            backgroundColor: '#dc3545',
                            border: 'none',
                            padding: '8px 16px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s'
                        }}>
                            Выйти
                        </button>
                    </nav>
                )}

                <Routes>
                    <Route
                        path="/"
                        element={
                            !session ? <Auth/> : <Navigate to="/repairs" replace/>
                        }
                    />
                    <Route
                        path="/repairs"
                        element={
                            session ? <RepairList/> : <Navigate to="/" replace/>
                        }
                    />
                    <Route
                        path="/industrial-machines"
                        element={
                            session ? <IndustrialMachineList/> : <Navigate to="/" replace/>
                        }
                    />
                    <Route
                        path="/repair-types"
                        element={
                            session ? <RepairTypeList/> : <Navigate to="/" replace/>
                        }
                    />
                </Routes>
            </div>
        </BrowserRouter>
    );
}

export default App;