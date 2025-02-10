import { FC, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import { useAppDispatch } from "../hooks/useAppDispatch";
import { setIsError, setVerify } from "../slice/utilitySlices";
import styles from '../styles/LoginAndRegister.module.css';

interface LoginProps { }

const Login: FC<LoginProps> = ({ }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [password, setPassword] = useState<string>("")
  const [email, setEmail] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [newError, setNewError] = useState<string>("")

  const login = async (e: any) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        body: JSON.stringify({ email, password }),
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      const data = await response.json();
      if (response.status === 200) {
        navigate("/");
        dispatch(setVerify(true));
        setNewError("")
      } else {
        setNewError(data.message)
      }
      setIsLoading(false)
    } catch (err) {
      setIsLoading(false)
      dispatch(setIsError(true));
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.box_container}>
        <div className={styles.part_one}>

        </div>
        <div className={styles.part_two}>
          <form className={styles.form} onSubmit={login}>
            <h2>Login🚀</h2>
            <div className={styles.input_container}>
              <Input type="email" autoComplete="off" required style={{ padding: "14px", fontSize: "0.8rem", color: "var(--primary-text-color)", marginTop: "20px", background: "var(--light-background)" }} placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} />
              <Input autoComplete="off" type="password" required style={{ padding: "14px", fontSize: "0.8rem", color: "var(--primary-text-color)", marginTop: "20px", background: "var(--light-background)" }} placeholder="Enter your password" onChange={(e) => setPassword(e.target.value)} value={password} />
              <p>Forgot password</p>
            </div>
            <div className={styles.btn}>
              <label><input type="checkbox" /> save my login details</label>
              <Button type="submit" children={<>{isLoading ? "Please wait" : "Login"} {isLoading && <div className={styles.loader}></div>}</>} style={{ background: "var(--highlight-text-color)", fontSize: "0.9rem", color: "var(--primary-text-color)", fontWeight: "500", marginTop: "15px", padding: "14px", height: "50px", borderRadius: "5px", width: "100%" }} />
            </div>
            {newError && <p className={styles.error_message}>{newError}</p>}
          </form>
          <p className={styles.pp}>Doesn't have an account? <Link to={'/register'}>Register</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
