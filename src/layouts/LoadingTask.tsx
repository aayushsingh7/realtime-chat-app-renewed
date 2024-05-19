import { FC } from 'react'
import styles from '@/styles/LoadingTask.module.css'

interface LoadingTaskProps { }

const LoadingTask: FC<LoadingTaskProps> = ({ }) => {
    return (
        <div className='loading-template'>
            <div className='loader-2'></div>
        </div>
    )
}

export default LoadingTask