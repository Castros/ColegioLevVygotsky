<?php
  // Replace these with your own email address and site domain
  $recipient = "your_email@example.com";
  $site_domain = "example.com";

  // Set the email subject
  $subject = "Contact form submission from " . $site_domain;

  // Collect the form data
  $name = $_POST["name"];
  $email = $_POST["email"];
  $message = $_POST["message"];

  // Create the email content
  $email_content = "Name: $name\n";
  $email_content .= "Email: $email\n\n";
  $email_content .= "Message:\n$message\n";

  // Set the email headers
  $email_headers = "From: $name <$email>";

  // Send the email
  mail($recipient, $subject, $email_content, $email_headers);

  // Redirect to
