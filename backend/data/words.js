const words = [
  // (1–200) Animals & Nature
  "ant", "bear", "bee", "bird", "butterfly", "cat", "cow", "crab", "deer", "dog",
  "duck", "elephant", "fish", "frog", "giraffe", "goat", "horse", "kangaroo",
  "lion", "lizard", "monkey", "mouse", "octopus", "owl", "panda", "pig", "rabbit",
  "shark", "sheep", "snake", "spider", "squirrel", "tiger", "turtle", "whale",
  "zebra", "crocodile", "hedgehog", "hippopotamus", "raccoon", "rhinoceros",
  "seahorse", "swan", "turkey", "lobster", "flamingo", "koala", "penguin",
  "chimpanzee", "camel", "alligator", "buffalo", "chimp", "dolphin", "jellyfish",
  "ladybug", "mosquito", "peacock", "pelican", "porcupine", "salmon", "seal",
  "snail", "stingray", "walrus", "woodpecker", "worm",

  "tree", "flower", "grass", "leaf", "mountain", "river", "ocean", "cloud", "sun",
  "moon", "star", "rainbow", "rock", "sand", "snowman", "volcano", "beach",
  "island", "cactus", "forest", "desert", "waterfall", "waves", "storm",

  // (201–400) Food & Drinks
  "apple", "banana", "bread", "cake", "carrot", "cheese", "chocolate", "cookie",
  "corn", "donut", "egg", "grape", "hamburger", "ice cream", "lemon", "milk",
  "orange", "pizza", "potato", "sandwich", "strawberry", "tomato", "watermelon",
  "pear", "pineapple", "lettuce", "peas", "soup", "pasta", "rice", "tea", "coffee",
  "juice", "water", "hotdog", "popcorn", "cabbage", "mushroom", "bacon", "steak",
  "pancake", "waffle", "cereal", "burger", "nachos", "taco", "fries", "oatmeal",
  "cupcake", "beef", "chicken", "fish", "shrimp", "lobster", "clam", "melon",

  // (401–600) Household Items
  "chair", "table", "bed", "couch", "sofa", "desk", "lamp", "mirror", "clock",
  "door", "window", "curtain", "pillow", "blanket", "shelf", "drawer", "cabinet",
  "television", "radio", "computer", "laptop", "phone", "tablet", "camera",
  "book", "magazine", "newspaper", "pen", "pencil", "crayon", "marker", "brush",
  "comb", "toothbrush", "toothpaste", "soap", "towel", "shampoo", "fork", "knife",
  "spoon", "plate", "cup", "bottle", "glass", "cupboard", "stove", "oven", "fridge",
  "microwave", "sink", "toaster", "vacuum", "fan", "heater", "iron", "washing machine",
  "drying rack", "trash can", "rug", "mat", "clock", "calendar", "trash", "lightbulb",

  // (601–800) Vehicles & Transportation
  "car", "truck", "bus", "train", "tram", "subway", "bicycle", "motorcycle",
  "scooter", "boat", "ship", "plane", "helicopter", "rocket", "spaceship",
  "hot air balloon", "skateboard", "roller skates", "sailboat", "canoe", "canoe",
  "ferry", "u‑boat", "taxi", "ambulance", "fire truck", "police car", "tow truck",
  "snowmobile", "hovercraft", "segway", "golf cart", "yacht", "rowing boat",
  "jet ski", "submarine", "bulldozer", "excavator", "tractor", "forklift",

  // (801–1000+) Miscellaneous & Shapes
  "ball", "bat", "bell", "book", "box", "camera", "candle", "drum", "guitar",
  "harp", "piano", "violin", "trumpet", "saxophone", "flute", "clarinet", "trombone",
  "accordion", "microphone", "megaphone", "headphones", "kite", "umbrella", "hat",
  "glasses", "shoe", "sock", "boots", "glove", "ring", "necklace", "bracelet",
  "watch", "wallet", "backpack", "umbrella", "key", "lock", "map", "globe",
  "magnifying glass", "binoculars", "telescope", "compass", "puzzle", "board",
  "dice", "coin", "stamp", "ticket", "flag", "banner", "sign", "arrow", "heart",
  "star", "circle", "square", "triangle", "rectangle", "hexagon", "octagon",
  "diamond", "crescent", "spiral", "zigzag", "cloud", "lightning", "snowflake",
  "leaf", "feather", "shell", "rock", "drum", "shield", "helmet", "sword", "axe",
  "hammer", "wrench", "screwdriver", "saw", "pliers", "ruler", "paintbrush",
  "paint can", "bucket", "ladder", "hose", "rope", "net", "magnet", "battery",
  "plug", "socket", "candle", "lantern", "flashlight", "torch", "microphone",
  "speaker", "alarm clock", "thermometer", "wheel", "gear", "belt", "chain",
  "gearbox", "engine", "gas pump", "traffic light", "stop sign", "speed bump",
  "mailbox", "trash can", "recycling bin", "fence", "gate", "wall", "roof",
  "chimney", "bridge", "tower", "castle", "statue", "monument", "fountain",
  "tower", "skyscraper", "lighthouse", "barn", "shed", "hut", "tent", "tepee",
  "igloo", "palace", "mosque", "church", "temple", "synagogue"
];

/**
 * getRandomWords function
 * This function will return an array of 3 random words to start the game
 * This words will be sent to the current drawer that is chosen randomly
 */
export const getRandomWords = (n = 3) => {
    const shuffled = [...words].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
};
