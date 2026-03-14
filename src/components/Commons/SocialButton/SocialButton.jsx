import "./SocialButton.scss";

function SocialButton({ icon, text }) {
    return (
        <button className="social-btn">
            <img src={icon} alt="" />
            {text}
        </button>
    );
}

export default SocialButton;