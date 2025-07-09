const names = [
  // Boys
  "aiden", "liam", "noah", "oliver", "elijah", "lucas", "mason", "logan", "james", "ethan",
  "benjamin", "jacob", "michael", "alexander", "sebastian", "jackson", "daniel", "henry", "jack", "owen",
  "leo", "wyatt", "carter", "grayson", "jayden", "gabriel", "levi", "matthew", "david", "joseph",
  "samuel", "luke", "anthony", "isaac", "dylan", "lincoln", "nathan", "ryan", "asher", "julian",
  "christopher", "joshua", "andrew", "theodore", "caleb", "hunter", "elias", "thomas", "charles", "ezra",
  "hudson", "isaiah", "connor", "nicholas", "ezekiel", "angel", "brayden", "adrian", "christian", "nolan",
  "jeremiah", "easton", "miles", "robert", "jordan", "jameson", "greyson", "ian", "adam", "axel",
  "jace", "josiah", "everett", "declan", "xavier", "camden", "kai", "colton", "carson", "roman",
  "brandon", "evan", "jorge", "bryson", "vincent", "damian", "sawyer", "wesley", "silas", "jason",
  "emmett", "gael", "riley", "kingston", "brody", "jonah", "beckett", "patrick", "emmanuel", "leonardo",
  "jaden", "calvin", "arthur", "theo", "finley", "kaden", "elliot", "reid", "maddox", "chance",
  "zane", "wade", "tristan", "griffin", "ronan", "tobias", "ace", "remy", "knox", "cody",
  "cooper", "niko", "malachi", "nehemiah", "luka", "colin", "ryder", "paxton", "tanner", "kyle",
  "eric", "john", "mark", "landon", "jamison", "keegan", "arjun", "amir", "jasper", "dax",

  // Girls
  "ellie", "violet", "lily", "nora", "aria", "hazel", "stella", "aurora", "savannah", "bella",
  "skylar", "claire", "lucy", "paisley", "everly", "anna", "caroline", "nova", "genesis", "aubrey",
  "leah", "allison", "savanna", "audrey", "samantha", "maya", "brooklyn", "luna", "grace", "chloe",
  "ella", "zoey", "ivy", "hannah", "elena", "penelope", "scarlett", "sophie", "camila", "madison",
  "isabelle", "ruby", "peyton", "autumn", "julia", "mackenzie", "serenity", "sienna", "mila", "eliza",
  "piper", "jade", "brielle", "reagan", "ariah", "eden", "kayla", "adeline", "vivian", "riley",
  "lyla", "valentina", "quinn", "delilah", "clara", "faith", "morgan", "kendall", "rose", "emilia",
  "melody", "jasmine", "lilah", "charlotte", "harper", "avery", "zoe", "alice", "cora", "lucia",
  "marie", "elise", "lola", "naomi", "willow", "gracie", "brynlee", "catalina", "daisy", "esme",
  "freya", "gia", "hallie", "ivory", "joy", "isla", "adelyn", "phoebe", "evie", "ruth",
  "wren", "noelle", "sage", "alina", "liana", "mabel", "juniper", "charlie", "blake", "remi",
  "logan", "sloane", "mira", "winter", "hadley", "elsie", "matilda", "tessa", "leighton", "camille",
  "rory", "marley", "dakota", "frances", "hope", "alexa", "celeste", "dahlia", "rowan", "helen",

  // Gender-neutral / Unisex
  "alex", "casey", "morgan", "jamie", "taylor", "blake", "riley", "jordan", "skyler", "drew",
  "parker", "reese", "charlie", "finley", "lennon", "sage", "rowan", "quinn", "remy", "dakota",
  "harley", "luca", "payton", "ash", "river", "kieran", "indigo", "phoenix", "landry", "monroe"
];

export const getRandomName = () => {
  return names[Math.floor(Math.random() * names.length)];
};
