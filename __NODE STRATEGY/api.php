<?php
    header("Access-Control-Allow-Origin: *"); // Allow requests from your frontend
    header("Content-Type: application/json; charset=UTF-8"); // Set response type to JSON

    // Path to your JSON file
    $file = 'mockup.json';

    // Get the raw POST data
    $data = file_get_contents("php://input");

    // Decode the JSON data into an associative array
    $input = json_decode($data, true);

    // Check if the password is correct
    $correctPassword = "kapuscinski"; // Set your password here
    if ($input['password'] !== $correctPassword) {
        http_response_code(401); // Unauthorized
        echo json_encode(["message" => "Incorrect password!"]);
        exit;
    }

    // Read the existing JSON file
    if (file_exists($file)) {
        $currentData = json_decode(file_get_contents($file), true);
    } else {
        $currentData = [];
    }

    // Add the new post to the existing data
    $currentData[] = $input;

    // Save the updated data back to the JSON file
    file_put_contents($file, json_encode($currentData, JSON_PRETTY_PRINT));

    // Respond with a success message
    echo json_encode(["message" => "Post added successfully!"]);
?>
