import { FC, useEffect, useState } from 'react'
import styles from '../styles/Status.module.css'
import { useNavigate, useSearchParams } from 'react-router-dom';
import { StatusType } from '../types/types';
import ViewFile from '../layouts/ViewFile';

interface StatusProps {
    socket: any;
}

const Status: FC<StatusProps> = ({ socket }) => {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams();
    const userId: string = searchParams.get("userId") || "";
    const [status, setStatus] = useState<StatusType[]>([])

    const fetchStatus = async (id: string) => {
        try {
            const userStatus = await fetch(`${import.meta.env.VITE_API_URL}/status?userId=${id}`, {
                method: 'GET',
                credentials: "include",
                headers: { "Content-Type": "application/json" }
            })
            let data = await userStatus.json()
            setStatus(data)
        } catch (err: any) {
        }
    }


    useEffect(() => {
        if (userId) {
            // fetchStatus(userId)
        }
    }, [userId])

    const exitStatus = () => {
        navigate("/status")
    }

    return (
        <div className={styles.status_page}>
            {
                !userId ? <section className={styles.status_temp}>
                    <p>Click on a user to view their status updates</p>
                </section> : <section className={styles.status}>
                    <ViewFile exitFunc={exitStatus} position={"relative"} />
                </section>
            }
        </div>
    )
}

export default Status