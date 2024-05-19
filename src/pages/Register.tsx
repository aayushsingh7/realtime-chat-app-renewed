import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setIsError, setVerify } from "../slice/utilitySlices";
import styles from '../styles/LoginAndRegister.module.css';

interface RegisterProps { }

const Register: FC<RegisterProps> = ({ }) => {
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [email, setEmail] = useState<string>("")
  const [password, setPassword] = useState<string>("")
  const [username, setUsername] = useState<string>("")
  const [name, setName] = useState<string>("")
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const [newError, setNewError] = useState<string>("")

  const register = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
        method: "POST",
        body: JSON.stringify({ email, password, username, name }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status === 200) {
        setNewError("")
        navigate("/");
        dispatch(setVerify(true));
      } else {
        setNewError(data.message)
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      dispatch(setIsError(true));
    }
  }


  return (
    <div className={styles.container}>
      <div className={styles.box_container}>
        <div className={styles.part_one}>

        </div>
        <div className={styles.part_two}>

          <form className={styles.form} onSubmit={register}>
            <h2>Register</h2>
            <div className={styles.input_container}>
              <Input autoComplete="off" type="text" name="name" value={name} onChange={(e) => setName(e.target.value)} required style={{ padding: "14px", fontSize: "0.8rem", color: "var(--primary-text-color)", marginTop: "20px", background: "var(--light-background)", }} placeholder="Enter name" />


              <Input autoComplete="off" autoCapitalize="off" type="text" name="username" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().trim())} required style={{ padding: "14px", fontSize: "0.8rem", color: "var(--primary-text-color)", marginTop: "20px", background: "var(--light-background)", }} placeholder="Enter username" />

              <Input autoComplete="off" type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required style={{ padding: "14px", fontSize: "0.8rem", color: "var(--primary-text-color)", marginTop: "20px", background: "var(--light-background)", }} placeholder="Enter email" />

              <Input autoComplete="off" type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} required style={{ padding: "14px", fontSize: "0.8rem", color: "var(--primary-text-color)", marginTop: "20px", background: "var(--light-background)", }} placeholder="Enter password" />

            </div>
            <div className={styles.btn}>
              <label><input type="checkbox" /> remember me</label>
              <Button type="submit" children={<>{isLoading ? "Please wait" : "Register"} {isLoading && <div className={styles.loader}></div>}</>} style={{ background: "var(--highlight-text-color)", fontSize: "0.9rem", color: "var(--primary-text-color)", fontWeight: "500", marginTop: "15px", padding: "14px", height: "50px", borderRadius: "5px", width: "100%" }} />
            </div>
            <p className={styles.error_message}>{newError}</p>
          </form>
          <p className={styles.pp}>Already have an account? <Link to={'/login'}>Login</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Register;
