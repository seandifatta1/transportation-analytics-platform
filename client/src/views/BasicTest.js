import React from 'react';

const BasicTest = () => {
    return (
        <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Basic Test Component</h2>
            <p>This is the most basic React component possible for testing.</p>
            <button onClick={() => alert('Button clicked!')}>
                Click me
            </button>
        </div>
    );
};

export default BasicTest;
