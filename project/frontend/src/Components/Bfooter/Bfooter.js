import React from 'react'
import './Bfooter.css';

function Bfooter() {
  return (
    <div>
      <footer class="main-footer">
                <div class="footer-top">
                    <div class="footer-column contact-us">
                        <h4>Contact Us</h4>
                        <ul>
                            <li>No: 34, Balagolla Kandy</li>
                            <li>+94 114 239 200(7)</li>
                            <li>+94 112 965 050</li>
                            <li>+94 112 450 230(3)</li>
                            <li><a href="mailto:info@agridept.gov.lk">suhuruwaga@gmail.com</a></li>
                        </ul>
                    </div>
                    <div class="footer-column related-links">
                        <h4>Related Links</h4>
                        <div class="links-grid">
                            <ul>
                                <li><a href="#">Ministry of Agriculture</a></li>
                                <li><a href="#">Ministry of Science Technology and Research</a></li>
                                <li><a href="#">Ministry of Irrigation</a></li>
                                <li><a href="#">Department of Animal Production & Health</a></li>
                            </ul>
                            <ul>
                                <li><a href="#">Ministry of Fisheries and Aquatic Resources Development</a></li>
                                <li><a href="#">Ministry of Plantation Industries</a></li>
                                <li><a href="#">Department of Agriculture</a></li>
                                <li><a href="#">More links</a></li>
                            </ul>
                        </div>
                    </div>
                </div>

                <div class="footer-bottom">
                    <p class="copyright">Copyright@2025 Department of Agriculture. All Rights Reserved.</p>
                </div>
            </footer>
    </div>
  )
}

export default Bfooter