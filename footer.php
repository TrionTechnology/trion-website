<!-- Footer -->
<footer class="footer">
    <div class="container">
        <div class="footer-content">
            <div class="footer-section">
                <h3><?php bloginfo('name'); ?></h3>
                <p><?php echo get_theme_mod('footer_description', 'Next-generation software solutions that revolutionize business and technology.'); ?></p>
                <div class="social-links">
                    <?php
                    $social_links = array(
                        'linkedin' => get_theme_mod('social_linkedin'),
                        'twitter' => get_theme_mod('social_twitter'),
                        'facebook' => get_theme_mod('social_facebook'),
                        'instagram' => get_theme_mod('social_instagram')
                    );
                    
                    foreach ($social_links as $platform => $url) {
                        if ($url) {
                            echo '<a href="' . esc_url($url) . '" target="_blank"><i class="fab fa-' . esc_attr($platform) . '"></i></a>';
                        }
                    }
                    ?>
                </div>
            </div>
            <div class="footer-section">
                <h4><?php echo get_theme_mod('footer_services_title', 'Services'); ?></h4>
                <ul>
                    <li><a href="#services">Web Development</a></li>
                    <li><a href="#services">Mobile Development</a></li>
                    <li><a href="#services">Cloud Solutions</a></li>
                    <li><a href="#services">Custom Software</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4><?php echo get_theme_mod('footer_company_title', 'Company'); ?></h4>
                <ul>
                    <li><a href="#about">About Us</a></li>
                    <li><a href="#portfolio">Portfolio</a></li>
                    <li><a href="#contact">Contact</a></li>
                    <li><a href="<?php echo esc_url(home_url('/blog')); ?>">Blog</a></li>
                </ul>
            </div>
            <div class="footer-section">
                <h4><?php echo get_theme_mod('footer_newsletter_title', 'Newsletter'); ?></h4>
                <p><?php echo get_theme_mod('footer_newsletter_text', 'Stay updated with our latest projects and insights.'); ?></p>
                <form class="newsletter-form">
                    <input type="email" placeholder="<?php echo esc_attr(get_theme_mod('footer_newsletter_placeholder', 'Enter your email')); ?>">
                    <button type="submit"><?php echo esc_html(get_theme_mod('footer_newsletter_button', 'Subscribe')); ?></button>
                </form>
            </div>
        </div>
        <div class="footer-bottom">
            <p>&copy; <?php echo date('Y'); ?> <?php bloginfo('name'); ?>. <?php echo get_theme_mod('footer_copyright', 'All rights reserved.'); ?></p>
        </div>
    </div>
</footer>

<?php wp_footer(); ?>
</body>
</html> 