import { FC } from "react";
import { PiWechatLogoFill } from "react-icons/pi";

interface HomeProps { }

const Home: FC<HomeProps> = ({ }) => {
  return (
    <div className="flex" style={{ width: "100%", height: "100%" }}>
      <div className="landing-template">
        <PiWechatLogoFill />
        <h3>Welcome To ChatVerse</h3>
        <p>Send and receive messages without keeping your phone online.</p>

      </div>
    </div>
  );
};

export default Home;
