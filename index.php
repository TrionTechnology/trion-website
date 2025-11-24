<?php get_header(); ?>

<!-- Hero Section -->
<section id="home" class="hero">
    <div class="hero-container">
        <div class="hero-content">
            <h1><?php echo get_theme_mod('hero_title', 'Next-Gen Software Solutions That Transform Business'); ?></h1>
            <p><?php echo get_theme_mod('hero_subtitle', 'We craft cutting-edge, AI-powered software solutions that revolutionize your business. From blockchain applications to machine learning systems, we build the future of technology.'); ?></p>
            <div class="hero-buttons">
                <a href="#contact" class="btn btn-primary"><?php echo get_theme_mod('hero_cta_primary', 'Get Started'); ?></a>
                <a href="#portfolio" class="btn btn-secondary"><?php echo get_theme_mod('hero_cta_secondary', 'View Our Work'); ?></a>
            </div>
        </div>
        <div class="hero-image">
            <?php 
            $hero_image = get_theme_mod('hero_image');
            if ($hero_image) {
                echo '<img src="' . esc_url($hero_image) . '" alt="Software Development Team">';
            } else {
                echo '<img src="https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80" alt="Software Development Team">';
            }
            ?>
        </div>
    </div>
</section>

<!-- Services Section -->
<section id="services" class="services">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('services_title', 'Our Services'); ?></h2>
            <p><?php echo get_theme_mod('services_subtitle', 'Cutting-edge technology solutions that drive innovation'); ?></p>
        </div>
        <div class="services-grid">
            <?php
            $services = get_theme_mod('services_items', array(
                array(
                    'icon' => 'fas fa-globe',
                    'title' => 'AI-Powered Web Apps',
                    'description' => 'Next-generation web applications with AI integration, real-time analytics, and immersive user experiences.'
                ),
                array(
                    'icon' => 'fas fa-mobile-alt',
                    'title' => 'Smart Mobile Solutions',
                    'description' => 'Intelligent mobile apps with IoT integration, AR/VR capabilities, and advanced biometric authentication.'
                ),
                array(
                    'icon' => 'fas fa-cloud',
                    'title' => 'Quantum Cloud Infrastructure',
                    'description' => 'Next-level cloud solutions with quantum computing integration, edge computing, and autonomous scaling.'
                ),
                array(
                    'icon' => 'fas fa-cogs',
                    'title' => 'Blockchain & DeFi',
                    'description' => 'Revolutionary blockchain applications, DeFi protocols, and smart contract development for the future of finance.'
                ),
                array(
                    'icon' => 'fas fa-database',
                    'title' => 'AI/ML Data Systems',
                    'description' => 'Advanced AI/ML data pipelines, neural networks, and predictive analytics for intelligent decision-making.'
                ),
                array(
                    'icon' => 'fas fa-shield-alt',
                    'title' => 'Cybersecurity & Zero Trust',
                    'description' => 'Next-generation cybersecurity with zero-trust architecture, AI threat detection, and quantum-resistant encryption.'
                )
            ));

            foreach ($services as $service) {
                echo '<div class="service-card">';
                echo '<div class="service-icon"><i class="' . esc_attr($service['icon']) . '"></i></div>';
                echo '<h3>' . esc_html($service['title']) . '</h3>';
                echo '<p>' . esc_html($service['description']) . '</p>';
                echo '</div>';
            }
            ?>
        </div>
    </div>
</section>

<!-- About Section -->
<section id="about" class="about">
    <div class="container">
        <div class="about-content">
            <div class="about-text">
                <h2><?php echo get_theme_mod('about_title', 'About Trion Creation'); ?></h2>
                <p><?php echo get_theme_mod('about_text_1', 'Pioneering the future of technology, Trion Creation leads the charge in next-generation software development. Our elite team of AI specialists, blockchain developers, and quantum computing experts create solutions that redefine what\'s possible in the digital age.'); ?></p>
                <p><?php echo get_theme_mod('about_text_2', 'We\'re not just building software—we\'re architecting the future. From AI-powered applications to quantum-resistant systems, we transform visionary ideas into revolutionary technology that drives exponential business growth.'); ?></p>
                <div class="stats">
                    <?php
                    $stats = get_theme_mod('stats_items', array(
                        array('number' => '100+', 'label' => 'AI Projects Deployed'),
                        array('number' => '50+', 'label' => 'Blockchain Solutions'),
                        array('number' => '99.9%', 'label' => 'Uptime Guarantee')
                    ));

                    foreach ($stats as $stat) {
                        echo '<div class="stat">';
                        echo '<h3>' . esc_html($stat['number']) . '</h3>';
                        echo '<p>' . esc_html($stat['label']) . '</p>';
                        echo '</div>';
                    }
                    ?>
                </div>
            </div>
            <div class="about-image">
                <?php 
                $about_image = get_theme_mod('about_image');
                if ($about_image) {
                    echo '<img src="' . esc_url($about_image) . '" alt="Our Team">';
                } else {
                    echo '<img src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2071&q=80" alt="Our Team">';
                }
                ?>
            </div>
        </div>
    </div>
</section>

<!-- Portfolio Section -->
<section id="portfolio" class="portfolio">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('portfolio_title', 'Our Portfolio'); ?></h2>
            <p><?php echo get_theme_mod('portfolio_subtitle', 'Revolutionary projects that define the future of technology'); ?></p>
        </div>
        <div class="portfolio-grid">
            <?php
            $portfolio_query = new WP_Query(array(
                'post_type' => 'portfolio',
                'posts_per_page' => 6,
                'post_status' => 'publish'
            ));

            if ($portfolio_query->have_posts()) {
                while ($portfolio_query->have_posts()) {
                    $portfolio_query->the_post();
                    $image_url = get_the_post_thumbnail_url(get_the_ID(), 'large');
                    if (!$image_url) {
                        $image_url = 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80';
                    }
                    ?>
                    <div class="portfolio-item">
                        <img src="<?php echo esc_url($image_url); ?>" alt="<?php echo esc_attr(get_the_title()); ?>">
                        <div class="portfolio-overlay">
                            <h3><?php echo esc_html(get_the_title()); ?></h3>
                            <p><?php echo esc_html(get_the_excerpt()); ?></p>
                        </div>
                    </div>
                    <?php
                }
                wp_reset_postdata();
            } else {
                // Fallback portfolio items
                $fallback_portfolio = array(
                    array('title' => 'AI-Powered E-commerce', 'description' => 'Next-gen shopping platform with AI recommendations and AR try-on', 'image' => 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2015&q=80'),
                    array('title' => 'Quantum Analytics Platform', 'description' => 'Real-time quantum computing-powered analytics and predictions', 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'),
                    array('title' => 'AI-Driven CRM', 'description' => 'Intelligent customer management with predictive analytics', 'image' => 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'),
                    array('title' => 'AR/VR Mobile Platform', 'description' => 'Immersive mobile experience with AR/VR and IoT integration', 'image' => 'https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'),
                    array('title' => 'Blockchain API Gateway', 'description' => 'Decentralized API services with smart contract integration', 'image' => 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'),
                    array('title' => 'Quantum Cloud Migration', 'description' => 'Legacy to quantum-ready cloud transformation', 'image' => 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80')
                );

                foreach ($fallback_portfolio as $item) {
                    echo '<div class="portfolio-item">';
                    echo '<img src="' . esc_url($item['image']) . '" alt="' . esc_attr($item['title']) . '">';
                    echo '<div class="portfolio-overlay">';
                    echo '<h3>' . esc_html($item['title']) . '</h3>';
                    echo '<p>' . esc_html($item['description']) . '</p>';
                    echo '</div>';
                    echo '</div>';
                }
            }
            ?>
        </div>
    </div>
</section>

<!-- Team Section -->
<section class="team">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('team_title', 'Meet Our Team'); ?></h2>
            <p><?php echo get_theme_mod('team_subtitle', 'The visionary minds shaping the future of technology'); ?></p>
        </div>
        <div class="team-grid">
            <?php
            $team_members = get_theme_mod('team_members', array(
                array(
                    'name' => 'Freddy Chen',
                    'position' => 'CEO & AI Visionary',
                    'description' => 'Pioneering AI strategist with expertise in quantum computing and blockchain innovation.',
                    'image' => 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
                ),
                array(
                    'name' => 'Ivan Rodriguez',
                    'position' => 'CTO & Quantum Architect',
                    'description' => 'Quantum computing specialist leading next-generation technology architecture.',
                    'image' => 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80'
                ),
                array(
                    'name' => 'Chew Wei',
                    'position' => 'Lead AI Engineer',
                    'description' => 'Machine learning expert specializing in neural networks and deep learning systems.',
                    'image' => 'https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
                ),
                array(
                    'name' => 'Stan Lee',
                    'position' => 'Blockchain Strategist',
                    'description' => 'DeFi expert and smart contract architect driving blockchain innovation.',
                    'image' => 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1974&q=80'
                )
            ));

            foreach ($team_members as $member) {
                echo '<div class="team-member">';
                echo '<img src="' . esc_url($member['image']) . '" alt="' . esc_attr($member['name']) . '">';
                echo '<h3>' . esc_html($member['name']) . '</h3>';
                echo '<p>' . esc_html($member['position']) . '</p>';
                echo '<p class="member-description">' . esc_html($member['description']) . '</p>';
                echo '</div>';
            }
            ?>
        </div>
    </div>
</section>

<!-- Contact Section -->
<section id="contact" class="contact">
    <div class="container">
        <div class="section-header">
            <h2><?php echo get_theme_mod('contact_title', 'Get In Touch'); ?></h2>
            <p><?php echo get_theme_mod('contact_subtitle', 'Ready to build the future? Let\'s create something revolutionary together.'); ?></p>
        </div>
        <div class="contact-content">
            <div class="contact-info">
                <div class="contact-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <div>
                        <h3><?php echo get_theme_mod('contact_address_title', 'Address'); ?></h3>
                        <p><?php echo get_theme_mod('contact_address', '123 Innovation Drive<br>Tech District, KL 50000<br>Malaysia'); ?></p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-phone"></i>
                    <div>
                        <h3><?php echo get_theme_mod('contact_phone_title', 'Phone'); ?></h3>
                        <p><?php echo get_theme_mod('contact_phone', '+60 3 1234 5678'); ?></p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-envelope"></i>
                    <div>
                        <h3><?php echo get_theme_mod('contact_email_title', 'Email'); ?></h3>
                        <p><?php echo get_theme_mod('contact_email', 'hello@trioncreation.com'); ?></p>
                    </div>
                </div>
                <div class="contact-item">
                    <i class="fas fa-clock"></i>
                    <div>
                        <h3><?php echo get_theme_mod('contact_hours_title', 'Business Hours'); ?></h3>
                        <p><?php echo get_theme_mod('contact_hours', 'Monday - Friday: 9:00 AM - 6:00 PM<br>Saturday: 9:00 AM - 2:00 PM'); ?></p>
                    </div>
                </div>
            </div>
            <div class="contact-form">
                <?php echo do_shortcode(get_theme_mod('contact_form_shortcode', '[contact-form-7 id="1" title="Contact form 1"]')); ?>
            </div>
        </div>
    </div>
</section>

<?php get_footer(); ?> 