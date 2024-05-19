// ErrorBoundary.js

import { useState } from 'react';
import { BiMessageAltError } from 'react-icons/bi';
import Button from '../components/Button';

function ErrorBoundary({ children }) {
    const [hasError, setHasError] = useState(false);

    const handleOnError = () => {
        setHasError(true);
    };

    if (hasError) {
        return (
            <div className='error' style={{ background: "#040306" }}>
                <BiMessageAltError style={{ color: "#00b3a1" }} />
                <h2 style={{ color: "#eceaea" }}>Oops! something unexpected happended.</h2>
                <p style={{ color: "#a2a2a2" }}>There's an issue and the page could not be loaded.</p>
                <Button children="Reload page" style={{ fontSize: "0.8rem", padding: "14px 25px", background: "#00b3a1", color: "#eceaea", marginTop: "40px", borderRadius: "10px" }} onClick={() => location.reload()} />
            </div>
        );
    }

    return (
        <div onError={handleOnError}>
            {children}
        </div>
    );
}

export default ErrorBoundary;
