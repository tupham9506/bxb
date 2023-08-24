const reasons = [
  { id: 1, content: 'to make your parents proud' },
  { id: 2, content: 'to conquer your fears' },
  { id: 3, content: 'to see your family again' },
  { id: 4, content: 'to see your favourite artist live' },
  { id: 5, content: 'to listen to music again' },
  { id: 6, content: 'to experience a new culture' },
  { id: 7, content: 'to make new friends' },
  { id: 8, content: 'to inspire' },
  { id: 9, content: 'to have your own children' },
  { id: 10, content: 'to adopt your own pet' },
  { id: 11, content: 'to make yourself proud' },
  { id: 12, content: 'to meet your idols' },
  { id: 13, content: 'to laugh until you cry' },
  { id: 14, content: 'to feel tears of happiness' },
  { id: 15, content: 'to eat your favourite food' },
  { id: 16, content: 'to see your siblings grow' },
  { id: 17, content: 'to pass school' },
  { id: 18, content: 'to get tattoo' },
  { id: 19, content: 'to smile until your cheeks hurt' },
  { id: 20, content: 'to meet your internet friends' },
  { id: 21, content: 'to find someone who loves you like you deserve' },
  { id: 22, content: 'to eat ice cream on a hot day' },
  { id: 23, content: 'to drink hot chocolate on a cold day' },
  { id: 24, content: 'to see untouched snow in the morning' },
  { id: 25, content: 'to see a sunset that sets the sky on fire' },
  { id: 26, content: 'to see stars light up the sky' },
  { id: 27, content: 'to read a book that changes your life' },
  { id: 28, content: 'to see the flowers in the spring' },
  { id: 29, content: 'to see the leaves change from green to brown' },
  { id: 30, content: 'to travel abroad' },
  { id: 31, content: 'to learn a new language' },
  { id: 32, content: 'to learn to draw' },
  { id: 33, content: 'to tell others your story in the hopes of helping them' },
  { id: 34, content: 'Puppy kisses.' },
  { id: 35, content: 'Baby kisses (the open mouthed kind when they smack their lips on your cheek).' },
  { id: 36, content: 'Swear words and the release you feel when you say them.' },
  { id: 37, content: 'Trampolines.' },
  { id: 38, content: 'Ice cream.' },
  { id: 39, content: 'Stargazing.' },
  { id: 40, content: 'Cloud watching.' },
  { id: 41, content: 'Taking a shower and then sleeping in clean sheets.' },
  { id: 42, content: 'Receiving thoughtful gifts.' },
  { id: 43, content: 'I saw this and thought of you.' },
  { id: 44, content: 'The feeling you get when someone you love says, I love you.' },
  { id: 45, content: 'The relief you feel after crying.' },
  { id: 46, content: 'Sunshine.' },
  { id: 47, content: 'The feeling you get when someone is listening to you/giving you their full attention.' },
  { id: 48, content: 'Your future wedding.' },
  { id: 49, content: 'Your favorite candy bar.' },
  { id: 50, content: 'New clothes.' },
  { id: 51, content: 'Witty puns.' },
  { id: 52, content: 'Really good bread.' },
  { id: 53, content: 'Holding your child in your arms for the first time.' },
  {
    id: 54,
    content:
      'Completing a milestone (aka going to college, graduating college, getting married, getting your dream job.)'
  },
  { id: 55, content: 'The kind of dreams where you wake up and can’t stop smiling.' },
  { id: 56, content: 'The smell before and after it rains.' },
  { id: 57, content: 'The sound of rain against a rooftop.' },
  { id: 58, content: 'The feeling you get when you’re dancing.' },
  { id: 59, content: 'The person (or people) that mean the most to you. Stay alive for them' },
  { id: 60, content: 'Trying out new recipes.' },
  { id: 61, content: 'The feeling you get when your favorite song comes on the radio.' },
  { id: 62, content: 'The rush you get when you step onto a stage.' },
  {
    id: 63,
    content: 'You have to share your voice and talents and knowledge with the world because they are so valuable.'
  },
  { id: 64, content: 'Breakfast in bed.' },
  { id: 65, content: 'Getting a middle seat in the movie theater.' },
  { id: 66, content: 'Breakfast for dinner (because it’s so much better at night than in the morning).' },
  { id: 67, content: 'Meaningful love.' },
  { id: 68, content: 'Forgiveness.' },
  { id: 69, content: 'Water balloon fights.' },
  { id: 70, content: 'New books by your favorite authors.' },
  { id: 71, content: 'Fireflies.' },
  { id: 72, content: 'Birthdays.' },
  { id: 73, content: 'Realizing that someone loves you.' },
  { id: 74, content: 'Spending the day with someone you love.' },
  { id: 75, content: 'Spending the whole day in bed.' },
  { id: 76, content: 'Eating a whole pint of your favorite ice cream.' },
  { id: 77, content: 'Floating in water on your back and just staring up at the sky.' },
  { id: 78, content: 'First dates (even the bad ones make for funny stories.)' },
  { id: 79, content: "Bonfires and s'mores." },
  { id: 80, content: 'Relationships where you love someone but aren’t in love with them.' },
  { id: 81, content: 'Coming home to someone you love.' },
  { id: 82, content: 'The color of autumn leaves when they change Summer.' },
  { id: 83, content: 'Singing songs at the top of your lungs with your friends.' },
  { id: 84, content: 'Cuddling.' },
  { id: 85, content: 'Being wrapped up in a warm bed.' },
  { id: 86, content: 'Someone’s skin against yours.' },
  { id: 87, content: 'Holding hands.' },
  {
    id: 88,
    content:
      'The kind of hugs when you can feel a weight being lifted off your shoulders. The kind of hug where your breath syncs with the other person’s, and you feel like the only two people in the world.'
  },
  { id: 89, content: 'Singing off key with your best friends.' },
  { id: 90, content: 'Road trips.' },
  { id: 91, content: 'Spontaneous adventures.' },
  { id: 92, content: 'The feeling of sand beneath your toes.' },
  { id: 93, content: 'The feeling when the first ocean wave rolls up and envelops your toes and ankles and knees.' },
  { id: 94, content: 'Thunderstorms.' },
  { id: 95, content: 'Your first (or hundredth) trip to Disneyland.' },
  { id: 96, content: 'The taste of your favorite food.' },
  { id: 97, content: 'The child-like feeling you get on Christmas morning.' },
  { id: 98, content: 'The day when everything finally goes your way.' },
  { id: 99, content: 'Compliments and praise.' },
  { id: 100, content: 'to look on this moment in 10 years time and realise you hAVE DONE IT' }
]

module.exports = {
  reasons
}
