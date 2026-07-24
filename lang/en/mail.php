<?php

return [
    'subjects' => [
        'verify_email' => 'Confirm your email address — The Agency',
        'reset_password' => 'Reset your password — The Agency',
        'welcome_seller' => 'Your The Agency professional workspace is ready',
        'property_pending' => 'Listing :reference received and under review',
        'admin_property_pending' => 'Action required: review listing :reference',
        'property_approved' => 'Listing :reference approved and published',
        'property_rejected' => 'Updates required for listing :reference',
        'property_enquiry' => 'New enquiry for listing :reference',
        'contact' => 'New website message — :subject',
        'manual_subscription' => 'Action required: :plan subscription request',
        'subscription_activated' => 'Your :plan subscription is active',
        'subscription_expired' => 'Your :plan subscription has expired',
        'subscription_expiring' => '{0} Your subscription expires today|{1} Your subscription expires tomorrow|[2,*] Your subscription expires in :count days',
    ],

    'common' => [
        'hello' => 'Hello :name,',
        'hello_team' => 'Hello,',
        'team' => 'The Agency team',
        'thank_you' => 'Thank you for choosing us.',
        'reference' => 'Reference',
        'property' => 'Listing',
        'not_provided' => 'Not provided',
        'not_available' => 'Not available',
        'unlimited' => 'No expiry date',
        'date_format' => 'm/d/Y',
        'view_dashboard' => 'Open the dashboard',
        'automated_notice' => 'This transactional message was sent automatically. If you need help, please use the contact page on our website.',
    ],

    'auth' => [
        'verify_greeting' => 'Welcome to The Agency, :name.',
        'verify_intro' => 'Confirm your email address to secure your account and access all our services.',
        'verify_action' => 'Confirm my email address',
        'verify_expiry' => 'This secure link expires in :count minutes.',
        'verify_ignore' => 'If you did not create this account, you may safely ignore this message.',
        'reset_greeting' => 'Hello :name,',
        'reset_intro' => 'We received a request to reset the password associated with your account.',
        'reset_action' => 'Reset my password',
        'reset_expiry' => 'This secure link expires in :count minutes.',
        'reset_ignore' => 'If you did not request a password reset, no action is required and your password remains unchanged.',
    ],

    'roles' => [
        'agency' => 'Real estate agency',
        'seller' => 'Private seller',
    ],

    'welcome' => [
        'title' => 'Your professional workspace is ready',
        'intro' => 'Your profile was updated successfully. You now have **:role** status.',
        'next' => 'You can now:',
        'publish' => 'create and submit property listings;',
        'manage' => 'manage your properties and track their review status;',
        'analytics' => 'view performance data from your dashboard.',
        'action' => 'Open my workspace',
    ],

    'property_pending' => [
        'title' => 'Your listing is under review',
        'intro' => 'We have received your listing **:title**.',
        'review' => 'Our team is reviewing its quality, accuracy and compliance before publication.',
        'timing' => 'We will email you as soon as the review is complete or if an update is required.',
        'action' => 'Track my listing',
    ],

    'admin_property' => [
        'title' => 'A listing is awaiting review',
        'intro' => 'A new listing was submitted and requires an administrative review before publication.',
        'title_label' => 'Title',
        'owner' => 'Submitted by',
        'email' => 'Email',
        'instruction' => 'Review the listing information, media and compliance, then approve it or request updates.',
        'action' => 'Review the listing',
    ],

    'property_approved' => [
        'title' => 'Your listing is live',
        'intro' => 'Good news: **:title** was approved after review.',
        'visibility' => 'It is now visible on The Agency and can be viewed by visitors.',
        'action' => 'View the published listing',
    ],

    'property_rejected' => [
        'title' => 'Updates are required',
        'intro' => 'The listing **:title** cannot be published in its current form.',
        'reason' => 'Reason provided by our team',
        'next' => 'Update the listed items, then submit the listing for another review.',
        'action' => 'Update my listing',
    ],

    'contact' => [
        'title' => 'New website message',
        'intro' => 'A visitor submitted an enquiry through the contact form.',
        'name' => 'Name',
        'email' => 'Email',
        'phone' => 'Phone',
        'subject' => 'Subject',
        'message' => 'Message',
        'reply' => 'Reply directly to this email to contact the sender.',
    ],

    'enquiry' => [
        'title' => 'New enquiry about your listing',
        'intro' => '**:name** would like more information about **:title**.',
        'sender' => 'Enquirer',
        'email' => 'Email',
        'phone' => 'Phone',
        'message' => 'Message',
        'safety' => 'For your safety, never share a password, verification code or banking information.',
        'reply' => 'Reply directly to this email to contact the enquirer.',
        'action' => 'View the listing',
    ],

    'billing' => [
        'plan' => 'Plan',
        'amount' => 'Amount',
        'start' => 'Start date',
        'expiry' => 'Expiry date',
        'user_id' => 'User ID',
        'subscription_id' => 'Subscription ID',
        'activated_title' => 'Your subscription is active',
        'activated_intro' => 'Your **:plan** plan was activated successfully. Its features are now available.',
        'activated_action' => 'View my subscription',
        'expired_title' => 'Your subscription has expired',
        'expired_intro' => 'Your **:plan** plan expired on **:date**.',
        'expired_effect' => 'Features included with this plan are paused until renewal. Your data and subscription history remain preserved.',
        'renew_action' => 'Renew my subscription',
        'expiring_title' => 'Your subscription expires soon',
        'expires_today' => 'Your **:plan** plan expires today.',
        'expires_later' => '{1} Your **:plan** plan expires in **1 day**.|[2,*] Your **:plan** plan expires in **:count days**.',
        'expiring_advice' => 'Renew before the expiry date to keep uninterrupted access to your features.',
        'manual_title' => 'New manual subscription request',
        'manual_intro' => 'A request for the **:plan** plan is awaiting an administrative decision.',
        'manual_instruction' => 'Verify the payment and requester identity before approving or rejecting it.',
        'manual_action' => 'Review the request',
    ],

    'footer' => [
        'rights' => '© :year The Agency. All rights reserved.',
        'confidentiality' => 'This communication is intended solely for its recipient.',
    ],
];
