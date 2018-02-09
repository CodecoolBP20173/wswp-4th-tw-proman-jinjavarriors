// It is just an idea how you can structure your data during your page is running.
// You can use it for testing purposes by simply copy/paste/run in the Console tab in your browser

var keyInLocalStorage = 'proman-data';

sampleData = {
    "statuses": [
        {
            "id": 1,
            "name": "New"
        },
        {
            "id": 2,
            "name": "In progress"
        },
        {
            "id": 3,
            "name": "Testing"
        },
        {
            "id": 4,
            "name": "Done"
        }
    ],
    "boards": [
        {
            "id": 1,
            "title": "ProMan Project - jinJAVArriors",
            "is_active": false
        },
        {
            "id": 2,
            "title": "Bucket List",
            "is_active": false
        },
        {
            "id": 3,
            "title": "Pets",
            "is_active": false
        }
    ],
    "cards": [
        {
            "id": 1,
            "title": "Development / Create an environment (100)",
            "board_id": 1,
            "status_id": 4,
            "order": 1
        },
        {
            "id": 2,
            "title": "Boards / List page (1000)",
            "board_id": 1,
            "status_id": 4,
            "order": 2
        },
        {
            "id": 3,
            "title": "Boards / Detailed page (1000)",
            "board_id": 1,
            "status_id": 4,
            "order": 3
        },
        {
            "id": 4,
            "title": "Cards / Order (500)",
            "board_id": 1,
            "status_id": 4,
            "order": 4
        },
        {
            "id": 5,
            "title": "Cards / Statuses (600)",
            "board_id": 1,
            "status_id": 4,
            "order": 5
        },
        {
            "id": 6,
            "title": "Cards / Edit title (300)",
            "board_id": 1,
            "status_id": 4,
            "order": 6
        },
        {
            "id": 7,
            "title": "Climb to the Top of a Tree",
            "board_id": 2,
            "status_id": 4,
            "order": 1
        },
        {
            "id": 8,
            "title": "Horseback Ride on the Beach",
            "board_id": 2,
            "status_id": 3,
            "order": 1
        },
        {
            "id": 9,
            "title": "Kiss in the Rain",
            "board_id": 2,
            "status_id": 4,
            "order": 2
        },
        {
            "id":10,
            "title": "Start Fire Without Matches",
            "board_id": 2,
            "status_id": 1,
            "order": 1,
        },
        {
            "id":11,
            "title": "Find my Best Friend from High School",
            "board_id": 2,
            "status_id": 2,
            "order": 1,
        },
        {
            "id":12,
            "title": "Meet a World Leader",
            "board_id": 2,
            "status_id": 1,
            "order": 2,
        },
        {
            "id":13,
            "title": " Write a Thank you Letter to a Company that Treated you well",
            "board_id": 2,
            "status_id": 1,
            "order": 3,
        },
        {
            "id":14,
            "title": "Get Swag",
            "board_id": 2,
            "status_id": 3,
            "order": 2,
        },
        {
            "id":15,
            "title": "Orangutan",
            "board_id": 3,
            "status_id": 1,
            "order": 1,
        },
        {
            "id":16,
            "title": "Elephant",
            "board_id": 3,
            "status_id": 1,
            "order": 2,
        },
        {
            "id":17,
            "title": "Fish",
            "board_id": 3,
            "status_id": 4,
            "order": 1,
        },
        {
            "id":18,
            "title": "Goat",
            "board_id": 3,
            "status_id": 2,
            "order": 1,
        },
        {
            "id":10,
            "title": "Vietnamese Pot-bellied",
            "board_id": 3,
            "status_id": 3,
            "order": 1,
        }
    ]
};

localStorage.setItem(keyInLocalStorage, JSON.stringify(sampleData));

