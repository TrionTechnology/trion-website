<?php
/**
 * Trion Creation Tech Theme Functions
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * Theme Setup
 */
function trion_creation_setup() {
    // Add theme support
    add_theme_support('title-tag');
    add_theme_support('post-thumbnails');
    add_theme_support('custom-logo');
    add_theme_support('html5', array(
        'search-form',
        'comment-form',
        'comment-list',
        'gallery',
        'caption',
    ));
    add_theme_support('customize-selective-refresh-widgets');
    add_theme_support('responsive-embeds');

    // Register navigation menus
    register_nav_menus(array(
        'primary' => __('Primary Menu', 'trion-creation'),
        'footer' => __('Footer Menu', 'trion-creation'),
    ));

    // Add image sizes
    add_image_size('portfolio-thumb', 400, 300, true);
    add_image_size('team-member', 300, 300, true);
}
add_action('after_setup_theme', 'trion_creation_setup');

/**
 * Enqueue scripts and styles
 */
function trion_creation_scripts() {
    // Enqueue styles
    wp_enqueue_style('trion-creation-style', get_stylesheet_uri(), array(), '1.0.0');
    wp_enqueue_style('google-fonts', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap', array(), null);
    wp_enqueue_style('font-awesome', 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css', array(), '6.0.0');

    // Enqueue scripts
    wp_enqueue_script('trion-creation-script', get_template_directory_uri() . '/script.js', array('jquery'), '1.0.0', true);

    // Localize script for AJAX
    wp_localize_script('trion-creation-script', 'trion_ajax', array(
        'ajax_url' => admin_url('admin-ajax.php'),
        'nonce' => wp_create_nonce('trion_nonce'),
    ));
}
add_action('wp_enqueue_scripts', 'trion_creation_scripts');

/**
 * Customizer additions
 */
function trion_creation_customize_register($wp_customize) {
    // Hero Section
    $wp_customize->add_section('hero_section', array(
        'title' => __('Hero Section', 'trion-creation'),
        'priority' => 30,
    ));

    $wp_customize->add_setting('hero_title', array(
        'default' => 'Next-Gen Software Solutions That Transform Business',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('hero_title', array(
        'label' => __('Hero Title', 'trion-creation'),
        'section' => 'hero_section',
        'type' => 'text',
    ));

    $wp_customize->add_setting('hero_subtitle', array(
        'default' => 'We craft cutting-edge, AI-powered software solutions that revolutionize your business.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('hero_subtitle', array(
        'label' => __('Hero Subtitle', 'trion-creation'),
        'section' => 'hero_section',
        'type' => 'textarea',
    ));

    $wp_customize->add_setting('hero_image');
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'hero_image', array(
        'label' => __('Hero Image', 'trion-creation'),
        'section' => 'hero_section',
    )));

    // Services Section
    $wp_customize->add_section('services_section', array(
        'title' => __('Services Section', 'trion-creation'),
        'priority' => 31,
    ));

    $wp_customize->add_setting('services_title', array(
        'default' => 'Our Services',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('services_title', array(
        'label' => __('Services Title', 'trion-creation'),
        'section' => 'services_section',
        'type' => 'text',
    ));

    // About Section
    $wp_customize->add_section('about_section', array(
        'title' => __('About Section', 'trion-creation'),
        'priority' => 32,
    ));

    $wp_customize->add_setting('about_title', array(
        'default' => 'About Trion Creation',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('about_title', array(
        'label' => __('About Title', 'trion-creation'),
        'section' => 'about_section',
        'type' => 'text',
    ));

    $wp_customize->add_setting('about_text_1', array(
        'default' => 'Pioneering the future of technology, Trion Creation leads the charge in next-generation software development.',
        'sanitize_callback' => 'sanitize_textarea_field',
    ));
    $wp_customize->add_control('about_text_1', array(
        'label' => __('About Text 1', 'trion-creation'),
        'section' => 'about_section',
        'type' => 'textarea',
    ));

    $wp_customize->add_setting('about_image');
    $wp_customize->add_control(new WP_Customize_Image_Control($wp_customize, 'about_image', array(
        'label' => __('About Image', 'trion-creation'),
        'section' => 'about_section',
    )));

    // Contact Section
    $wp_customize->add_section('contact_section', array(
        'title' => __('Contact Section', 'trion-creation'),
        'priority' => 33,
    ));

    $wp_customize->add_setting('contact_email', array(
        'default' => 'hello@trioncreation.com',
        'sanitize_callback' => 'sanitize_email',
    ));
    $wp_customize->add_control('contact_email', array(
        'label' => __('Contact Email', 'trion-creation'),
        'section' => 'contact_section',
        'type' => 'email',
    ));

    $wp_customize->add_setting('contact_phone', array(
        'default' => '+60 3 1234 5678',
        'sanitize_callback' => 'sanitize_text_field',
    ));
    $wp_customize->add_control('contact_phone', array(
        'label' => __('Contact Phone', 'trion-creation'),
        'section' => 'contact_section',
        'type' => 'text',
    ));

    $wp_customize->add_setting('contact_address', array(
        'default' => '123 Innovation Drive<br>Tech District, KL 50000<br>Malaysia',
        'sanitize_callback' => 'wp_kses_post',
    ));
    $wp_customize->add_control('contact_address', array(
        'label' => __('Contact Address', 'trion-creation'),
        'section' => 'contact_section',
        'type' => 'textarea',
    ));

    // Social Media
    $wp_customize->add_section('social_section', array(
        'title' => __('Social Media', 'trion-creation'),
        'priority' => 34,
    ));

    $social_platforms = array('linkedin', 'twitter', 'facebook', 'instagram');
    foreach ($social_platforms as $platform) {
        $wp_customize->add_setting('social_' . $platform, array(
            'sanitize_callback' => 'esc_url_raw',
        ));
        $wp_customize->add_control('social_' . $platform, array(
            'label' => ucfirst($platform) . ' URL',
            'section' => 'social_section',
            'type' => 'url',
        ));
    }
}
add_action('customize_register', 'trion_creation_customize_register');

/**
 * Register Custom Post Types
 */
function trion_creation_post_types() {
    // Portfolio Post Type
    register_post_type('portfolio', array(
        'labels' => array(
            'name' => __('Portfolio', 'trion-creation'),
            'singular_name' => __('Portfolio Item', 'trion-creation'),
            'add_new' => __('Add New', 'trion-creation'),
            'add_new_item' => __('Add New Portfolio Item', 'trion-creation'),
            'edit_item' => __('Edit Portfolio Item', 'trion-creation'),
            'new_item' => __('New Portfolio Item', 'trion-creation'),
            'view_item' => __('View Portfolio Item', 'trion-creation'),
            'search_items' => __('Search Portfolio', 'trion-creation'),
            'not_found' => __('No portfolio items found', 'trion-creation'),
            'not_found_in_trash' => __('No portfolio items found in trash', 'trion-creation'),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail', 'excerpt'),
        'menu_icon' => 'dashicons-portfolio',
        'rewrite' => array('slug' => 'portfolio'),
    ));

    // Team Post Type
    register_post_type('team', array(
        'labels' => array(
            'name' => __('Team', 'trion-creation'),
            'singular_name' => __('Team Member', 'trion-creation'),
            'add_new' => __('Add New', 'trion-creation'),
            'add_new_item' => __('Add New Team Member', 'trion-creation'),
            'edit_item' => __('Edit Team Member', 'trion-creation'),
            'new_item' => __('New Team Member', 'trion-creation'),
            'view_item' => __('View Team Member', 'trion-creation'),
            'search_items' => __('Search Team', 'trion-creation'),
            'not_found' => __('No team members found', 'trion-creation'),
            'not_found_in_trash' => __('No team members found in trash', 'trion-creation'),
        ),
        'public' => true,
        'has_archive' => true,
        'supports' => array('title', 'editor', 'thumbnail'),
        'menu_icon' => 'dashicons-groups',
        'rewrite' => array('slug' => 'team'),
    ));
}
add_action('init', 'trion_creation_post_types');

/**
 * Add meta boxes for team members
 */
function trion_creation_add_meta_boxes() {
    add_meta_box(
        'team_member_details',
        __('Team Member Details', 'trion-creation'),
        'trion_creation_team_meta_box',
        'team',
        'normal',
        'high'
    );
}
add_action('add_meta_boxes', 'trion_creation_add_meta_boxes');

function trion_creation_team_meta_box($post) {
    wp_nonce_field('trion_creation_team_meta_box', 'trion_creation_team_meta_box_nonce');
    
    $position = get_post_meta($post->ID, '_team_position', true);
    $linkedin = get_post_meta($post->ID, '_team_linkedin', true);
    $twitter = get_post_meta($post->ID, '_team_twitter', true);
    
    echo '<table class="form-table">';
    echo '<tr><th><label for="team_position">' . __('Position', 'trion-creation') . '</label></th>';
    echo '<td><input type="text" id="team_position" name="team_position" value="' . esc_attr($position) . '" class="regular-text" /></td></tr>';
    echo '<tr><th><label for="team_linkedin">' . __('LinkedIn URL', 'trion-creation') . '</label></th>';
    echo '<td><input type="url" id="team_linkedin" name="team_linkedin" value="' . esc_url($linkedin) . '" class="regular-text" /></td></tr>';
    echo '<tr><th><label for="team_twitter">' . __('Twitter URL', 'trion-creation') . '</label></th>';
    echo '<td><input type="url" id="team_twitter" name="team_twitter" value="' . esc_url($twitter) . '" class="regular-text" /></td></tr>';
    echo '</table>';
}

function trion_creation_save_team_meta($post_id) {
    if (!isset($_POST['trion_creation_team_meta_box_nonce'])) {
        return;
    }
    if (!wp_verify_nonce($_POST['trion_creation_team_meta_box_nonce'], 'trion_creation_team_meta_box')) {
        return;
    }
    if (defined('DOING_AUTOSAVE') && DOING_AUTOSAVE) {
        return;
    }
    if (!current_user_can('edit_post', $post_id)) {
        return;
    }

    $fields = array('team_position', 'team_linkedin', 'team_twitter');
    foreach ($fields as $field) {
        if (isset($_POST[$field])) {
            update_post_meta($post_id, '_' . $field, sanitize_text_field($_POST[$field]));
        }
    }
}
add_action('save_post', 'trion_creation_save_team_meta');

/**
 * AJAX handler for contact form
 */
function trion_creation_contact_form_handler() {
    check_ajax_referer('trion_nonce', 'nonce');
    
    $name = sanitize_text_field($_POST['name']);
    $email = sanitize_email($_POST['email']);
    $subject = sanitize_text_field($_POST['subject']);
    $message = sanitize_textarea_field($_POST['message']);
    
    $to = get_theme_mod('contact_email', 'hello@trioncreation.com');
    $headers = array('Content-Type: text/html; charset=UTF-8');
    
    $email_content = "
    <h2>New Contact Form Submission</h2>
    <p><strong>Name:</strong> {$name}</p>
    <p><strong>Email:</strong> {$email}</p>
    <p><strong>Subject:</strong> {$subject}</p>
    <p><strong>Message:</strong></p>
    <p>{$message}</p>
    ";
    
    $sent = wp_mail($to, 'New Contact Form Submission - ' . $subject, $email_content, $headers);
    
    if ($sent) {
        wp_send_json_success('Message sent successfully!');
    } else {
        wp_send_json_error('Failed to send message. Please try again.');
    }
}
add_action('wp_ajax_contact_form', 'trion_creation_contact_form_handler');
add_action('wp_ajax_nopriv_contact_form', 'trion_creation_contact_form_handler');

/**
 * Widget areas
 */
function trion_creation_widgets_init() {
    register_sidebar(array(
        'name' => __('Footer Widget Area', 'trion-creation'),
        'id' => 'footer-widget-area',
        'description' => __('Add widgets here to appear in the footer.', 'trion-creation'),
        'before_widget' => '<div id="%1$s" class="widget %2$s">',
        'after_widget' => '</div>',
        'before_title' => '<h4 class="widget-title">',
        'after_title' => '</h4>',
    ));
}
add_action('widgets_init', 'trion_creation_widgets_init');

/**
 * Custom excerpt length
 */
function trion_creation_excerpt_length($length) {
    return 20;
}
add_filter('excerpt_length', 'trion_creation_excerpt_length');

/**
 * Custom excerpt more
 */
function trion_creation_excerpt_more($more) {
    return '...';
}
add_filter('excerpt_more', 'trion_creation_excerpt_more');

/**
 * Add custom body classes
 */
function trion_creation_body_classes($classes) {
    if (is_page_template('page-fullwidth.php')) {
        $classes[] = 'full-width-page';
    }
    return $classes;
}
add_filter('body_class', 'trion_creation_body_classes');
?> 