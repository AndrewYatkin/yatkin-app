import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { supabase } from './supabaseClient';
import Auth from './Auth';
import RepairList from './RepairList';
import AddRepairForm from './AddRepairForm';
import IndustrialMachineList from "./IndustrialMachineList.jsx";
import AddIndustrialMachineForm from "./AddIndustrialMachineForm.jsx";

function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Проверяем текущую сессию
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Слушаем изменения авторизации
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
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
              <nav className="main-nav">
                <Link to="/repairs">Список ремонтов</Link>
                <Link to="/add-repair">Добавить ремонт</Link>
                <Link to="/industrial-machines">Список станков</Link>
                <Link to="/add-industrial-machine">Добавить станок</Link>
                <button onClick={() => supabase.auth.signOut()}>
                  Выйти
                </button>
              </nav>
          )}

          <Routes>
            <Route
                path="/"
                element={
                  !session ? <Auth /> : <Navigate to="/repairs" replace />
                }
            />
            <Route
                path="/repairs"
                element={
                  session ? <RepairList /> : <Navigate to="/" replace />
                }
            />
            <Route
                path="/add-repair"
                element={
                  session ? <AddRepairForm /> : <Navigate to="/" replace />
                }
            />
            <Route
                path="/industrial-machines"
                element={
                    session ? <IndustrialMachineList /> : <Navigate to="/" replace />
                }
            />
            <Route
                path="/add-industrial-machine"
                element={
                    session ? <AddIndustrialMachineForm /> : <Navigate to="/" replace />
                }
            />
          </Routes>
        </div>
      </BrowserRouter>
  );
}

export default App;