import styles from './WhatsAppButton.module.css';

const WHATSAPP_NUMBER = '916352953127';
const WHATSAPP_MESSAGE = 'Hi, I am interested in your pharmaceutical products. Could you please share more details?';

const WhatsAppButton = () => {
  const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <a
      href={whatsappUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.whatsappBtn}
      aria-label="Chat on WhatsApp"
    >
      <svg viewBox="0 0 32 32" className={styles.icon} xmlns="http://www.w3.org/2000/svg">
        <path d="M16.004 0h-.008C7.174 0 .002 7.174.002 16.002c0 3.502 1.14 6.742 3.072 9.368L1.06 31.476l6.318-2.012A15.93 15.93 0 0 0 16.004 32C24.83 32 32 24.826 32 16.002 32 7.174 24.83 0 16.004 0zm9.31 22.602c-.39 1.098-1.924 2.01-3.17 2.276-.854.18-1.966.324-5.716-1.228-4.8-1.986-7.886-6.856-8.126-7.174-.228-.318-1.924-2.562-1.924-4.886 0-2.324 1.218-3.466 1.65-3.94.39-.428.92-.612 1.228-.612.15 0 .282.008.402.014.39.018.588.042.846.654.324.762 1.11 2.712 1.206 2.91.1.198.192.458.072.726-.108.276-.198.402-.39.618-.198.222-.384.39-.582.636-.18.21-.384.438-.162.858.222.414.984 1.626 2.112 2.634 1.452 1.296 2.676 1.698 3.054 1.884.39.192.612.162.84-.096.228-.264.978-1.14 1.236-1.53.258-.39.522-.324.876-.192.36.126 2.28 1.074 2.67 1.272.39.198.648.294.744.462.096.162.096.948-.294 2.046z" fill="white"/>
      </svg>
      <span className={styles.tooltip}>Chat with us</span>
    </a>
  );
};

export default WhatsAppButton;
