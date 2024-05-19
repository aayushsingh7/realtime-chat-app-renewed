import { FC } from 'react'
import Button from '../components/Button'
import { BiMessageAltError } from 'react-icons/bi'

interface ErrorProps {

}

const Error: FC<ErrorProps> = ({ }) => {

    return (
        <div className='error'>
            <BiMessageAltError />
            <h2>Oops! something unexpected happended.</h2>
            <p>There's an issue and the page could not be loaded.</p>
            <Button children="Reload page" style={{ fontSize: "0.8rem", padding: "14px 25px", background: "var(--highlight-text-color)", color: "var(--primary-text-color)", marginTop: "40px", borderRadius: "10px" }} onClick={() => location.reload()} />
        </div>
    )
}

export default Error