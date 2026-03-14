import "./FooterLayout.scss";

export default function Footer() {
  return (
    <footer className="footer">

      {/* NEWSLETTER */}

      <div className="footer-news">
        <h2>Newsletter</h2>
        <p>
          Stay up to date with the latest news from the world of Ferrari.
        </p>

        <button className="subscribe-btn">
          SUBSCRIBE
        </button>
      </div>



      {/* FOOTER MENU */}

      <div className="footer-menu">

        <div className="footer-col">
          <h4>RACING</h4>
          <ul>
            <li>Scuderia Ferrari HP</li>
            <li>SF-26</li>
            <li>Charles Leclerc</li>
            <li>Lewis Hamilton</li>
            <li>Hypercar</li>
            <li>GT Series</li>
            <li>Hypersail</li>
            <li>Esports</li>
            <li>Driver Academy</li>
            <li>Ferrari Club</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>SPORTS CARS</h4>
          <ul>
            <li>Range</li>
            <li>Configure your Ferrari</li>
            <li>MyFerrari</li>
            <li>Pre-owned</li>
            <li>Dealers</li>
            <li>Recall information</li>
            <li>Techinfo</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>COLLECTIONS</h4>
          <ul>
            <li>Men</li>
            <li>Women</li>
            <li>Kids</li>
            <li>Shoes</li>
            <li>Eyewear</li>
            <li>Collectibles</li>
            <li>Scuderia Ferrari Selection</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>EXPERIENCES</h4>
          <ul>
            <li>Corse Clienti</li>
            <li>Ferrari Esports Series</li>
            <li>Ristorante Cavallino</li>
            <li>Ferrari Museums</li>
            <li>Ferrari World Abu Dhabi</li>
            <li>Ferrari Land Barcelona</li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>ABOUT US</h4>
          <ul>
            <li>Corporate</li>
            <li>Sustainability</li>
            <li>Media Centre</li>
            <li>News</li>
            <li>Magazine</li>
            <li>History</li>
            <li>Join us</li>
          </ul>
        </div>

      </div>

    </footer>
  );
}