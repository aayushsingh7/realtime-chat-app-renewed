import { FC } from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/Button'

interface NotFoundProps {

}

const NotFound: FC<NotFoundProps> = ({ }) => {
    const navigate = useNavigate()
    return (
        <div className='not-found'>

            <h2>Sorry, this page isn't available.</h2>
            <p>The link you followed may be broken, or the page may have been removed.</p>
            <Button children="Back to Home" style={{ fontSize: "0.8rem", padding: "14px 25px", background: "var(--highlight-text-color)", color: "var(--primary-text-color)", marginTop: "40px", borderRadius: "10px" }} onClick={() => navigate("/")} />
        </div>
    )
}

export default NotFound