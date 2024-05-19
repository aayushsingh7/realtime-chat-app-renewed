import { FC } from 'react'

interface TypingProps {

}

const Typing: FC<TypingProps> = ({ }) => {
    return (

        <div className="typing">
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>
            <div className="typing__dot"></div>

        </div>

    )
}

export default Typing