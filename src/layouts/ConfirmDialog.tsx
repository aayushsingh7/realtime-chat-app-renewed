import { FC } from 'react'
import styles from '../styles/ConfirmDialog.module.css'
import Button from '../components/Button';

interface ConfirmDialogProps {
    heading: string;
    body: string;
    btnText: string;
    onConfirm: any;
    onCancle: any;
    btnText2?: string;
}

const ConfirmDialog: FC<ConfirmDialogProps> = ({ heading, body, btnText, onCancle, onConfirm, btnText2 }) => {

    const handleConfirm = () => {
        onConfirm()
    }

    const handleCancle = () => {
        onCancle()
    }


    return (
        <div className={styles.shadow}>
            <div className={styles.container}>
                <div className={styles.part_one}>
                    <h3>{heading}</h3>
                    <p>{body}</p>
                </div>
                <div className={styles.part_two}>
                    <Button style={{ padding: "13px", fontSize: "0.78rem", fontWeight: "500", borderRadius: "5px", width: "100%", background: "var(--lighter-highlight-background)" }} onClick={handleConfirm} children={btnText} />
                    <Button style={{ padding: "13px", fontSize: "0.78rem", fontWeight: "500", borderRadius: "5px", width: "100%", background: "var(--light-background)" }} onClick={handleCancle} children={btnText2 ? btnText2 : "Cancle"} />
                </div>
            </div>
        </div>
    )
}

export default ConfirmDialog