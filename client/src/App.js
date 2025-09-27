import React from "react"
import {Navigate, Route, Routes} from "react-router-dom"

// Stub components - minimal working versions
const Login = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Login</h2>
        <p>Login functionality coming soon!</p>
    </div>
)

const SignUp = () => (
    <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Sign Up</h2>
        <p>Registration functionality coming soon!</p>
    </div>
)

const Dashboard = () => (
    <div style={{ padding: '20px' }}>
        <h2>Dashboard</h2>
        <p>Dashboard functionality coming soon!</p>
    </div>
)

function App() {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<SignUp />}/>
            <Route path="/dashboard" element={<Dashboard />}/>
        </Routes>
    )
}

export default App